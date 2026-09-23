import express from "express";
import { listarOrdenes, marcarVencidas } from "./jobs/revisar-ordenes-vencidas.job.js";

export const app = express();

app.get("/ordenes", (req, res) => {
  res.status(200).json({ ok: true, data: listarOrdenes() });
});

app.post("/ordenes/revisar-vencidas", (req, res) => {
  const vencidas = marcarVencidas();
  res.status(200).json({ ok: true, data: vencidas });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
