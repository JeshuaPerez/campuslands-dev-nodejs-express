import express from "express";
import { router } from "./routes/index.js";

export const app = express();

app.use(router);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
