export function cargarConfig(env = process.env) {
  return { puerto: Number(env.PORT) || 3080, entorno: env.NODE_ENV || "development" };
}
