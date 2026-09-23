import express from "express";
import { heroesRouter } from "./routes/heroes.routes.js";

export const app = express();

app.use(express.json());
app.use("/heroes", heroesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
