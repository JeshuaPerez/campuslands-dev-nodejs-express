import { listarMisiones, crearMision, completarMision } from "../services/misiones.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarMisiones(req.query) });
}

export function crear(req, res) {
  try {
    const mision = crearMision(req.body);
    res.status(201).json({ ok: true, data: mision });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

export function completar(req, res) {
  try {
    const mision = completarMision(Number(req.params.id));
    res.status(200).json({ ok: true, data: mision });
  } catch (error) {
    if (error.message === "MISION_NO_ENCONTRADA") {
      res.status(404).json({ ok: false, message: "Mision no encontrada" });
      return;
    }
    res.status(409).json({ ok: false, message: "La mision ya estaba completada" });
  }
}
