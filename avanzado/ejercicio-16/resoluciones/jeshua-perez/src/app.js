import express from "express";
import { sanitizarBody } from "./middlewares/sanitizar.middleware.js";

const sneakers = [];
let siguienteId = 1;

export const app = express();

app.use(express.json());
app.use(sanitizarBody);

app.post("/sneakers", (req, res) => {
  const { modelo } = req.body;

  if (!modelo) {
    res.status(400).json({ ok: false, message: "El modelo es obligatorio" });
    return;
  }

  const sneaker = { id: siguienteId++, modelo };
  sneakers.push(sneaker);
  res.status(201).json({ ok: true, data: sneaker });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
