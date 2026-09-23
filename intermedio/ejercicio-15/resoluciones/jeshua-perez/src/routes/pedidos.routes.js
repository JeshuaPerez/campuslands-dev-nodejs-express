import { Router } from "express";
import { requireJwt } from "../middlewares/jwt-auth.middleware.js";

export const pedidosRouter = Router();

pedidosRouter.get("/", requireJwt, (req, res) => {
  res.status(200).json({ ok: true, usuario: req.usuario.usuario, data: [] });
});
