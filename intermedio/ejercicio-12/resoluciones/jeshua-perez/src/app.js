import express from "express";
import { resenasRouter } from "./routes/resenas.routes.js";

export const app = express();

app.use(express.json());
app.use("/peliculas/:peliculaId/resenas", resenasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
