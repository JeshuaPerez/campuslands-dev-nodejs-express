import { Router } from "express";
import { requireAuth, requireAlgunRol } from "../middlewares/auth.middleware.js";

const saltos = [];
let siguienteId = 1;

export const saltosRouter = Router();

saltosRouter.get("/", requireAuth, requireAlgunRol("alumno", "instructor", "jefe_salto"), (req, res) => {
  res.status(200).json({ ok: true, data: saltos });
});

saltosRouter.post("/", requireAuth, requireAlgunRol("instructor", "jefe_salto"), (req, res) => {
  const { alumno } = req.body;

  if (!alumno) {
    res.status(400).json({ ok: false, message: "El alumno es obligatorio" });
    return;
  }

  const salto = { id: siguienteId++, alumno };
  saltos.push(salto);
  res.status(201).json({ ok: true, data: salto });
});

saltosRouter.delete("/:id", requireAuth, requireAlgunRol("jefe_salto"), (req, res) => {
  const indice = saltos.findIndex((s) => s.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Salto no encontrado" });
    return;
  }

  saltos.splice(indice, 1);
  res.status(204).end();
});
