import express from "express";
import { misionesRouter } from "./routes/misiones.routes.js";

export const app = express();

app.use(express.json());
app.use("/misiones", misionesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
