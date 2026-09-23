import { Router } from "express";

const personajes = [{ id: 1, nombre: "Aragorn", clase: "Guerrero" }];

export const personajesRouterV1 = Router();

personajesRouterV1.get("/", (req, res) => {
  res.status(200).json({ ok: true, version: "v1", data: personajes });
});
