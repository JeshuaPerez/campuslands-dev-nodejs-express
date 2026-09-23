const peleadores = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nombre: `Peleador ${i + 1}`,
  categoria: i % 2 === 0 ? "pesado" : "semipesado",
}));

export function listarPeleadores({ categoria, page = 1, limit = 10 } = {}) {
  const pagina = Math.max(1, Number(page) || 1);
  const tamano = Math.max(1, Math.min(50, Number(limit) || 10));

  const filtrados = categoria
    ? peleadores.filter((p) => p.categoria === categoria)
    : peleadores;

  const inicio = (pagina - 1) * tamano;
  const data = filtrados.slice(inicio, inicio + tamano);

  return {
    data,
    total: filtrados.length,
    page: pagina,
    limit: tamano,
    totalPages: Math.ceil(filtrados.length / tamano),
  };
}
