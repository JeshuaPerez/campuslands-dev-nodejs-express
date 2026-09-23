export class WarpError extends Error {
  constructor(message) {
    super(message);
    this.name = "WarpError";
  }
}

const VELOCIDAD_MAXIMA = 9;

/**
 * Calcula el tiempo de viaje a warp. Lanza WarpError si el factor es invalido.
 * @param {number} distanciaAnios
 * @param {number} factorWarp
 * @returns {number} tiempo estimado en anios
 */
export function calcularViajeWarp(distanciaAnios, factorWarp) {
  if (typeof factorWarp !== "number" || Number.isNaN(factorWarp)) {
    throw new WarpError("El factor warp debe ser un numero");
  }

  if (factorWarp <= 0 || factorWarp > VELOCIDAD_MAXIMA) {
    throw new WarpError(`El factor warp debe estar entre 1 y ${VELOCIDAD_MAXIMA}`);
  }

  return distanciaAnios / factorWarp;
}
