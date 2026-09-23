export function estaEnRangoParaPartida(jugador, partida) {
  const diferencia = Math.abs(jugador.elo - partida.eloPromedio);
  return diferencia <= partida.rangoMaximo;
}

export function calcularEquipos(jugadores) {
  const ordenados = [...jugadores].sort((a, b) => b.elo - a.elo);
  const equipoA = [];
  const equipoB = [];

  ordenados.forEach((jugador, indice) => {
    (indice % 2 === 0 ? equipoA : equipoB).push(jugador);
  });

  return { equipoA, equipoB };
}
