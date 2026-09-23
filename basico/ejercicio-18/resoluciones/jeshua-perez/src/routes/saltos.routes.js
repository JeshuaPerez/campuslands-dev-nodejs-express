import { Router } from "express";

const saltos = [];
let siguienteId = 1;

export const saltosRouter = Router();

saltosRouter.get("/", (req, res) => {
  res.json({ ok: true, data: saltos });
});

saltosRouter.post("/", (req, res) => {
  const { paracaidista, altitudMetros } = req.body;

  if (!paracaidista || !paracaidista.trim()) {
    res.status(400).json({ ok: false, message: "El paracaidista es obligatorio" });
    return;
  }

  if (typeof altitudMetros !== "number" || altitudMetros <= 0) {
    res.status(400).json({ ok: false, message: "La altitud debe ser un numero mayor a 0" });
    return;
  }

  const salto = { id: siguienteId++, paracaidista, altitudMetros };
  saltos.push(salto);

  res.status(201).json({ ok: true, data: salto });
});
