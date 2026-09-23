import { z } from "zod";

export const crearOrdenSchema = z.object({
  moto: z.string().min(1, "La moto es obligatoria"),
  falla: z.string().min(1, "La falla es obligatoria"),
});
