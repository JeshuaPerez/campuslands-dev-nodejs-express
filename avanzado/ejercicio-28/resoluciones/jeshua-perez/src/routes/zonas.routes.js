import { Router } from "express";

const zonas = [{ id: 1, nombre: "Zona segura" }];

export const zonasRouter = Router();

zonasRouter.get("/", (req, res) => {
  res.status(200).json({ ok: true, data: zonas });
});
