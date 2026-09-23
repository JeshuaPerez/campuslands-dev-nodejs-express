import express from "express";
import * as formulasRepositorio from "./repositorios/formulas.repositorio.js";
import { crearFormula } from "./services/formulas.service.js";

export const app = express();

app.use(express.json());

app.post("/formulas", (req, res) => {
  try {
    const formula = crearFormula(formulasRepositorio, req.body);
    res.status(201).json({ ok: true, data: formula });
  } catch (error) {
    if (error.message === "SIMBOLO_YA_EXISTE") {
      res.status(409).json({ ok: false, message: "Ese simbolo ya existe" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
