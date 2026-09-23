import { Router } from "express";
import { crearPartida, unirseAPartida } from "../services/partidas.service.js";

export const partidasRouter = Router();

partidasRouter.post("/", (req, res, next) => {
  try {
    const partida = crearPartida(req.body);
    res.status(201).json({ ok: true, data: partida });
  } catch (error) {
    next(error);
  }
});

partidasRouter.patch("/:id/unirse", (req, res, next) => {
  try {
    const partida = unirseAPartida(Number(req.params.id));
    res.status(200).json({ ok: true, data: partida });
  } catch (error) {
    next(error);
  }
});
