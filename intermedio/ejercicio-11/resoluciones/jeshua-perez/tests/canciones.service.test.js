import { test } from "node:test";
import assert from "node:assert/strict";
import { buscarCanciones } from "../src/services/canciones.service.js";

test("sin termino devuelve todas las canciones", () => {
  assert.equal(buscarCanciones().length, 3);
});

test("busca por titulo sin importar mayusculas", () => {
  const resultado = buscarCanciones("imagine");
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "Imagine");
});

test("busca por artista", () => {
  const resultado = buscarCanciones("beatles");
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].titulo, "Yesterday");
});

test("devuelve vacio si no hay coincidencias", () => {
  assert.equal(buscarCanciones("no existe").length, 0);
});
