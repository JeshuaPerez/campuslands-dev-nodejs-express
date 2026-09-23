import { Router } from "express";

const jugadores = [];
let siguienteId = 1;

export const jugadoresRouter = Router();

jugadoresRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: jugadores });
});

jugadoresRouter.get("/:id", (req, res) => {
  const jugador = jugadores.find((j) => j.id === Number(req.params.id));

  if (!jugador) {
    res.status(404).json({ ok: false, message: "Jugador no encontrado" });
    return;
  }

  res.status(200).json({ ok: true, data: jugador });
});

jugadoresRouter.post("/", (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    return;
  }

  const jugador = { id: siguienteId++, nombre, vivo: true };
  jugadores.push(jugador);
  res.status(201).json({ ok: true, data: jugador });
});

jugadoresRouter.patch("/:id/eliminar", (req, res) => {
  const jugador = jugadores.find((j) => j.id === Number(req.params.id));

  if (!jugador) {
    res.status(404).json({ ok: false, message: "Jugador no encontrado" });
    return;
  }

  jugador.vivo = false;
  res.status(200).json({ ok: true, data: jugador });
});
