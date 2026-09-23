import { logger } from "../lib/logger.js";

export function logRequests(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    logger.info("peticion_http", {
      metodo: req.method,
      ruta: req.originalUrl,
      status: res.statusCode,
      duracionMs: Date.now() - inicio,
    });
  });

  next();
}
