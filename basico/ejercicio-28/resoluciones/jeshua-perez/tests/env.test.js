import { test } from "node:test";
import assert from "node:assert/strict";
import { cargarConfig } from "../src/config/env.js";

test("usa valores por defecto si no hay variables de entorno", () => {
  const config = cargarConfig({});
  assert.equal(config.entorno, "development");
  assert.equal(config.puerto, 3018);
  assert.equal(config.maxJugadores, 100);
});

test("respeta las variables de entorno definidas", () => {
  const config = cargarConfig({ NODE_ENV: "production", PORT: "4000", MAX_JUGADORES: "60" });
  assert.equal(config.entorno, "production");
  assert.equal(config.puerto, 4000);
  assert.equal(config.maxJugadores, 60);
});

test("lanza si PORT no es un numero valido", () => {
  assert.throws(() => cargarConfig({ PORT: "no-numero" }));
});
