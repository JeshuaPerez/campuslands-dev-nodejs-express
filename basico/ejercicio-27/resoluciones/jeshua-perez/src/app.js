import express from "express";
import { logger } from "./middlewares/logger.middleware.js";

const partidas = [
  { id: 1, equipoA: "Dragones", equipoB: "Lobos" },
];

export const app = express();

app.use(logger);

app.get("/partidas", (req, res) => {
  res.json({ ok: true, data: partidas });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
