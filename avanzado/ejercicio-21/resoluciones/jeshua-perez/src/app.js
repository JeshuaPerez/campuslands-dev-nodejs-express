import express from "express";
import { Semaforo } from "./lib/semaforo.js";

const semaforoRenders = new Semaforo(2);

export const app = express();

app.post("/renders", async (req, res) => {
  const resultado = await semaforoRenders.ejecutar(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { renderizado: true };
  });

  res.status(200).json({ ok: true, data: resultado });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
