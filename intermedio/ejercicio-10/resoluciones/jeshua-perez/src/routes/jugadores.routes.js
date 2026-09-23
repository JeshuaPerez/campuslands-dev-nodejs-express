import { Router } from "express";
import { listarJugadores } from "../services/jugadores.service.js";

export const jugadoresRouter = Router();

jugadoresRouter.get("/", (req, res) => {
  try {
    const data = listarJugadores(req.query);
    res.status(200).json({ ok: true, data });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});
