import express from "express";
import { inventarioRouter } from "./routes/inventario.routes.js";

export const app = express();

app.use(express.json());
app.use("/inventario", inventarioRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
