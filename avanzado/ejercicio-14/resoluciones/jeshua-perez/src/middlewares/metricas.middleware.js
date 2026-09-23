import { metricas } from "../lib/metricas.js";

export function registrarMetricas(req, res, next) {
  res.on("finish", () => {
    metricas.registrar(req.method, req.route?.path ?? req.path, res.statusCode);
  });
  next();
}
