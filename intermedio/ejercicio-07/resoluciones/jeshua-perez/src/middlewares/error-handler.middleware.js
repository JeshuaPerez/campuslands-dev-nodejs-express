import { HttpError } from "../errors/http-error.js";

/**
 * Middleware de errores centralizado: cualquier next(error) llega aqui.
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ ok: false, message: err.message });
    return;
  }

  if (err.type === "entity.parse.failed") {
    res.status(400).json({ ok: false, message: "JSON invalido en el cuerpo de la peticion" });
    return;
  }

  console.error(err);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
}
