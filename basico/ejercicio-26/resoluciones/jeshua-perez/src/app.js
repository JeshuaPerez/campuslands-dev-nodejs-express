import express from "express";
import { partidasRouter } from "./routes/partidas.routes.js";

export const app = express();

app.use(express.json());
app.use("/partidas", partidasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
