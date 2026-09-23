import { PartidaNoEncontradaError, PartidaLlenaError, DatosInvalidosError } from "../errors/domain-errors.js";

const CAPACIDAD_MAXIMA = 4;
const partidas = [];
let siguienteId = 1;

export function crearPartida({ mapa }) {
  if (!mapa) {
    throw new DatosInvalidosError("El mapa es obligatorio");
  }

  const partida = { id: siguienteId++, mapa, jugadores: 0 };
  partidas.push(partida);
  return partida;
}

export function unirseAPartida(id) {
  const partida = partidas.find((p) => p.id === id);

  if (!partida) {
    throw new PartidaNoEncontradaError();
  }

  if (partida.jugadores >= CAPACIDAD_MAXIMA) {
    throw new PartidaLlenaError();
  }

  partida.jugadores += 1;
  return partida;
}
