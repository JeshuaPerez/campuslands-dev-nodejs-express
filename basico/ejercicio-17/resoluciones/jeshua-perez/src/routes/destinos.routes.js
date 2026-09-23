import { Router } from "express";

const destinos = [
  { id: 1, nombre: "Cartagena", pais: "Colombia" },
  { id: 2, nombre: "Cusco", pais: "Peru" },
  { id: 3, nombre: "Antigua", pais: "Guatemala" },
];

export const destinosRouter = Router();

destinosRouter.get("/", (req, res) => {
  const { pais } = req.query;
  const resultado = pais
    ? destinos.filter((d) => d.pais.toLowerCase() === pais.toLowerCase())
    : destinos;

  res.json({ ok: true, data: resultado });
});

destinosRouter.get("/:id", (req, res) => {
  const destino = destinos.find((d) => d.id === Number(req.params.id));

  if (!destino) {
    res.status(404).json({ ok: false, message: "Destino no encontrado" });
    return;
  }

  res.json({ ok: true, data: destino });
});
