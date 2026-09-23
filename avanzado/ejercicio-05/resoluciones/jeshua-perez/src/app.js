import express from "express";
import { ficharJugador } from "./services/fichajes.service.js";

export const app = express();

app.use(express.json());

app.post("/fichajes", (req, res) => {
  const { origen, destino, monto } = req.body;

  try {
    const resultado = ficharJugador(origen, destino, monto);
    res.status(200).json({ ok: true, data: resultado });
  } catch (error) {
    if (error.message === "PRESUPUESTO_INSUFICIENTE") {
      res.status(409).json({ ok: false, message: "El equipo destino no tiene presupuesto suficiente" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
