import "dotenv/config";

export function cargarConfig(env = process.env) {
  const puerto = env.PORT === undefined ? 3039 : Number(env.PORT);

  if (Number.isNaN(puerto) || puerto <= 0) {
    throw new Error("PORT debe ser un numero valido");
  }

  return {
    puerto,
    entorno: env.NODE_ENV || "development",
    nombreEstudio: env.NOMBRE_ESTUDIO || "Estudio sin nombre",
  };
}

export const config = cargarConfig();
