import { Router } from "express";

const armas = [
  { id: 1, nombre: "AK-47", tipo: "rifle" },
  { id: 2, nombre: "AWP", tipo: "francotirador" },
];

export const armasRouter = Router();

armasRouter.get("/", (req, res) => {
  res.json({ ok: true, data: armas });
});
