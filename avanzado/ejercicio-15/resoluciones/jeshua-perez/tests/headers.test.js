import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("helmet agrega X-Content-Type-Options y X-Frame-Options", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/platillos`);

  assert.equal(respuesta.headers.get("x-content-type-options"), "nosniff");
  assert.equal(respuesta.headers.get("x-frame-options"), "SAMEORIGIN");

  servidor.close();
});

test("no expone el header X-Powered-By", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/platillos`);

  assert.equal(respuesta.headers.get("x-powered-by"), null);

  servidor.close();
});
