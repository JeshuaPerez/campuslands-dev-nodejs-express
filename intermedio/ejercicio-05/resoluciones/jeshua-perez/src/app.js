import express from "express";
import { equiposRouter } from "./routes/equipos.routes.js";

export const app = express();

app.use(express.json());
app.use("/equipos", equiposRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
