export function cargarConfig(env = process.env) {
  return {
    puerto: Number(env.PORT) || 3050,
    entorno: env.NODE_ENV || "development",
  };
}
