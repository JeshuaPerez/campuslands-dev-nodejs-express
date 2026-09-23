const DURACION_MS = 300;

/**
 * Simula la reproduccion de una cancion usando una Promesa.
 * @param {string} trackName
 * @returns {Promise<string>}
 */
export function playTrack(trackName) {
  return new Promise((resolve, reject) => {
    if (!trackName || !trackName.trim()) {
      reject(new Error("El nombre de la cancion es obligatorio"));
      return;
    }

    setTimeout(() => {
      resolve(`Reproduciendo: ${trackName}`);
    }, DURACION_MS);
  });
}
