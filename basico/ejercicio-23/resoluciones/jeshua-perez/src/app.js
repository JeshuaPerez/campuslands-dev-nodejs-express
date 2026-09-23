import express from "express";
import { trabajosRouter } from "./routes/trabajos.routes.js";

export const app = express();

app.use(express.json());
app.use("/trabajos", trabajosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
