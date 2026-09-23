import { Router } from "express";

const torneos = [{ id: 1, nombre: "The International", juego: "Dota 2" }];

export const torneosRouter = Router();

torneosRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: torneos });
});

torneosRouter.post("/", (req, res) => {
  const { nombre, juego } = req.body;

  if (!nombre || !juego) {
    res.status(400).json({ ok: false, message: "nombre y juego son obligatorios" });
    return;
  }

  const torneo = { id: torneos.length + 1, nombre, juego };
  torneos.push(torneo);
  res.status(201).json({ ok: true, data: torneo });
});
