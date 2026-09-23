const partidas = [];
let siguienteId = 1;

export function crear(req, res) {
  const { mapa } = req.body;

  if (!mapa || !mapa.trim()) {
    res.status(400).json({ ok: false, message: "El mapa es obligatorio" });
    return;
  }

  const partida = { id: siguienteId++, mapa, estado: "en curso" };
  partidas.push(partida);

  res.status(201).json({ ok: true, data: partida });
}

export function obtener(req, res) {
  const partida = partidas.find((p) => p.id === Number(req.params.id));

  if (!partida) {
    res.status(404).json({ ok: false, message: "Partida no encontrada" });
    return;
  }

  res.status(200).json({ ok: true, data: partida });
}

export function finalizar(req, res) {
  const partida = partidas.find((p) => p.id === Number(req.params.id));

  if (!partida) {
    res.status(404).json({ ok: false, message: "Partida no encontrada" });
    return;
  }

  if (partida.estado === "finalizada") {
    res.status(409).json({ ok: false, message: "La partida ya esta finalizada" });
    return;
  }

  partida.estado = "finalizada";
  res.status(200).json({ ok: true, data: partida });
}
