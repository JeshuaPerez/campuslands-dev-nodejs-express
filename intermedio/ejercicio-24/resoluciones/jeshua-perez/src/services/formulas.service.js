/**
 * El repositorio se recibe por parametro (inyeccion simple) para poder
 * reemplazarlo por un mock en los tests sin tocar el modulo real.
 */
export function crearFormula(repositorio, { nombre, simbolo }) {
  if (!nombre || !simbolo) {
    throw new Error("nombre y simbolo son obligatorios");
  }

  if (repositorio.buscarPorSimbolo(simbolo)) {
    throw new Error("SIMBOLO_YA_EXISTE");
  }

  return repositorio.guardar({ nombre, simbolo });
}
