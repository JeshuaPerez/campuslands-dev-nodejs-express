import { DomainError } from "../errors/domain-errors.js";

/**
 * Un unico punto de traduccion: cualquier DomainError sabe su propio
 * statusCode, asi que este handler nunca necesita un switch por tipo.
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({ ok: false, message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
}
