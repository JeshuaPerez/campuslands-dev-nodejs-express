import express from "express";
import { formulasRouter } from "./routes/formulas.routes.js";

export const app = express();

app.use(express.json());
app.use("/formulas", formulasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
