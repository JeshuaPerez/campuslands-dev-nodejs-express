import { Router } from "express";

const formulas = [{ id: 1, nombre: "Agua", simbolo: "H2O" }];

export const formulasRouter = Router();

formulasRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: formulas });
});

formulasRouter.post("/", (req, res) => {
  const { nombre, simbolo } = req.body;

  if (!nombre || !simbolo) {
    res.status(400).json({ ok: false, message: "nombre y simbolo son obligatorios" });
    return;
  }

  const formula = { id: formulas.length + 1, nombre, simbolo };
  formulas.push(formula);
  res.status(201).json({ ok: true, data: formula });
});
