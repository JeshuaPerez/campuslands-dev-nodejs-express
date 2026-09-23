import express from "express";
import { heroesRouter } from "./routes/heroes.routes.js";

export const app = express();

app.use(express.json());
app.use("/heroes", heroesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
});
