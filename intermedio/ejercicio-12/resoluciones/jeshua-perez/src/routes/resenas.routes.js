import { Router } from "express";
import { existePelicula, listarResenas, crearResena } from "../services/resenas.service.js";

export const resenasRouter = Router({ mergeParams: true });

resenasRouter.get("/", (req, res) => {
  const peliculaId = Number(req.params.peliculaId);

  if (!existePelicula(peliculaId)) {
    res.status(404).json({ ok: false, message: "Pelicula no encontrada" });
    return;
  }

  res.status(200).json({ ok: true, data: listarResenas(peliculaId) });
});

resenasRouter.post("/", (req, res) => {
  const peliculaId = Number(req.params.peliculaId);

  if (!existePelicula(peliculaId)) {
    res.status(404).json({ ok: false, message: "Pelicula no encontrada" });
    return;
  }

  try {
    const resena = crearResena(peliculaId, req.body);
    res.status(201).json({ ok: true, data: resena });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});
