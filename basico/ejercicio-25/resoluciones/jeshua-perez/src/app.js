import express from "express";
import { personajesRouter } from "./routes/personajes.routes.js";

export const app = express();

app.use(express.json());
app.use("/personajes", personajesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
