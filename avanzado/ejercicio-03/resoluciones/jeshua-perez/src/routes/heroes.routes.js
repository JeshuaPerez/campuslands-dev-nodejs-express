import { Router } from "express";
import { heroeSchema } from "../schemas/heroe.schema.js";
import { validarSchema } from "../middlewares/validar-schema.middleware.js";

const heroes = [];
let siguienteId = 1;

export const heroesRouter = Router();

heroesRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: heroes });
});

heroesRouter.post("/", validarSchema(heroeSchema), (req, res) => {
  const heroe = { id: siguienteId++, ...req.body };
  heroes.push(heroe);
  res.status(201).json({ ok: true, data: heroe });
});
