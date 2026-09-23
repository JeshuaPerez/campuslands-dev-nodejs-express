const peliculas = [
  { id: 1, titulo: "It" },
  { id: 2, titulo: "Annabelle" },
];

const resenas = [];
let siguienteId = 1;

export function existePelicula(peliculaId) {
  return peliculas.some((p) => p.id === peliculaId);
}

export function listarResenas(peliculaId) {
  return resenas.filter((r) => r.peliculaId === peliculaId);
}

export function crearResena(peliculaId, { autor, comentario }) {
  if (!autor || !comentario) {
    throw new Error("autor y comentario son obligatorios");
  }

  const resena = { id: siguienteId++, peliculaId, autor, comentario };
  resenas.push(resena);
  return resena;
}
