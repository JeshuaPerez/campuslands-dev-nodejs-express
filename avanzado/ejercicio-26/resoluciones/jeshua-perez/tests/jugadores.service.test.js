import { test } from "node:test";
import assert from "node:assert/strict";
import { estaEnRangoParaPartida, calcularEquipos } from "../src/services/jugadores.service.js";
import { crearJugadorFake, crearPartidaFake } from "./factories/jugador.factory.js";

test("estaEnRangoParaPartida usa los defaults de la factory sin repetir el objeto entero", () => {
  const jugador = crearJugadorFake();
  const partida = crearPartidaFake();

  assert.equal(estaEnRangoParaPartida(jugador, partida), true);
});

test("estaEnRangoParaPartida rechaza un jugador fuera de rango, sobreescribiendo solo elo", () => {
  const jugador = crearJugadorFake({ elo: 3000 });
  const partida = crearPartidaFake();

  assert.equal(estaEnRangoParaPartida(jugador, partida), false);
});

test("calcularEquipos reparte alternando por elo descendente", () => {
  const jugadores = [
    crearJugadorFake({ elo: 2200 }),
    crearJugadorFake({ elo: 1800 }),
    crearJugadorFake({ elo: 2000 }),
    crearJugadorFake({ elo: 1600 }),
  ];

  const { equipoA, equipoB } = calcularEquipos(jugadores);

  assert.equal(equipoA.length, 2);
  assert.equal(equipoB.length, 2);
  assert.equal(equipoA[0].elo, 2200);
});
