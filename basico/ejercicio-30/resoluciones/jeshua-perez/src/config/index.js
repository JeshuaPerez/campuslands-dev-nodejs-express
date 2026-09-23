export function cargarConfig(env = process.env) {
  return {
    puerto: Number(env.PORT) || 3020,
    entorno: env.NODE_ENV || "development",
  };
}
