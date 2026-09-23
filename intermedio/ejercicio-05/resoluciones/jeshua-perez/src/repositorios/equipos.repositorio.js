/**
 * Repositorio en memoria: solo guarda y consulta datos, sin reglas de negocio.
 */
const equipos = [];
let siguienteId = 1;

export function guardar(equipo) {
  const nuevo = { id: siguienteId++, ...equipo };
  equipos.push(nuevo);
  return nuevo;
}

export function buscarPorId(id) {
  return equipos.find((e) => e.id === id) ?? null;
}

export function buscarTodos() {
  return equipos;
}
