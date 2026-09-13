/**
 * Rarezas del loot. Muestra la convivencia de export default y named exports.
 *
 * Un modulo ESM puede tener como maximo un `export default`, y ademas cuantos
 * named exports quiera. El default se importa sin llaves y se puede renombrar
 * libremente; los named se importan con llaves y por su nombre exacto.
 */

/** Multiplicador de valor por rareza. */
const RAREZAS = Object.freeze({
  comun: 1,
  raro: 2.5,
  epico: 5,
  legendario: 10,
});

export const NOMBRES_RAREZA = Object.freeze(Object.keys(RAREZAS));

export function esRarezaValida(rareza) {
  return typeof rareza === 'string' && rareza.toLowerCase() in RAREZAS;
}

export function multiplicadorDe(rareza) {
  if (!esRarezaValida(rareza)) {
    return 0;
  }

  return RAREZAS[rareza.toLowerCase()];
}

// El default: lo que el modulo considera su export principal.
export default RAREZAS;
