import { registrarAuditoria } from "../services/auditoria.service.js";

/**
 * Registra la accion despues de que la respuesta se envio, solo si fue
 * exitosa (2xx). El usuario viene de req.usuario (lo pone requireAuth).
 */
export function auditar(accion) {
  return (req, res, next) => {
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        registrarAuditoria({
          usuario: req.usuario?.nombre ?? "anonimo",
          accion,
          recurso: req.originalUrl,
        });
      }
    });
    next();
  };
}
