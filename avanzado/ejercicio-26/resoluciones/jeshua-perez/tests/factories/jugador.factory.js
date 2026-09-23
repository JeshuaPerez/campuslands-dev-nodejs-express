let siguienteId = 1;

/**
 * Factory de jugadores para tests: da valores por defecto razonables y
 * permite sobreescribir solo lo que cada test necesita, en vez de
 * repetir el objeto completo en cada archivo de test.
 */
export function crearJugadorFake(overrides = {}) {
  return {
    id: siguienteId++,
    nombre: "Jugador Fake",
    elo: 2000,
    ...overrides,
  };
}

export function crearPartidaFake(overrides = {}) {
  return {
    id: siguienteId++,
    eloPromedio: 2000,
    rangoMaximo: 200,
    ...overrides,
  };
}
