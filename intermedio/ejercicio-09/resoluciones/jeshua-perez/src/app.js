import express from "express";
import { peleadoresRouter } from "./routes/peleadores.routes.js";

export const app = express();

app.use("/peleadores", peleadoresRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
