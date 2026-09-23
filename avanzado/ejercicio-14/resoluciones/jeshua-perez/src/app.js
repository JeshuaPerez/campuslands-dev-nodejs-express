import express from "express";
import { registrarMetricas } from "./middlewares/metricas.middleware.js";
import { metricas } from "./lib/metricas.js";

const libros = [{ id: 1, titulo: "Dune" }];

export const app = express();

app.use(registrarMetricas);

app.get("/libros", (req, res) => {
  res.status(200).json({ ok: true, data: libros });
});

app.get("/libros/:id", (req, res) => {
  const libro = libros.find((l) => l.id === Number(req.params.id));

  if (!libro) {
    res.status(404).json({ ok: false, message: "Libro no encontrado" });
    return;
  }

  res.status(200).json({ ok: true, data: libro });
});

app.get("/metrics", (req, res) => {
  res.status(200).json({ ok: true, data: metricas.resumen() });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
