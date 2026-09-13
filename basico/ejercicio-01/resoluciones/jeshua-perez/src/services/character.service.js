/**
 * Servicio de personajes RPG.
 *
 * Contiene la logica de dominio del ejercicio: validar la entrada y calcular
 * las estadisticas de un personaje. No sabe nada de HTTP ni de consola, por eso
 * se puede probar de forma aislada.
 */

/** Error de validacion de entrada. Lleva el status HTTP que le corresponde. */
class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

const CLASES = Object.freeze(['guerrero', 'mago', 'arquero', 'clerigo']);

const NIVEL_MINIMO = 1;
const NIVEL_MAXIMO = 99;
const NOMBRE_MINIMO = 3;
const NOMBRE_MAXIMO = 20;

/** Cuanto suma cada punto de nivel segun la clase elegida. */
const MODIFICADORES = Object.freeze({
  guerrero: { hp: 14, mp: 2, ataque: 7, defensa: 6 },
  mago: { hp: 7, mp: 15, ataque: 9, defensa: 3 },
  arquero: { hp: 10, mp: 6, ataque: 8, defensa: 4 },
  clerigo: { hp: 9, mp: 12, ataque: 5, defensa: 5 },
});

function validarNombre(nombre) {
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    throw new ValidacionError('El nombre del personaje es obligatorio.');
  }

  const limpio = nombre.trim();

  if (limpio.length < NOMBRE_MINIMO || limpio.length > NOMBRE_MAXIMO) {
    throw new ValidacionError(
      `El nombre debe tener entre ${NOMBRE_MINIMO} y ${NOMBRE_MAXIMO} caracteres.`,
    );
  }

  return limpio;
}

function validarClase(clase) {
  if (clase === undefined || clase === null) {
    return CLASES[0];
  }

  if (typeof clase !== 'string') {
    throw new ValidacionError(`La clase debe ser una de: ${CLASES.join(', ')}.`);
  }

  const normalizada = clase.trim().toLowerCase();

  if (!CLASES.includes(normalizada)) {
    throw new ValidacionError(`La clase debe ser una de: ${CLASES.join(', ')}.`);
  }

  return normalizada;
}

function validarNivel(nivel) {
  if (nivel === undefined || nivel === null) {
    return NIVEL_MINIMO;
  }

  if (!Number.isInteger(nivel)) {
    throw new ValidacionError('El nivel debe ser un numero entero.');
  }

  if (nivel < NIVEL_MINIMO || nivel > NIVEL_MAXIMO) {
    throw new ValidacionError(
      `El nivel debe estar entre ${NIVEL_MINIMO} y ${NIVEL_MAXIMO}.`,
    );
  }

  return nivel;
}

/**
 * Crea un personaje con estadisticas derivadas de su clase y nivel.
 *
 * El calculo es deterministico a proposito: asi las pruebas pueden afirmar
 * valores exactos en lugar de solo comprobar que existan.
 *
 * @param {{nombre: string, clase?: string, nivel?: number}} datos
 * @throws {ValidacionError} si algun campo no cumple las reglas.
 * @returns {{nombre: string, clase: string, nivel: number, hp: number,
 *            mp: number, ataque: number, defensa: number, poder: number}}
 */
function crearPersonaje(datos = {}) {
  const nombre = validarNombre(datos.nombre);
  const clase = validarClase(datos.clase);
  const nivel = validarNivel(datos.nivel);

  const modificador = MODIFICADORES[clase];
  const hp = 20 + modificador.hp * nivel;
  const mp = 10 + modificador.mp * nivel;
  const ataque = modificador.ataque * nivel;
  const defensa = modificador.defensa * nivel;

  return {
    nombre,
    clase,
    nivel,
    hp,
    mp,
    ataque,
    defensa,
    poder: ataque + defensa + Math.floor(hp / 10) + Math.floor(mp / 10),
  };
}

export {
  CLASES,
  NIVEL_MAXIMO,
  NIVEL_MINIMO,
  ValidacionError,
  crearPersonaje,
};
