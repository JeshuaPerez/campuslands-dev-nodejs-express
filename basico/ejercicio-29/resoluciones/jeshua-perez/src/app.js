import express from "express";
import { goleadoresRouter } from "./routes/goleadores.routes.js";

export const app = express();

app.use(express.json());
app.use("/goleadores", goleadoresRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
