import { Router } from "express";
import { suscribir, dispararEvento } from "../services/webhooks.service.js";

export const webhooksRouter = Router();

webhooksRouter.post("/suscripciones", (req, res) => {
  try {
    const suscripcion = suscribir(req.body);
    res.status(201).json({ ok: true, data: suscripcion });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

webhooksRouter.post("/disparar/:evento", async (req, res) => {
  const resultados = await dispararEvento(req.params.evento, req.body);
  res.status(200).json({ ok: true, data: resultados });
});
