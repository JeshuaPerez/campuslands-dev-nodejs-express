import { Router } from "express";
import { crearColeccionService } from "../services/coleccion.service.js";

const zonasService = crearColeccionService("Zona");

export const zonasRouter = Router();

zonasRouter.get("/", (req, res) => {
  res.json({ ok: true, data: zonasService.listar() });
});

zonasRouter.post("/", (req, res) => {
  const { nombre } = req.body;

  if (!nombre || !nombre.trim()) {
    res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    return;
  }

  res.status(201).json({ ok: true, data: zonasService.crear({ nombre }) });
});
