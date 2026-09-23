const pilotos = [
  { id: 1, nombre: "Ripley" },
  { id: 2, nombre: "Han Solo" },
];

const naves = [
  { id: 1, nombre: "Nostromo", pilotoId: 1 },
  { id: 2, nombre: "Halcon Milenario", pilotoId: 2 },
];

export function listarNavesConPiloto() {
  return naves.map((nave) => ({
    ...nave,
    piloto: pilotos.find((p) => p.id === nave.pilotoId) ?? null,
  }));
}

export function obtenerNaveConPiloto(id) {
  const nave = naves.find((n) => n.id === id);

  if (!nave) {
    throw new Error("NAVE_NO_ENCONTRADA");
  }

  return { ...nave, piloto: pilotos.find((p) => p.id === nave.pilotoId) ?? null };
}
