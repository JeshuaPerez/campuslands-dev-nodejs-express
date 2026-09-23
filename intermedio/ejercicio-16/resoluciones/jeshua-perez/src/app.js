import express from "express";
import { sneakersRouter } from "./routes/sneakers.routes.js";

export const app = express();

app.use(express.json());
app.use("/sneakers", sneakersRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
