import express from "express";
import { calcularEquipos } from "./services/jugadores.service.js";

export const app = express();

app.use(express.json());

app.post("/partidas/equipos", (req, res) => {
  const { jugadores } = req.body;

  if (!Array.isArray(jugadores) || jugadores.length === 0) {
    res.status(400).json({ ok: false, message: "jugadores debe ser un arreglo no vacio" });
    return;
  }

  res.status(200).json({ ok: true, data: calcularEquipos(jugadores) });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
