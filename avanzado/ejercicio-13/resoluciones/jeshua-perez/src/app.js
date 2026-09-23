import express from "express";
import { logRequests } from "./middlewares/logger.middleware.js";
import { logger } from "./lib/logger.js";

export const app = express();

app.use(logRequests);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, uptimeSegundos: process.uptime() });
});

app.get("/naves/:id", (req, res) => {
  const id = Number(req.params.id);

  if (id !== 1) {
    logger.warn("nave_no_encontrada", { id });
    res.status(404).json({ ok: false, message: "Nave no encontrada" });
    return;
  }

  res.status(200).json({ ok: true, data: { id, nombre: "Nostromo" } });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
