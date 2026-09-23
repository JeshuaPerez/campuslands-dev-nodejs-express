import { test } from "node:test";
import assert from "node:assert/strict";
import { listarPeleadores } from "../src/services/peleadores.service.js";

test("pagina con el limit por defecto", () => {
  const resultado = listarPeleadores({});
  assert.equal(resultado.data.length, 10);
  assert.equal(resultado.total, 25);
  assert.equal(resultado.totalPages, 3);
});

test("respeta page y limit personalizados", () => {
  const resultado = listarPeleadores({ page: 2, limit: 5 });
  assert.equal(resultado.data.length, 5);
  assert.equal(resultado.data[0].id, 6);
});

test("filtra por categoria antes de paginar", () => {
  const resultado = listarPeleadores({ categoria: "pesado", limit: 100 });
  assert.ok(resultado.data.every((p) => p.categoria === "pesado"));
});
