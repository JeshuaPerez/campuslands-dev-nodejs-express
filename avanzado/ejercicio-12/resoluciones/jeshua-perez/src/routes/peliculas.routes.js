import { Router } from "express";

const peliculas = [
  { id: 1, titulo: "It", anio: 2017 },
  { id: 2, titulo: "Annabelle", anio: 2014 },
];

export const peliculasRouter = Router();

peliculasRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: peliculas });
});

peliculasRouter.get("/exportar", (req, res) => {
  const contenido = JSON.stringify(peliculas, null, 2);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=peliculas-de-miedo.json");
  res.status(200).send(contenido);
});
