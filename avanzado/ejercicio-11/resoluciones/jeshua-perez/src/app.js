import express from "express";
import { importarCanciones, listarCanciones } from "./services/canciones.service.js";

export const app = express();

app.use(express.json());

app.get("/canciones", (req, res) => {
  res.status(200).json({ ok: true, data: listarCanciones() });
});

app.post("/canciones/importar", (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ ok: false, message: "El body debe ser un arreglo de canciones" });
    return;
  }

  const resultado = importarCanciones(req.body);
  res.status(207).json({ ok: true, ...resultado });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
