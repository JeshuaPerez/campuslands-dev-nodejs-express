import { test } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { CsvAPeleasStream } from "../src/streams/csv-a-peleas.stream.js";

test("convierte cada linea CSV en un objeto", async () => {
  const csv = "Buakaw,52,gano\nSaenchai,48,perdio\n";
  const origen = Readable.from([csv]);
  const transform = new CsvAPeleasStream();

  const resultados = [];
  for await (const pelea of origen.pipe(transform)) {
    resultados.push(pelea);
  }

  assert.equal(resultados.length, 2);
  assert.deepEqual(resultados[0], { nombre: "Buakaw", golpes: 52, resultado: "gano" });
});

test("procesa la ultima linea aunque no termine en salto de linea", async () => {
  const csv = "Buakaw,52,gano";
  const origen = Readable.from([csv]);
  const transform = new CsvAPeleasStream();

  const resultados = [];
  for await (const pelea of origen.pipe(transform)) {
    resultados.push(pelea);
  }

  assert.equal(resultados.length, 1);
});
