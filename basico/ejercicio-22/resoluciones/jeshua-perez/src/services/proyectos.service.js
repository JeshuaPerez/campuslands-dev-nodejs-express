const COSTO_POR_M2 = 850;

/**
 * Estima el costo de un proyecto de arquitectura 3D.
 * @param {{nombre?: string, metrosCuadrados?: number}} datos
 */
export function estimarCosto({ nombre, metrosCuadrados } = {}) {
  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre del proyecto es obligatorio");
  }

  if (typeof metrosCuadrados !== "number" || metrosCuadrados <= 0) {
    throw new Error("Los metros cuadrados deben ser un numero mayor a 0");
  }

  return {
    nombre,
    metrosCuadrados,
    costoEstimado: metrosCuadrados * COSTO_POR_M2,
  };
}
