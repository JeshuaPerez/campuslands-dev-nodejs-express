import express from "express";
import { navesRouter } from "./routes/naves.routes.js";

export const app = express();

app.use("/naves", navesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
