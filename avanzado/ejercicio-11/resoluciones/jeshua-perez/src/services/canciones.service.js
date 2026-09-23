const canciones = [];
let siguienteId = 1;

function validarCancion({ titulo, artista }) {
  if (!titulo || !artista) {
    return "titulo y artista son obligatorios";
  }
  return null;
}

/**
 * Importa un arreglo de canciones. No aborta todo el lote si una fila
 * falla: reporta cada fila por separado (importada u error), como una
 * importacion masiva real.
 */
export function importarCanciones(filas) {
  const resultado = { importadas: [], errores: [] };

  filas.forEach((fila, indice) => {
    const error = validarCancion(fila);

    if (error) {
      resultado.errores.push({ fila: indice, message: error });
      return;
    }

    const cancion = { id: siguienteId++, titulo: fila.titulo, artista: fila.artista };
    canciones.push(cancion);
    resultado.importadas.push(cancion);
  });

  return resultado;
}

export function listarCanciones() {
  return canciones;
}
