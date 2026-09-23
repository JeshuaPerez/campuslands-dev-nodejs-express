import express from "express";
import { planosRouter } from "./routes/planos.routes.js";

export const app = express();

app.use("/planos", planosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
