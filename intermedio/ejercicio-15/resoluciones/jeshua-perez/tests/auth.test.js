import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /auth/login responde 401 con credenciales invalidas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: "foodie", clave: "mal" }),
  });

  assert.equal(respuesta.status, 401);

  servidor.close();
});

test("flujo completo: login y acceso a ruta protegida con el JWT", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const login = await fetch(`http://localhost:${port}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: "foodie", clave: "tacos123" }),
  });
  const { token } = await login.json();
  assert.ok(token);

  const pedidos = await fetch(`http://localhost:${port}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(pedidos.status, 200);

  servidor.close();
});

test("GET /pedidos responde 403 con un token invalido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/pedidos`, {
    headers: { Authorization: "Bearer token-falso" },
  });

  assert.equal(respuesta.status, 403);

  servidor.close();
});
