const trabajos = [];
let siguienteId = 1;

export function listar(req, res) {
  res.json({ ok: true, data: trabajos });
}

export function crear(req, res) {
  const { pieza, tipoSoldadura } = req.body;

  if (!pieza || !tipoSoldadura) {
    res.status(400).json({ ok: false, message: "pieza y tipoSoldadura son obligatorios" });
    return;
  }

  const trabajo = { id: siguienteId++, pieza, tipoSoldadura };
  trabajos.push(trabajo);

  res.status(201).json({ ok: true, data: trabajo });
}

export function eliminar(req, res) {
  const id = Number(req.params.id);
  const indice = trabajos.findIndex((t) => t.id === id);

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Trabajo no encontrado" });
    return;
  }

  trabajos.splice(indice, 1);
  res.status(204).end();
}
