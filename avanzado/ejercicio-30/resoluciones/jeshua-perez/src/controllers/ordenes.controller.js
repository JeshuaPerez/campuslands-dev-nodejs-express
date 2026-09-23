import { listarOrdenes, crearOrden, cerrarOrden } from "../services/ordenes.service.js";

export function listar(req, res) {
  res.status(200).json({ ok: true, ...listarOrdenes(req.query) });
}

export function crear(req, res) {
  const orden = crearOrden(req.body);
  res.status(201).json({ ok: true, data: orden });
}

export function cerrar(req, res, next) {
  try {
    const orden = cerrarOrden(Number(req.params.id));
    res.status(200).json({ ok: true, data: orden });
  } catch (error) {
    next(error);
  }
}
