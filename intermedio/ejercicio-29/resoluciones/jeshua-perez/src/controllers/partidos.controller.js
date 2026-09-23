import { crearPartido, registrarGol, listarPartidos } from "../services/partidos.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarPartidos() });
}

export function crear(req, res) {
  try {
    const partido = crearPartido(req.body);
    res.status(201).json({ ok: true, data: partido });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

export function gol(req, res) {
  try {
    const partido = registrarGol(Number(req.params.id), req.body.equipo);
    res.status(200).json({ ok: true, data: partido });
  } catch (error) {
    if (error.message === "PARTIDO_NO_ENCONTRADO") {
      res.status(404).json({ ok: false, message: "Partido no encontrado" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
}
