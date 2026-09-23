import express from "express";
import { requestId } from "./middlewares/request-id.middleware.js";

const hiperdeportivos = [
  { id: 1, marca: "Bugatti", modelo: "Chiron" },
];

export const app = express();

app.use(requestId);

app.get("/hiperdeportivos", (req, res) => {
  console.log(`[${req.id}] GET /hiperdeportivos`);
  res.json({ ok: true, requestId: req.id, data: hiperdeportivos });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, requestId: req.id, message: "Ruta no encontrada" });
});
