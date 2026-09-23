import express from "express";
import { cargarConfig } from "./config/env.js";

export const config = cargarConfig();

export const app = express();

app.get("/config", (req, res) => {
  res.json({ ok: true, data: { entorno: config.entorno, maxJugadores: config.maxJugadores } });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
