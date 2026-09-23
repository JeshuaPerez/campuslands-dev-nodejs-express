import express from "express";
import { obtenerAuto } from "./services/autos.service.js";

export const app = express();

app.get("/autos/:id", (req, res) => {
  const auto = obtenerAuto(Number(req.params.id));

  if (!auto) {
    res.status(404).json({ ok: false, message: "Auto no encontrado" });
    return;
  }

  res.status(200).json({ ok: true, data: auto });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
