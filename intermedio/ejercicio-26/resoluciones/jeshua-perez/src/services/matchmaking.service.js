import { servidorPartidasClient } from "../clients/servidor-partidas.client.js";

const CAPACIDAD_MAXIMA = 10;

export async function unirseAPartida(region) {
  if (!region) {
    throw new Error("La region es obligatoria");
  }

  const sala = await servidorPartidasClient.buscarSala(region);

  if (sala.jugadores >= CAPACIDAD_MAXIMA) {
    throw new Error("SALA_LLENA");
  }

  return { ...sala, jugadores: sala.jugadores + 1 };
}
