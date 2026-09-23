import { test } from "node:test";
import assert from "node:assert/strict";
import { estimarCosto } from "../src/services/proyectos.service.js";

test("estimarCosto calcula el costo por metro cuadrado", () => {
  const resultado = estimarCosto({ nombre: "Casa moderna", metrosCuadrados: 100 });
  assert.equal(resultado.costoEstimado, 85000);
});

test("estimarCosto lanza si falta el nombre", () => {
  assert.throws(() => estimarCosto({ metrosCuadrados: 100 }));
});

test("estimarCosto lanza si los metros no son validos", () => {
  assert.throws(() => estimarCosto({ nombre: "Casa", metrosCuadrados: -5 }));
});
