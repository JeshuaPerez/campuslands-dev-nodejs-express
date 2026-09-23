import express from "express";
import { reservasRouter } from "./routes/reservas.routes.js";

export const app = express();

app.use(express.json());
app.use("/reservas", reservasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
