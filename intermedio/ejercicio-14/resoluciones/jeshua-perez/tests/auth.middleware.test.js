import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /libros responde 401 sin header Authorization", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "1984" }),
  });

  assert.equal(respuesta.status, 401);

  servidor.close();
});

test("POST /libros responde 403 con token invalido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-falso" },
    body: JSON.stringify({ titulo: "1984" }),
  });

  assert.equal(respuesta.status, 403);

  servidor.close();
});

test("POST /libros crea el libro con token valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-biblioteca-123" },
    body: JSON.stringify({ titulo: "1984" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});
