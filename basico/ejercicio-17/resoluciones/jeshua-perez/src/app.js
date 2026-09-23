import express from "express";
import { destinosRouter } from "./routes/destinos.routes.js";

export const app = express();

app.use("/destinos", destinosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
