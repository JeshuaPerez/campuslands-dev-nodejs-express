import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("cada respuesta trae un X-Request-Id distinto", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const r1 = await fetch(`http://localhost:${port}/hiperdeportivos`);
  const r2 = await fetch(`http://localhost:${port}/hiperdeportivos`);

  const id1 = r1.headers.get("x-request-id");
  const id2 = r2.headers.get("x-request-id");

  assert.ok(id1);
  assert.ok(id2);
  assert.notEqual(id1, id2);

  servidor.close();
});

test("el body incluye el mismo requestId que el header", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/hiperdeportivos`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.requestId, respuesta.headers.get("x-request-id"));

  servidor.close();
});
