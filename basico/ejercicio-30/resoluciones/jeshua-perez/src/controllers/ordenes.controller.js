import { listarOrdenes, obtenerOrden, crearOrden, cerrarOrden } from "../services/ordenes.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, data: listarOrdenes(req.query) });
}

export function obtener(req, res) {
  try {
    const orden = obtenerOrden(Number(req.params.id));
    res.status(200).json({ ok: true, data: orden });
  } catch (error) {
    res.status(404).json({ ok: false, message: "Orden no encontrada" });
  }
}

export function crear(req, res) {
  try {
    const orden = crearOrden(req.body);
    res.status(201).json({ ok: true, data: orden });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
}

export function cerrar(req, res) {
  try {
    const orden = cerrarOrden(Number(req.params.id));
    res.status(200).json({ ok: true, data: orden });
  } catch (error) {
    if (error.message === "ORDEN_NO_ENCONTRADA") {
      res.status(404).json({ ok: false, message: "Orden no encontrada" });
      return;
    }
    res.status(409).json({ ok: false, message: "La orden ya estaba cerrada" });
  }
}
