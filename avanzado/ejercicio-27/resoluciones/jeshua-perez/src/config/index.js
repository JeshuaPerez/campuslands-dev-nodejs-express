import { z } from "zod";
import { configBase } from "./base.js";
import { configPorEntorno } from "./por-entorno.js";

const configSchema = z.object({
  puerto: z.number().int().positive(),
  logNivel: z.enum(["debug", "info", "warn", "error", "silent"]),
  maxPartidasSimultaneas: z.number().int().positive(),
});

/**
 * Mezcla la config base con el override del entorno actual (development,
 * test o production) y valida el resultado final con zod.
 */
export function cargarConfig(env = process.env) {
  const entorno = env.NODE_ENV || "development";
  const override = configPorEntorno[entorno] ?? {};

  const puerto = env.PORT ? Number(env.PORT) : configBase.puerto;

  const combinada = { ...configBase, ...override, puerto };

  const resultado = configSchema.safeParse(combinada);

  if (!resultado.success) {
    throw new Error(`Configuracion invalida: ${resultado.error.issues.map((i) => i.message).join(", ")}`);
  }

  return { entorno, ...resultado.data };
}
