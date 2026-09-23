import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /openapi.json describe las rutas reales de /formulas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/openapi.json`);
  const spec = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.ok(spec.paths["/formulas"].get);
  assert.ok(spec.paths["/formulas"].post);

  servidor.close();
});

test("el schema Formula coincide con lo que devuelve la API real", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/formulas`);
  const { data } = await respuesta.json();

  const specResp = await fetch(`http://localhost:${port}/openapi.json`);
  const spec = await specResp.json();
  const propiedades = Object.keys(spec.components.schemas.Formula.properties);

  assert.deepEqual(Object.keys(data[0]).sort(), propiedades.sort());

  servidor.close();
});
