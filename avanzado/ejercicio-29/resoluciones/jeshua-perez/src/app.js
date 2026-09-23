import express from "express";
import { estaListo } from "./services/estado.service.js";

const partidos = [{ id: 1, local: "River", visitante: "Boca" }];

export const app = express();

/** Liveness: el proceso esta vivo y puede responder. */
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, status: "alive" });
});

/** Readiness: el proceso esta vivo Y listo para recibir trafico real. */
app.get("/ready", (req, res) => {
  if (!estaListo()) {
    res.status(503).json({ ok: false, status: "not_ready" });
    return;
  }
  res.status(200).json({ ok: true, status: "ready" });
});

app.get("/partidos", (req, res) => {
  res.status(200).json({ ok: true, data: partidos });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
