import { CacheTTL } from "../lib/cache-ttl.js";

const cache = new CacheTTL(5000);
let consultasReales = 0;

const catalogo = [
  { id: 1, marca: "Ferrari", modelo: "488" },
  { id: 2, marca: "Lamborghini", modelo: "Huracan" },
];

/** Simula una consulta costosa (a una base de datos o API externa). */
function buscarEnCatalogo(id) {
  consultasReales += 1;
  return catalogo.find((a) => a.id === id) ?? null;
}

export function obtenerAuto(id) {
  const clave = `auto:${id}`;
  const enCache = cache.get(clave);

  if (enCache !== undefined) {
    return enCache;
  }

  const auto = buscarEnCatalogo(id);
  cache.set(clave, auto);
  return auto;
}

export function contarConsultasReales() {
  return consultasReales;
}
