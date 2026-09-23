import { listarJugadores, crearJugador } from "./jugadores.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarJugadores() });
}

export function crear(req, res) {
  try {
    const jugador = crearJugador(req.body);
    res.status(201).json({ ok: true, data: jugador });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}
