import { Router } from "express";
import { crearPersonaje, equiparArma, atacar } from "../services/personajes.service.js";

export const personajesRouter = Router();

personajesRouter.post("/", (req, res) => {
  try {
    const personaje = crearPersonaje(req.body);
    res.status(201).json({ ok: true, data: personaje });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

personajesRouter.patch("/:id/equipar", (req, res) => {
  try {
    const personaje = equiparArma(Number(req.params.id), req.body.arma);
    res.status(200).json({ ok: true, data: personaje });
  } catch (error) {
    if (error.message === "PERSONAJE_NO_ENCONTRADO") {
      res.status(404).json({ ok: false, message: "Personaje no encontrado" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
});

personajesRouter.post("/:id/atacar", (req, res) => {
  try {
    const resultado = atacar(Number(req.params.id));
    res.status(200).json({ ok: true, data: resultado });
  } catch (error) {
    res.status(404).json({ ok: false, message: "Personaje no encontrado" });
  }
});
