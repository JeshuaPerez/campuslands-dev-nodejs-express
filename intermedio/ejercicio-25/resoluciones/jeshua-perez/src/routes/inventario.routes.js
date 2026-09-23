import { Router } from "express";

const inventario = [];
let siguienteId = 1;

export const inventarioRouter = Router();

inventarioRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: inventario });
});

inventarioRouter.post("/", (req, res) => {
  const { objeto, rareza } = req.body;

  if (!objeto || !rareza) {
    res.status(400).json({ ok: false, message: "objeto y rareza son obligatorios" });
    return;
  }

  const item = { id: siguienteId++, objeto, rareza };
  inventario.push(item);
  res.status(201).json({ ok: true, data: item });
});

inventarioRouter.delete("/:id", (req, res) => {
  const indice = inventario.findIndex((i) => i.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Objeto no encontrado" });
    return;
  }

  inventario.splice(indice, 1);
  res.status(204).end();
});
