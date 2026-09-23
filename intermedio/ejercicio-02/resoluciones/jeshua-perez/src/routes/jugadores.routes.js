import { Router } from "express";

const jugadores = [
  { id: 1, nombre: "s1mple", equipo: "NAVI" },
  { id: 2, nombre: "ZywOo", equipo: "Vitality" },
];

export const jugadoresRouter = Router();

jugadoresRouter.get("/", (req, res) => {
  res.json({ ok: true, data: jugadores });
});
