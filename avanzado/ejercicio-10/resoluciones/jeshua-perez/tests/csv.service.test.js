import { test } from "node:test";
import assert from "node:assert/strict";
import { parsearCsv, leerResultados } from "../src/services/csv.service.js";

test("parsearCsv convierte filas a objetos usando el encabezado", () => {
  const resultado = parsearCsv("a,b\n1,2\n3,4");
  assert.deepEqual(resultado, [
    { a: "1", b: "2" },
    { a: "3", b: "4" },
  ]);
});

test("parsearCsv ignora lineas vacias", () => {
  const resultado = parsearCsv("a,b\n1,2\n\n3,4\n");
  assert.equal(resultado.length, 2);
});

test("leerResultados lee y parsea el archivo real de datos", async () => {
  const resultados = await leerResultados(new URL("../datos/resultados.csv", import.meta.url));
  assert.equal(resultados.length, 3);
  assert.equal(resultados[0].jugador, "Ma Long");
});
