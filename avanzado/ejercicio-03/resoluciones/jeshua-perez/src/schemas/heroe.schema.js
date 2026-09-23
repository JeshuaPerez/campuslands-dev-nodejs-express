import { z } from "zod";

export const heroeSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  rol: z.enum(["tanque", "mago", "asesino", "soporte"], {
    errorMap: () => ({ message: "rol debe ser tanque, mago, asesino o soporte" }),
  }),
  nivel: z.number().int().min(1).max(30).optional().default(1),
});
