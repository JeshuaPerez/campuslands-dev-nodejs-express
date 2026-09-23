import { estimarCosto } from "../services/proyectos.service.js";

export function crearEstimacion(req, res) {
  try {
    const resultado = estimarCosto(req.body);
    res.status(201).json({ ok: true, data: resultado });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}
