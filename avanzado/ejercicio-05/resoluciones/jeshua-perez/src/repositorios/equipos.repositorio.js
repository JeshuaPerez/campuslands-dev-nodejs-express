export const equipos = new Map([
  ["River", { nombre: "River", presupuesto: 1000 }],
  ["Boca", { nombre: "Boca", presupuesto: 500 }],
]);

export function obtenerEquipo(nombre) {
  const equipo = equipos.get(nombre);
  if (!equipo) {
    throw new Error("EQUIPO_NO_ENCONTRADO");
  }
  return equipo;
}

/**
 * Clona el estado actual de los equipos, para poder restaurarlo si una
 * transaccion falla a mitad de camino.
 */
export function tomarSnapshot() {
  return new Map([...equipos].map(([nombre, datos]) => [nombre, { ...datos }]));
}

export function restaurarSnapshot(snapshot) {
  equipos.clear();
  for (const [nombre, datos] of snapshot) {
    equipos.set(nombre, datos);
  }
}
