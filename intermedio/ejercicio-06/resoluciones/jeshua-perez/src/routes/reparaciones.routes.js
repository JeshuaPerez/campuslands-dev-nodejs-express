import { Router } from "express";
import { validar } from "../middlewares/validar.middleware.js";

const reparaciones = [];
let siguienteId = 1;

const esquemaReparacion = {
  moto: { requerido: true, tipo: "string" },
  costo: { requerido: true, tipo: "number" },
};

export const reparacionesRouter = Router();

reparacionesRouter.get("/", (req, res) => {
  res.json({ ok: true, data: reparaciones });
});

reparacionesRouter.post("/", validar(esquemaReparacion), (req, res) => {
  const reparacion = { id: siguienteId++, ...req.body };
  reparaciones.push(reparacion);
  res.status(201).json({ ok: true, data: reparacion });
});
