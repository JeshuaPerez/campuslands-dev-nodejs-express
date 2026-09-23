import express from "express";
import { torneosRouter } from "./routes/torneos.routes.js";
import { docsRouter } from "./routes/docs.routes.js";

export const app = express();

app.use(express.json());
app.use("/torneos", torneosRouter);
app.use("/docs", docsRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
