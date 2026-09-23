import { guardar, buscarPorId, buscarTodos } from "../repositorios/equipos.repositorio.js";

export function listarEquipos() {
  return buscarTodos();
}

export function crearEquipo({ nombre, liga }) {
  if (!nombre || !liga) {
    throw new Error("nombre y liga son obligatorios");
  }

  return guardar({ nombre, liga });
}

export function obtenerEquipo(id) {
  const equipo = buscarPorId(id);
  if (!equipo) {
    throw new Error("EQUIPO_NO_ENCONTRADO");
  }
  return equipo;
}
