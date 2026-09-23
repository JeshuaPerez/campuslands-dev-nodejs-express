const jugadores = [
  { id: 1, nombre: "Ma Long", puntaje: 3050 },
  { id: 2, nombre: "Fan Zhendong", puntaje: 3180 },
  { id: 3, nombre: "Ovtcharov", puntaje: 2870 },
];

const CAMPOS_PERMITIDOS = ["nombre", "puntaje"];

export function listarJugadores({ sort, order = "asc" } = {}) {
  if (sort && !CAMPOS_PERMITIDOS.includes(sort)) {
    throw new Error(`sort debe ser uno de: ${CAMPOS_PERMITIDOS.join(", ")}`);
  }

  if (!sort) {
    return jugadores;
  }

  const factor = order === "desc" ? -1 : 1;

  return [...jugadores].sort((a, b) => (a[sort] > b[sort] ? factor : a[sort] < b[sort] ? -factor : 0));
}
