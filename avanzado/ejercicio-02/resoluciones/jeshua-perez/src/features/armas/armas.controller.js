import { listarArmas, crearArma } from "./armas.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarArmas() });
}

export function crear(req, res) {
  try {
    const arma = crearArma(req.body);
    res.status(201).json({ ok: true, data: arma });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}
