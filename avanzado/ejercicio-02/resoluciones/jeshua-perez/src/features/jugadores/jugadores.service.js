const jugadores = [{ id: 1, nombre: "s1mple", equipo: "NAVI" }];

export function listarJugadores() {
  return jugadores;
}

export function crearJugador({ nombre, equipo }) {
  if (!nombre || !equipo) {
    throw new Error("nombre y equipo son obligatorios");
  }

  const jugador = { id: jugadores.length + 1, nombre, equipo };
  jugadores.push(jugador);
  return jugador;
}
