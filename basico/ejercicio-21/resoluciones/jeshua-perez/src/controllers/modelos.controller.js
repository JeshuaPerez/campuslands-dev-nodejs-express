const modelos = [];
let siguienteId = 1;

export function listarModelos(req, res) {
  res.json({ ok: true, data: modelos });
}

export function crearModelo(req, res) {
  const { nombre, software } = req.body;

  if (!nombre || !software) {
    res.status(400).json({ ok: false, message: "nombre y software son obligatorios" });
    return;
  }

  const modelo = { id: siguienteId++, nombre, software };
  modelos.push(modelo);

  res.status(201).json({ ok: true, data: modelo });
}
