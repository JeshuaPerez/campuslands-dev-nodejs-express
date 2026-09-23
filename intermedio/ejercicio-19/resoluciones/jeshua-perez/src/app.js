import express from "express";
import { config } from "./config/index.js";

export const app = express();

app.get("/config", (req, res) => {
  res.json({ ok: true, data: { entorno: config.entorno, nombreEstudio: config.nombreEstudio } });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
