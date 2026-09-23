import express from "express";
import { partidosRouter } from "./routes/partidos.routes.js";

export const app = express();

app.use(express.json());
app.use("/partidos", partidosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
