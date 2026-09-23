import { test } from "node:test";
import assert from "node:assert/strict";
import { cargarConfig } from "../src/config/index.js";

test("usa valores por defecto sin variables de entorno", () => {
  const config = cargarConfig({});
  assert.equal(config.puerto, 3039);
  assert.equal(config.entorno, "development");
  assert.equal(config.nombreEstudio, "Estudio sin nombre");
});

test("respeta las variables de entorno definidas", () => {
  const config = cargarConfig({ PORT: "4000", NODE_ENV: "production", NOMBRE_ESTUDIO: "Tinta Negra" });
  assert.equal(config.puerto, 4000);
  assert.equal(config.nombreEstudio, "Tinta Negra");
});

test("lanza si PORT no es un numero valido", () => {
  assert.throws(() => cargarConfig({ PORT: "no-numero" }));
});
