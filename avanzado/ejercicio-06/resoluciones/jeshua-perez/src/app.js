import express from "express";
import { ColaTareas } from "./lib/cola-tareas.js";

const colaReparaciones = new ColaTareas();

export const app = express();

app.use(express.json());

app.post("/reparaciones", (req, res) => {
  const { moto } = req.body;

  if (!moto) {
    res.status(400).json({ ok: false, message: "La moto es obligatoria" });
    return;
  }

  colaReparaciones.encolar(() => new Promise((resolve) => {
    setTimeout(() => resolve(`${moto} reparada`), 50);
  }));

  res.status(202).json({ ok: true, message: "Reparacion encolada", pendientes: colaReparaciones.pendientes });
});

app.get("/reparaciones/estado", (req, res) => {
  res.status(200).json({
    ok: true,
    pendientes: colaReparaciones.pendientes,
    completadas: colaReparaciones.completadas,
  });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
