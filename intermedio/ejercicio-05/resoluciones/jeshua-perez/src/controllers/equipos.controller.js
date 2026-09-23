import { listarEquipos, crearEquipo, obtenerEquipo } from "../services/equipos.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarEquipos() });
}

export function crear(req, res) {
  try {
    const equipo = crearEquipo(req.body);
    res.status(201).json({ ok: true, data: equipo });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

export function obtener(req, res) {
  try {
    const equipo = obtenerEquipo(Number(req.params.id));
    res.status(200).json({ ok: true, data: equipo });
  } catch (error) {
    res.status(404).json({ ok: false, message: "Equipo no encontrado" });
  }
}
