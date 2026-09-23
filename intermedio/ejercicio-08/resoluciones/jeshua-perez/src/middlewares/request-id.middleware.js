import { randomUUID } from "node:crypto";

/**
 * Asigna un id unico a cada peticion, lo expone en req.id y en el header
 * X-Request-Id de la respuesta.
 */
export function requestId(req, res, next) {
  req.id = randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
}
