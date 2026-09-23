import express from "express";
import { unirseAPartida } from "./services/matchmaking.service.js";

export const app = express();

app.use(express.json());

app.post("/matchmaking", async (req, res) => {
  try {
    const sala = await unirseAPartida(req.body.region);
    res.status(200).json({ ok: true, data: sala });
  } catch (error) {
    if (error.message === "SALA_LLENA") {
      res.status(409).json({ ok: false, message: "La sala esta llena" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
