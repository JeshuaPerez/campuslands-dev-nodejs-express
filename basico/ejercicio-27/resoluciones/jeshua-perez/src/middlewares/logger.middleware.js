/**
 * Middleware de logs simples: imprime metodo, ruta y tiempo de respuesta.
 */
export function logger(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracionMs = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracionMs}ms)`);
  });

  next();
}
