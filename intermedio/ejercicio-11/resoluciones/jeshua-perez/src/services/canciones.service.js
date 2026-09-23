const canciones = [
  { id: 1, titulo: "Bohemian Rhapsody", artista: "Queen" },
  { id: 2, titulo: "Imagine", artista: "John Lennon" },
  { id: 3, titulo: "Yesterday", artista: "The Beatles" },
];

export function buscarCanciones(q) {
  if (!q || !q.trim()) {
    return canciones;
  }

  const termino = q.trim().toLowerCase();

  return canciones.filter(
    (c) => c.titulo.toLowerCase().includes(termino) || c.artista.toLowerCase().includes(termino)
  );
}
