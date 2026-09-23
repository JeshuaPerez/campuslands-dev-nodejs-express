import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularViajeWarp, WarpError } from "../src/services/warp.service.js";

test("calcula el tiempo de viaje con un factor valido", () => {
  assert.equal(calcularViajeWarp(9, 9), 1);
});

test("lanza WarpError si el factor esta fuera de rango", () => {
  assert.throws(() => calcularViajeWarp(4, 15), WarpError);
});

test("lanza WarpError si el factor no es numero", () => {
  assert.throws(() => calcularViajeWarp(4, "rapido"), WarpError);
});
