import express from "express";
import "./events/listeners.js";
import { venderAuto } from "./services/autos.service.js";

export const app = express();

app.patch("/autos/:id/vender", (req, res) => {
  try {
    const auto = venderAuto(Number(req.params.id));
    res.status(200).json({ ok: true, data: auto });
  } catch (error) {
    if (error.message === "AUTO_NO_ENCONTRADO") {
      res.status(404).json({ ok: false, message: "Auto no encontrado" });
      return;
    }
    res.status(409).json({ ok: false, message: "El auto ya estaba vendido" });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
