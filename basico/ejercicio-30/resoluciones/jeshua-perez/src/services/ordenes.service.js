const ordenes = [];
let siguienteId = 1;

export function listarOrdenes({ estado } = {}) {
  return estado ? ordenes.filter((o) => o.estado === estado) : ordenes;
}

export function obtenerOrden(id) {
  const orden = ordenes.find((o) => o.id === id);
  if (!orden) {
    throw new Error("ORDEN_NO_ENCONTRADA");
  }
  return orden;
}

export function crearOrden({ moto, falla }) {
  if (!moto || !moto.trim()) {
    throw new Error("La moto es obligatoria");
  }
  if (!falla || !falla.trim()) {
    throw new Error("La falla es obligatoria");
  }

  const orden = { id: siguienteId++, moto, falla, estado: "pendiente" };
  ordenes.push(orden);
  return orden;
}

export function cerrarOrden(id) {
  const orden = obtenerOrden(id);

  if (orden.estado === "cerrada") {
    throw new Error("ORDEN_YA_CERRADA");
  }

  orden.estado = "cerrada";
  return orden;
}
