const personajes = [{ id: 1, nombre: "Aragorn", clase: "Guerrero" }];
let siguienteId = 2;

export function listar(req, res) {
  res.status(200).json({ ok: true, data: personajes });
}

export function obtener(req, res) {
  const personaje = personajes.find((p) => p.id === Number(req.params.id));

  if (!personaje) {
    res.status(404).json({ ok: false, message: "Personaje no encontrado" });
    return;
  }

  res.status(200).json({ ok: true, data: personaje });
}

export function crear(req, res) {
  const { nombre, clase } = req.body;

  if (!nombre || !clase) {
    res.status(400).json({ ok: false, message: "nombre y clase son obligatorios" });
    return;
  }

  if (personajes.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())) {
    res.status(409).json({ ok: false, message: "Ya existe un personaje con ese nombre" });
    return;
  }

  const personaje = { id: siguienteId++, nombre, clase };
  personajes.push(personaje);

  res.status(201).json({ ok: true, data: personaje });
}

export function eliminar(req, res) {
  const indice = personajes.findIndex((p) => p.id === Number(req.params.id));

  if (indice === -1) {
    res.status(404).json({ ok: false, message: "Personaje no encontrado" });
    return;
  }

  personajes.splice(indice, 1);
  res.status(204).end();
}
