import express from "express";
import { peliculasRouter } from "./routes/peliculas.routes.js";

export const app = express();

app.use("/peliculas", peliculasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
