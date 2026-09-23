const misiones = [];
let siguienteId = 1;

export function listarMisiones({ estado } = {}) {
  return estado ? misiones.filter((m) => m.estado === estado) : misiones;
}

export function crearMision({ titulo, recompensaOro }) {
  if (!titulo || !titulo.trim()) {
    throw new Error("El titulo es obligatorio");
  }

  if (typeof recompensaOro !== "number" || recompensaOro <= 0) {
    throw new Error("La recompensa debe ser un numero mayor a 0");
  }

  const mision = { id: siguienteId++, titulo, recompensaOro, estado: "disponible" };
  misiones.push(mision);
  return mision;
}

export function completarMision(id) {
  const mision = misiones.find((m) => m.id === id);

  if (!mision) {
    throw new Error("MISION_NO_ENCONTRADA");
  }

  if (mision.estado === "completada") {
    throw new Error("MISION_YA_COMPLETADA");
  }

  mision.estado = "completada";
  return mision;
}
