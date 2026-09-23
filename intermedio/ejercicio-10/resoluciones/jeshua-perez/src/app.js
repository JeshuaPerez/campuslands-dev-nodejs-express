import express from "express";
import { jugadoresRouter } from "./routes/jugadores.routes.js";

export const app = express();

app.use("/jugadores", jugadoresRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
