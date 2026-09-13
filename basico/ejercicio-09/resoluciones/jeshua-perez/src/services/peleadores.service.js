/**
 * Servicio de dominio: peleadores de kickboxing.
 *
 * Recibe el repositorio por inyeccion, asi las pruebas le pasan uno que apunta
 * a un archivo temporal y nunca tocan los datos de verdad.
 */

export class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

export class NoEncontradoError extends Error {
  constructor(id) {
    super(`No existe el peleador ${id}.`);
    this.name = 'NoEncontradoError';
    this.statusCode = 404;
  }
}

export const CATEGORIAS = Object.freeze(['pluma', 'ligero', 'medio', 'pesado']);

/** Rango de peso admitido por categoria, en kilos. */
export const PESOS = Object.freeze({
  pluma: [50, 57],
  ligero: [57, 65],
  medio: [65, 84],
  pesado: [84, 120],
});

export const RESULTADOS = Object.freeze(['victoria', 'derrota', 'empate', 'ko']);

export function calcularEstadisticas(peleador) {
  const combates = peleador.victorias + peleador.derrotas + peleador.empates;

  return {
    ...peleador,
    combates,
    porcentajeVictorias:
      combates === 0 ? 0 : Number(((peleador.victorias / combates) * 100).toFixed(1)),
    porcentajeKo:
      peleador.victorias === 0 ? 0 : Number(((peleador.ko / peleador.victorias) * 100).toFixed(1)),
  };
}

function validarTexto(valor, etiqueta, minimo = 2, maximo = 40) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ValidacionError(`${etiqueta} es obligatorio.`);
  }

  const limpio = valor.trim();

  if (limpio.length < minimo || limpio.length > maximo) {
    throw new ValidacionError(`${etiqueta} debe tener entre ${minimo} y ${maximo} caracteres.`);
  }

  return limpio;
}

function validarEntero(valor, etiqueta, minimo = 0) {
  if (!Number.isInteger(valor) || valor < minimo) {
    throw new ValidacionError(`${etiqueta} debe ser un entero mayor o igual a ${minimo}.`);
  }

  return valor;
}

function validarId(id) {
  const numero = Number(id);

  if (!Number.isInteger(numero)) {
    throw new ValidacionError('El id debe ser un entero.');
  }

  return numero;
}

/** Valida los datos de alta y devuelve el peleador normalizado, sin id. */
export function validarNuevoPeleador(datos = {}) {
  const nombre = validarTexto(datos.nombre, 'El nombre', 3);
  const apodo = validarTexto(datos.apodo, 'El apodo');

  if (typeof datos.categoria !== 'string' || !CATEGORIAS.includes(datos.categoria.toLowerCase())) {
    throw new ValidacionError(`La categoria debe ser una de: ${CATEGORIAS.join(', ')}.`);
  }

  const categoria = datos.categoria.toLowerCase();
  const [minimo, maximo] = PESOS[categoria];

  if (!Number.isFinite(datos.pesoKg)) {
    throw new ValidacionError('El peso debe ser un numero.');
  }

  if (datos.pesoKg < minimo || datos.pesoKg > maximo) {
    throw new ValidacionError(
      `Para la categoria ${categoria} el peso debe estar entre ${minimo} y ${maximo} kg.`,
    );
  }

  const victorias = validarEntero(datos.victorias ?? 0, 'Las victorias');
  const derrotas = validarEntero(datos.derrotas ?? 0, 'Las derrotas');
  const empates = validarEntero(datos.empates ?? 0, 'Los empates');
  const ko = validarEntero(datos.ko ?? 0, 'Los KO');

  if (ko > victorias) {
    throw new ValidacionError('Los KO no pueden superar a las victorias.');
  }

  return { nombre, apodo, categoria, pesoKg: datos.pesoKg, victorias, derrotas, empates, ko };
}

export function crearServicioPeleadores(repositorio) {
  return {
    async listar(filtros = {}) {
      const { peleadores } = await repositorio.leer();

      let resultado = peleadores;

      if (filtros.categoria !== undefined) {
        const categoria = String(filtros.categoria).toLowerCase();

        if (!CATEGORIAS.includes(categoria)) {
          throw new ValidacionError(`La categoria debe ser una de: ${CATEGORIAS.join(', ')}.`);
        }

        resultado = resultado.filter((peleador) => peleador.categoria === categoria);
      }

      return resultado.map(calcularEstadisticas);
    },

    async obtener(id) {
      const numero = validarId(id);
      const { peleadores } = await repositorio.leer();
      const encontrado = peleadores.find((peleador) => peleador.id === numero);

      if (!encontrado) {
        throw new NoEncontradoError(numero);
      }

      return calcularEstadisticas(encontrado);
    },

    async crear(datos) {
      const nuevo = validarNuevoPeleador(datos);

      const guardado = await repositorio.actualizar((estado) => {
        const siguienteId =
          estado.peleadores.reduce((maximo, peleador) => Math.max(maximo, peleador.id), 0) + 1;

        estado.peleadores.push({
          id: siguienteId,
          ...nuevo,
          debutEn: new Date().toISOString().slice(0, 10),
        });

        estado.actualizadoEn = new Date().toISOString();

        return estado;
      });

      return calcularEstadisticas(guardado.peleadores.at(-1));
    },

    /** Registra el resultado de un combate sumando al historial. */
    async registrarCombate(id, resultado) {
      const numero = validarId(id);

      if (!RESULTADOS.includes(resultado)) {
        throw new ValidacionError(`El resultado debe ser uno de: ${RESULTADOS.join(', ')}.`);
      }

      let encontrado = false;

      const guardado = await repositorio.actualizar((estado) => {
        const peleador = estado.peleadores.find((candidato) => candidato.id === numero);

        if (!peleador) {
          return estado;
        }

        encontrado = true;

        if (resultado === 'ko') {
          peleador.victorias += 1;
          peleador.ko += 1;
        } else if (resultado === 'victoria') {
          peleador.victorias += 1;
        } else if (resultado === 'derrota') {
          peleador.derrotas += 1;
        } else {
          peleador.empates += 1;
        }

        estado.actualizadoEn = new Date().toISOString();

        return estado;
      });

      if (!encontrado) {
        throw new NoEncontradoError(numero);
      }

      return calcularEstadisticas(
        guardado.peleadores.find((peleador) => peleador.id === numero),
      );
    },

    async eliminar(id) {
      const numero = validarId(id);

      let existia = false;

      await repositorio.actualizar((estado) => {
        const antes = estado.peleadores.length;

        estado.peleadores = estado.peleadores.filter((peleador) => peleador.id !== numero);
        existia = estado.peleadores.length < antes;

        if (existia) {
          estado.actualizadoEn = new Date().toISOString();
        }

        return estado;
      });

      if (!existia) {
        throw new NoEncontradoError(numero);
      }

      return { eliminado: numero };
    },
  };
}
