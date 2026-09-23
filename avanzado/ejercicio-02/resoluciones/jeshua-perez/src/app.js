import express from "express";
import { armasRouter } from "./features/armas/index.js";
import { jugadoresRouter } from "./features/jugadores/index.js";

export const app = express();

app.use(express.json());
app.use("/armas", armasRouter);
app.use("/jugadores", jugadoresRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
