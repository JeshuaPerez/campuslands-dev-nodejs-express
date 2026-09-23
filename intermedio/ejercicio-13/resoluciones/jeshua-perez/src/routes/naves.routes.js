import { Router } from "express";
import { listarNavesConPiloto, obtenerNaveConPiloto } from "../services/naves.service.js";

export const navesRouter = Router();

navesRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: listarNavesConPiloto() });
});

navesRouter.get("/:id", (req, res) => {
  try {
    const nave = obtenerNaveConPiloto(Number(req.params.id));
    res.status(200).json({ ok: true, data: nave });
  } catch (error) {
    res.status(404).json({ ok: false, message: "Nave no encontrada" });
  }
});
