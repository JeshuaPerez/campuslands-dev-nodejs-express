import express from "express";
import { cancionesRouter } from "./routes/canciones.routes.js";

export const app = express();

app.use("/canciones", cancionesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
