import { Router } from "express";
import { identificar, requierePermiso } from "../middlewares/permisos.middleware.js";

const reservas = [];
let siguienteId = 1;

export const reservasRouter = Router();

reservasRouter.get("/", identificar, requierePermiso("ver_reservas"), (req, res) => {
  res.status(200).json({ ok: true, data: reservas });
});

reservasRouter.post("/", identificar, requierePermiso("crear_reserva"), (req, res) => {
  const { destino } = req.body;

  if (!destino) {
    res.status(400).json({ ok: false, message: "El destino es obligatorio" });
    return;
  }

  const reserva = { id: siguienteId++, destino };
  reservas.push(reserva);
  res.status(201).json({ ok: true, data: reserva });
});

reservasRouter.delete("/:id", identificar, requierePermiso("cancelar_reserva"), (req, res) => {
  const indice = reservas.findIndex((r) => r.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    return;
  }

  reservas.splice(indice, 1);
  res.status(204).end();
});
