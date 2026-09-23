import express from "express";
import { reparacionesRouter } from "./routes/reparaciones.routes.js";

export const app = express();

app.use(express.json());
app.use("/reparaciones", reparacionesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
