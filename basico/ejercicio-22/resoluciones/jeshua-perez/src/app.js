import express from "express";
import { proyectosRouter } from "./routes/proyectos.routes.js";

export const app = express();

app.use(express.json());
app.use("/proyectos", proyectosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
