import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

const libros = [{ id: 1, titulo: "Dune" }];

export const librosRouter = Router();

librosRouter.get("/", (req, res) => {
  res.json({ ok: true, data: libros });
});

librosRouter.post("/", requireAuth, (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    res.status(400).json({ ok: false, message: "El titulo es obligatorio" });
    return;
  }

  const libro = { id: libros.length + 1, titulo };
  libros.push(libro);
  res.status(201).json({ ok: true, data: libro });
});
