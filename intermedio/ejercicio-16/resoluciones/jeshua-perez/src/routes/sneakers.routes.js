import { Router } from "express";
import { requireAuth, requireRol } from "../middlewares/auth.middleware.js";

const sneakers = [{ id: 1, modelo: "Air Force 1" }];

export const sneakersRouter = Router();

sneakersRouter.get("/", requireAuth, (req, res) => {
  res.status(200).json({ ok: true, data: sneakers });
});

sneakersRouter.post("/", requireAuth, requireRol("admin"), (req, res) => {
  const { modelo } = req.body;

  if (!modelo) {
    res.status(400).json({ ok: false, message: "El modelo es obligatorio" });
    return;
  }

  const sneaker = { id: sneakers.length + 1, modelo };
  sneakers.push(sneaker);
  res.status(201).json({ ok: true, data: sneaker });
});
