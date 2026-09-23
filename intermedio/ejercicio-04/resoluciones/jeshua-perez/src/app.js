import express from "express";
import { jugadoresRouter } from "./routes/jugadores.routes.js";
import { zonasRouter } from "./routes/zonas.routes.js";

export const app = express();

app.use(express.json());
app.use("/jugadores", jugadoresRouter);
app.use("/zonas", zonasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
