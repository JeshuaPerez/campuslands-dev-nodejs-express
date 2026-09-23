import { Router } from "express";
import { crearColeccionService } from "../services/coleccion.service.js";

const jugadoresService = crearColeccionService("Jugador");

export const jugadoresRouter = Router();

jugadoresRouter.get("/", (req, res) => {
  res.json({ ok: true, data: jugadoresService.listar() });
});

jugadoresRouter.post("/", (req, res) => {
  const { nombre } = req.body;

  if (!nombre || !nombre.trim()) {
    res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    return;
  }

  res.status(201).json({ ok: true, data: jugadoresService.crear({ nombre }) });
});
