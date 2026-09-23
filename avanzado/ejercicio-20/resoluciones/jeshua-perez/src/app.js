import express from "express";
import { idempotencia } from "./middlewares/idempotencia.middleware.js";

const ilustraciones = [];
let siguienteId = 1;

export const app = express();

app.use(express.json());
app.use(idempotencia);

app.post("/ilustraciones", (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    res.status(400).json({ ok: false, message: "El titulo es obligatorio" });
    return;
  }

  const ilustracion = { id: siguienteId++, titulo };
  ilustraciones.push(ilustracion);
  res.status(201).json({ ok: true, data: ilustracion });
});

app.get("/ilustraciones", (req, res) => {
  res.status(200).json({ ok: true, data: ilustraciones });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
