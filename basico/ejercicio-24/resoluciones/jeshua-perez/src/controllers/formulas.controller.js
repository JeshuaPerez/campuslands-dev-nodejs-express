const formulas = [{ id: 1, nombre: "Agua", simbolo: "H2O" }];
let siguienteId = 2;

export function listar(req, res) {
  res.json({ ok: true, data: formulas });
}

export function obtener(req, res) {
  const formula = formulas.find((f) => f.id === Number(req.params.id));

  if (!formula) {
    res.status(404).json({ ok: false, message: "Formula no encontrada" });
    return;
  }

  res.json({ ok: true, data: formula });
}

export function crear(req, res) {
  const { nombre, simbolo } = req.body;

  if (!nombre || !simbolo) {
    res.status(400).json({ ok: false, message: "nombre y simbolo son obligatorios" });
    return;
  }

  const formula = { id: siguienteId++, nombre, simbolo };
  formulas.push(formula);

  res.status(201).json({ ok: true, data: formula });
}

export function actualizar(req, res) {
  const formula = formulas.find((f) => f.id === Number(req.params.id));

  if (!formula) {
    res.status(404).json({ ok: false, message: "Formula no encontrada" });
    return;
  }

  const { nombre, simbolo } = req.body;

  if (!nombre || !simbolo) {
    res.status(400).json({ ok: false, message: "nombre y simbolo son obligatorios" });
    return;
  }

  formula.nombre = nombre;
  formula.simbolo = simbolo;

  res.json({ ok: true, data: formula });
}

export function eliminar(req, res) {
  const indice = formulas.findIndex((f) => f.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Formula no encontrada" });
    return;
  }

  formulas.splice(indice, 1);
  res.status(204).end();
}
