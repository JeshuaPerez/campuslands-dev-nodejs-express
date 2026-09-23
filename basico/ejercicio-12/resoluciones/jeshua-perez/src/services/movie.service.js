const DURACION_MS = 200;

/**
 * Simula la carga de una pelicula de terror.
 * @param {string} movieName
 * @returns {Promise<string>}
 */
export function loadMovie(movieName) {
  return new Promise((resolve, reject) => {
    if (!movieName || !movieName.trim()) {
      reject(new Error("El nombre de la pelicula es obligatorio"));
      return;
    }

    setTimeout(() => {
      resolve(`${movieName} lista para ver`);
    }, DURACION_MS);
  });
}

/**
 * Carga dos peliculas en secuencia usando await.
 * @param {string} primera
 * @param {string} segunda
 * @returns {Promise<string[]>}
 */
export async function loadMarathon(primera, segunda) {
  const resultados = [];
  resultados.push(await loadMovie(primera));
  resultados.push(await loadMovie(segunda));
  return resultados;
}
