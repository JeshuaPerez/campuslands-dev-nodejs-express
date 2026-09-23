import { OrdenNoEncontradaError, OrdenYaCerradaError } from "../errors/domain-errors.js";

const ordenes = [];
let siguienteId = 1;

export function listarOrdenes({ estado, page = 1, limit = 10 } = {}) {
  const pagina = Math.max(1, Number(page) || 1);
  const tamano = Math.max(1, Math.min(50, Number(limit) || 10));

  const filtradas = estado ? ordenes.filter((o) => o.estado === estado) : ordenes;
  const inicio = (pagina - 1) * tamano;

  return {
    data: filtradas.slice(inicio, inicio + tamano),
    total: filtradas.length,
    page: pagina,
    totalPages: Math.ceil(filtradas.length / tamano) || 1,
  };
}

export function crearOrden({ moto, falla }) {
  const orden = { id: siguienteId++, moto, falla, estado: "pendiente" };
  ordenes.push(orden);
  return orden;
}

export function cerrarOrden(id) {
  const orden = ordenes.find((o) => o.id === id);

  if (!orden) {
    throw new OrdenNoEncontradaError();
  }

  if (orden.estado === "cerrada") {
    throw new OrdenYaCerradaError();
  }

  orden.estado = "cerrada";
  return orden;
}
