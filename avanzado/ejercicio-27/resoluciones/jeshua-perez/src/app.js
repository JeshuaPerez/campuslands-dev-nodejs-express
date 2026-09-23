import express from "express";
import { cargarConfig } from "./config/index.js";

export const app = express();

app.get("/config", (req, res) => {
  const config = cargarConfig();
  res.status(200).json({ ok: true, data: { entorno: config.entorno, logNivel: config.logNivel } });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
