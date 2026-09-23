import express from "express";
import { modelosRouter } from "./routes/modelos.routes.js";

export const app = express();

app.use(express.json());
app.use("/modelos", modelosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
