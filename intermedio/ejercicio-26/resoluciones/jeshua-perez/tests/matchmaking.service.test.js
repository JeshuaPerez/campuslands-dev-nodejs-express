import { test } from "node:test";
import assert from "node:assert/strict";
import { servidorPartidasClient } from "../src/clients/servidor-partidas.client.js";
import { unirseAPartida } from "../src/services/matchmaking.service.js";

test("usa el resultado mockeado del cliente externo, no llama al real", async (t) => {
  t.mock.method(servidorPartidasClient, "buscarSala", async () => ({
    id: "sala-mock",
    jugadores: 3,
    region: "na",
  }));

  const sala = await unirseAPartida("na");

  assert.equal(sala.id, "sala-mock");
  assert.equal(sala.jugadores, 4);
  assert.equal(servidorPartidasClient.buscarSala.mock.calls.length, 1);
});

test("lanza SALA_LLENA si el mock devuelve la capacidad maxima", async (t) => {
  t.mock.method(servidorPartidasClient, "buscarSala", async () => ({
    id: "sala-llena",
    jugadores: 10,
    region: "eu",
  }));

  await assert.rejects(() => unirseAPartida("eu"), /SALA_LLENA/);
});

test("valida la region antes de llamar al cliente", async (t) => {
  const mock = t.mock.method(servidorPartidasClient, "buscarSala");

  await assert.rejects(() => unirseAPartida(""));
  assert.equal(mock.mock.calls.length, 0);
});
