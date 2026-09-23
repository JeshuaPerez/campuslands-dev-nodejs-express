import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /sneakers responde 401 sin token", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/sneakers`);
  assert.equal(respuesta.status, 401);

  servidor.close();
});

test("POST /sneakers responde 403 si el usuario no es admin", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/sneakers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-cliente" },
    body: JSON.stringify({ modelo: "Superstar" }),
  });

  assert.equal(respuesta.status, 403);

  servidor.close();
});

test("POST /sneakers crea el sneaker si el usuario es admin", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/sneakers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-admin" },
    body: JSON.stringify({ modelo: "Superstar" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});
