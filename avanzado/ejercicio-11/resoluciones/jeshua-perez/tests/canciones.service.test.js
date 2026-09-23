import { test } from "node:test";
import assert from "node:assert/strict";
import { importarCanciones } from "../src/services/canciones.service.js";

test("importa las filas validas y reporta las invalidas por separado", () => {
  const resultado = importarCanciones([
    { titulo: "Yesterday", artista: "The Beatles" },
    { titulo: "Sin artista" },
    { titulo: "Imagine", artista: "John Lennon" },
  ]);

  assert.equal(resultado.importadas.length, 2);
  assert.equal(resultado.errores.length, 1);
  assert.equal(resultado.errores[0].fila, 1);
});

test("un lote sin errores no reporta ninguno", () => {
  const resultado = importarCanciones([{ titulo: "Hey Jude", artista: "The Beatles" }]);
  assert.equal(resultado.errores.length, 0);
});
