import { Router } from "express";

const disenosPorEstudio = {
  1: [
    { estilo: "old-school", nombre: "Golondrina" },
    { estilo: "realismo", nombre: "Retrato" },
  ],
  2: [{ estilo: "minimalista", nombre: "Linea fina" }],
};

export const disenosRouter = Router();

disenosRouter.get("/:estudioId/disenos", (req, res) => {
  const { estudioId } = req.params;
  const { estilo } = req.query;

  const disenos = disenosPorEstudio[estudioId];

  if (!disenos) {
    res.status(404).json({ ok: false, message: "Estudio no encontrado" });
    return;
  }

  const resultado = estilo
    ? disenos.filter((d) => d.estilo === estilo)
    : disenos;

  res.json({ ok: true, estudioId, data: resultado });
});
