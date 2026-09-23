import { Router } from "express";

export const ilustracionesRouter = Router();

ilustracionesRouter.post("/", (req, res) => {
  const { titulo, software } = req.body;

  if (!titulo || !software) {
    res.status(400).json({ ok: false, message: "titulo y software son obligatorios" });
    return;
  }

  res.status(201).json({ ok: true, data: { titulo, software } });
});
