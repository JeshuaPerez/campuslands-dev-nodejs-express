/**
 * La zona que se cierra en una partida de battle royale.
 *
 * Este modulo existe para demostrar los **live bindings** de ES Modules, que es
 * la diferencia grande frente a CommonJS: lo que exporta un modulo ESM no es
 * una copia del valor, es una vista viva de la variable. Quien importa
 * `radioActual` ve el valor nuevo despues de cada `encogerZona`, sin volver a
 * importar nada.
 *
 * En CommonJS, `const { radioActual } = require('./zona')` habria congelado el
 * numero en el momento del require.
 */

const RADIO_INICIAL = 1000;

// `export let` es justamente lo que crea el binding vivo.
export let radioActual = RADIO_INICIAL;
export let fase = 0;

/**
 * Cierra la zona un numero de metros.
 *
 * @param {number} metros cuanto se encoge el radio.
 * @returns {{fase: number, radioActual: number}} estado tras el cierre.
 */
export function encogerZona(metros) {
  if (!Number.isFinite(metros) || metros <= 0) {
    throw new TypeError('Los metros a encoger deben ser un numero positivo.');
  }

  radioActual = Math.max(0, radioActual - metros);
  fase += 1;

  return { fase, radioActual };
}

/** Devuelve la zona a su estado inicial. Lo usan las pruebas. */
export function reiniciarZona() {
  radioActual = RADIO_INICIAL;
  fase = 0;
}

/** Un jugador esta a salvo si su distancia al centro cabe en el radio. */
export function estaEnZona(distanciaAlCentro) {
  return Number.isFinite(distanciaAlCentro) && distanciaAlCentro <= radioActual;
}

export { RADIO_INICIAL };
