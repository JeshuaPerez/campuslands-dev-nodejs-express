import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("una peticion sin Origin (curl) funciona normal", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});

test("un origen permitido recibe el header Access-Control-Allow-Origin", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`, {
    headers: { Origin: "http://localhost:5173" },
  });

  assert.equal(respuesta.headers.get("access-control-allow-origin"), "http://localhost:5173");

  servidor.close();
});

test("un origen no permitido responde 403", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`, {
    headers: { Origin: "http://sitio-no-permitido.com" },
  });

  assert.equal(respuesta.status, 403);

  servidor.close();
});
