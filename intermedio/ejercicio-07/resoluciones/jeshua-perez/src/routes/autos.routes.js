import { Router } from "express";
import { HttpError } from "../errors/http-error.js";

const autos = [{ id: 1, marca: "Ferrari", modelo: "488" }];

export const autosRouter = Router();

autosRouter.get("/:id", (req, res, next) => {
  const auto = autos.find((a) => a.id === Number(req.params.id));

  if (!auto) {
    next(new HttpError(404, "Auto no encontrado"));
    return;
  }

  res.status(200).json({ ok: true, data: auto });
});

autosRouter.post("/", (req, res, next) => {
  const { marca, modelo } = req.body;

  if (!marca || !modelo) {
    next(new HttpError(400, "marca y modelo son obligatorios"));
    return;
  }

  const auto = { id: autos.length + 1, marca, modelo };
  autos.push(auto);
  res.status(201).json({ ok: true, data: auto });
});
