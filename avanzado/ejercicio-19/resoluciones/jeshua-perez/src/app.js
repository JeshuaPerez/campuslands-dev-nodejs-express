import express from "express";
import { auditar } from "./middlewares/auditoria.middleware.js";
import { listarAuditoria } from "./services/auditoria.service.js";

const disenos = [];
let siguienteId = 1;

export const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.usuario = { nombre: req.headers["x-usuario"] || "anonimo" };
  next();
});

app.post("/disenos", auditar("crear_diseno"), (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    return;
  }

  const diseno = { id: siguienteId++, nombre };
  disenos.push(diseno);
  res.status(201).json({ ok: true, data: diseno });
});

app.delete("/disenos/:id", auditar("eliminar_diseno"), (req, res) => {
  const indice = disenos.findIndex((d) => d.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Diseno no encontrado" });
    return;
  }

  disenos.splice(indice, 1);
  res.status(204).end();
});

app.get("/auditoria", (req, res) => {
  res.status(200).json({ ok: true, data: listarAuditoria() });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
