import { test } from "node:test";
import assert from "node:assert/strict";
import { playRally } from "../src/services/rally.service.js";

test("playRally resuelve con el resultado del punto", async () => {
  const resultado = await playRally("Ana");
  assert.equal(resultado.player, "Ana");
  assert.match(resultado.result, /Ana gano el punto/);
});

test("playRally rechaza si el nombre viene vacio", async () => {
  await assert.rejects(() => playRally(""), /El nombre del jugador es obligatorio/);
});

test("playRally rechaza si el nombre no viene", async () => {
  await assert.rejects(() => playRally(undefined), /El nombre del jugador es obligatorio/);
});
