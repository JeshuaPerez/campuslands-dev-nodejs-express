const goleadores = [
  { id: 1, nombre: "Marta", goles: 18, modalidad: "futbol" },
  { id: 2, nombre: "Falcao", goles: 12, modalidad: "futbol sala" },
];

export function listar(req, res) {
  const { modalidad } = req.query;
  const resultado = modalidad
    ? goleadores.filter((g) => g.modalidad === modalidad)
    : goleadores;

  res.status(200).json({ ok: true, data: resultado });
}

export function agregarGol(req, res) {
  const goleador = goleadores.find((g) => g.id === Number(req.params.id));

  if (!goleador) {
    res.status(404).json({ ok: false, message: "Goleador no encontrado" });
    return;
  }

  goleador.goles += 1;
  res.status(200).json({ ok: true, data: goleador });
}
