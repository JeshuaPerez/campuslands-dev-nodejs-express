const DURACION_MS = 300;

/**
 * Simula un punto de pingpong de forma asincrona (no bloquea el hilo).
 * @param {string} playerName
 * @returns {Promise<{player: string, result: string}>}
 */
export function playRally(playerName) {
  return new Promise((resolve, reject) => {
    if (!playerName || !playerName.trim()) {
      reject(new Error("El nombre del jugador es obligatorio"));
      return;
    }

    setTimeout(() => {
      resolve({
        player: playerName,
        result: `${playerName} gano el punto`,
      });
    }, DURACION_MS);
  });
}
