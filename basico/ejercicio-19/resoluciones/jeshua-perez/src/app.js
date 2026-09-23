import express from "express";
import { disenosRouter } from "./routes/disenos.routes.js";

export const app = express();

app.use("/estudios", disenosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
