import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("v1 no incluye el campo nivel", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/api/v1/personajes`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.version, "v1");
  assert.equal(cuerpo.data[0].nivel, undefined);

  servidor.close();
});

test("v2 incluye el campo nivel sin romper v1", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/api/v2/personajes`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.version, "v2");
  assert.equal(cuerpo.data[0].nivel, 42);

  servidor.close();
});
