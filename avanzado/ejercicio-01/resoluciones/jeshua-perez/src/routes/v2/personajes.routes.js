import { Router } from "express";

// v2 agrega el campo "nivel", que v1 no tenia (rotura de contrato controlada por version).
const personajes = [{ id: 1, nombre: "Aragorn", clase: "Guerrero", nivel: 42 }];

export const personajesRouterV2 = Router();

personajesRouterV2.get("/", (req, res) => {
  res.status(200).json({ ok: true, version: "v2", data: personajes });
});
