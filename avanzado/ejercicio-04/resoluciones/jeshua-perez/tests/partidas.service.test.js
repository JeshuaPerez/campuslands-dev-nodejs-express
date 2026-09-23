import { test } from "node:test";
import assert from "node:assert/strict";
import { crearPartida, unirseAPartida } from "../src/services/partidas.service.js";
import { PartidaNoEncontradaError, PartidaLlenaError, DatosInvalidosError } from "../src/errors/domain-errors.js";

test("crearPartida lanza DatosInvalidosError sin mapa", () => {
  assert.throws(() => crearPartida({}), DatosInvalidosError);
});

test("unirseAPartida lanza PartidaNoEncontradaError si no existe", () => {
  assert.throws(() => unirseAPartida(999999), PartidaNoEncontradaError);
});

test("unirseAPartida lanza PartidaLlenaError al llegar a la capacidad", () => {
  const partida = crearPartida({ mapa: "Dust" });
  unirseAPartida(partida.id);
  unirseAPartida(partida.id);
  unirseAPartida(partida.id);
  unirseAPartida(partida.id);

  assert.throws(() => unirseAPartida(partida.id), PartidaLlenaError);
});

test("cada error de dominio trae su statusCode", () => {
  assert.equal(new PartidaNoEncontradaError().statusCode, 404);
  assert.equal(new PartidaLlenaError().statusCode, 409);
  assert.equal(new DatosInvalidosError("x").statusCode, 400);
});
