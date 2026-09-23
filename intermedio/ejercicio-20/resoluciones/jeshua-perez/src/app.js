import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";

const ilustraciones = [{ id: 1, titulo: "Paisaje" }];

export const app = express();

app.use(cors(corsOptions));

app.get("/ilustraciones", (req, res) => {
  res.json({ ok: true, data: ilustraciones });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.message === "Origen no permitido por CORS") {
    res.status(403).json({ ok: false, message: err.message });
    return;
  }
  next(err);
});
