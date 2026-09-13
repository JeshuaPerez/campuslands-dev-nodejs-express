/**
 * Servicio de dominio: loadouts de shooter competitivo.
 *
 * Reglas puras, sin HTTP ni consola, para poder probarlas aisladas.
 */

/** Error de validacion de entrada. Lleva el status HTTP que le corresponde. */
class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

/** Armas permitidas y su perfil. `precio` en creditos de ronda. */
const ARMAS = Object.freeze({
  'AK-47': { tipo: 'rifle', dano: 36, cadencia: 600, precio: 2700 },
  'M4A1-S': { tipo: 'rifle', dano: 33, cadencia: 600, precio: 2900 },
  AWP: { tipo: 'francotirador', dano: 115, cadencia: 41, precio: 4750 },
  MP9: { tipo: 'subfusil', dano: 26, cadencia: 857, precio: 1250 },
  Desert: { tipo: 'pistola', dano: 53, cadencia: 267, precio: 700 },
});

const ESTILOS = Object.freeze(['agresivo', 'tactico', 'apoyo']);

/** Cuanto altera cada estilo las estadisticas base. */
const AJUSTES_ESTILO = Object.freeze({
  agresivo: { dano: 1.1, movilidad: 1.15, utilidad: 0.8 },
  tactico: { dano: 1.0, movilidad: 1.0, utilidad: 1.2 },
  apoyo: { dano: 0.9, movilidad: 0.95, utilidad: 1.4 },
});

const PRESUPUESTO_MAXIMO = 8000;

function validarArma(armaPrincipal) {
  if (typeof armaPrincipal !== 'string' || armaPrincipal.trim() === '') {
    throw new ValidacionError('El arma principal es obligatoria.');
  }

  const nombre = armaPrincipal.trim();
  const claveReal = Object.keys(ARMAS).find(
    (arma) => arma.toLowerCase() === nombre.toLowerCase(),
  );

  if (!claveReal) {
    throw new ValidacionError(
      `Arma no disponible. Usa una de: ${Object.keys(ARMAS).join(', ')}.`,
    );
  }

  return claveReal;
}

function validarEstilo(estilo) {
  if (estilo === undefined || estilo === null) {
    return ESTILOS[1];
  }

  if (typeof estilo !== 'string') {
    throw new ValidacionError(`El estilo debe ser uno de: ${ESTILOS.join(', ')}.`);
  }

  const normalizado = estilo.trim().toLowerCase();

  if (!ESTILOS.includes(normalizado)) {
    throw new ValidacionError(`El estilo debe ser uno de: ${ESTILOS.join(', ')}.`);
  }

  return normalizado;
}

function validarGranadas(granadas) {
  if (granadas === undefined || granadas === null) {
    return 2;
  }

  if (!Number.isInteger(granadas)) {
    throw new ValidacionError('Las granadas deben ser un numero entero.');
  }

  if (granadas < 0 || granadas > 4) {
    throw new ValidacionError('Solo puedes llevar entre 0 y 4 granadas.');
  }

  return granadas;
}

/**
 * Arma un loadout completo y calcula su coste y sus estadisticas finales.
 *
 * @param {{armaPrincipal: string, estilo?: string, granadas?: number}} datos
 * @throws {ValidacionError} si la entrada no cumple las reglas o se pasa del presupuesto.
 */
function crearLoadout(datos = {}) {
  const armaPrincipal = validarArma(datos.armaPrincipal);
  const estilo = validarEstilo(datos.estilo);
  const granadas = validarGranadas(datos.granadas);

  const arma = ARMAS[armaPrincipal];
  const ajuste = AJUSTES_ESTILO[estilo];
  const costeGranadas = granadas * 300;
  const costeTotal = arma.precio + costeGranadas;

  if (costeTotal > PRESUPUESTO_MAXIMO) {
    throw new ValidacionError(
      `El loadout cuesta ${costeTotal} creditos y el maximo es ${PRESUPUESTO_MAXIMO}.`,
    );
  }

  return {
    armaPrincipal,
    tipo: arma.tipo,
    estilo,
    granadas,
    danoEfectivo: Math.round(arma.dano * ajuste.dano),
    movilidad: Math.round(100 * ajuste.movilidad),
    utilidad: Math.round(granadas * 25 * ajuste.utilidad),
    costeTotal,
    creditosRestantes: PRESUPUESTO_MAXIMO - costeTotal,
  };
}

export {
  ARMAS,
  ESTILOS,
  PRESUPUESTO_MAXIMO,
  ValidacionError,
  crearLoadout,
};
