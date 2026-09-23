import { Router } from "express";
import { buscarCanciones } from "../services/canciones.service.js";

export const cancionesRouter = Router();

cancionesRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: buscarCanciones(req.query.q) });
});
