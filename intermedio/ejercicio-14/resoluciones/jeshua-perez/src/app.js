import express from "express";
import { librosRouter } from "./routes/libros.routes.js";

export const app = express();

app.use(express.json());
app.use("/libros", librosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
