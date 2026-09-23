import { sanitizarObjeto } from "../lib/sanitizar.js";

export function sanitizarBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizarObjeto(req.body);
  }
  next();
}
