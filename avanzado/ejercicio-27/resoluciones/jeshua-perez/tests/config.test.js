import { test } from "node:test";
import assert from "node:assert/strict";
import { cargarConfig } from "../src/config/index.js";

test("development sobreescribe logNivel y maxPartidasSimultaneas de la base", () => {
  const config = cargarConfig({ NODE_ENV: "development" });
  assert.equal(config.logNivel, "debug");
  assert.equal(config.maxPartidasSimultaneas, 5);
  assert.equal(config.puerto, 3077);
});

test("production solo sobreescribe logNivel, el resto viene de la base", () => {
  const config = cargarConfig({ NODE_ENV: "production" });
  assert.equal(config.logNivel, "warn");
  assert.equal(config.maxPartidasSimultaneas, 100);
});

test("PORT en el entorno tiene prioridad sobre la config base", () => {
  const config = cargarConfig({ NODE_ENV: "production", PORT: "8080" });
  assert.equal(config.puerto, 8080);
});

test("un entorno desconocido usa la config base sin override", () => {
  const config = cargarConfig({ NODE_ENV: "staging" });
  assert.equal(config.logNivel, "info");
});
