import { Router } from "express";
import { listarPeleadores } from "../services/peleadores.service.js";

export const peleadoresRouter = Router();

peleadoresRouter.get("/", (req, res) => {
  const resultado = listarPeleadores(req.query);
  res.status(200).json({ ok: true, ...resultado });
});
