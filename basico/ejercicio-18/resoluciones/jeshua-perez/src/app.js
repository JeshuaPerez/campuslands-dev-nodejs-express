import express from "express";
import { saltosRouter } from "./routes/saltos.routes.js";

export const app = express();

app.use(express.json());
app.use("/saltos", saltosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
