import express from "express";
import { ilustracionesRouter } from "./routes/ilustraciones.routes.js";

export const app = express();

app.use(express.json());
app.use("/ilustraciones", ilustracionesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

// Middleware de error: captura el JSON malformado que rechaza express.json
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ ok: false, message: "JSON invalido en el cuerpo de la peticion" });
    return;
  }

  next(err);
});
