import { test } from "node:test";
import assert from "node:assert/strict";
import { CacheTTL } from "../src/lib/cache-ttl.js";
import { obtenerAuto, contarConsultasReales } from "../src/services/autos.service.js";

test("devuelve undefined si la clave no existe o ya expiro", async () => {
  const cache = new CacheTTL(10);
  assert.equal(cache.get("x"), undefined);

  cache.set("x", "valor");
  assert.equal(cache.get("x"), "valor");

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(cache.get("x"), undefined);
});

test("obtenerAuto solo consulta el catalogo real la primera vez", () => {
  const antes = contarConsultasReales();

  obtenerAuto(1);
  obtenerAuto(1);
  obtenerAuto(1);

  assert.equal(contarConsultasReales(), antes + 1);
});
