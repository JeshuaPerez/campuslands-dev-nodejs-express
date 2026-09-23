import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /ordenes responde 401 sin token", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ordenes`);
  assert.equal(respuesta.status, 401);

  servidor.close();
});

test("POST /ordenes responde 403 si el rol no es mecanico", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-admin" },
    body: JSON.stringify({ moto: "Yamaha", falla: "cadena" }),
  });

  assert.equal(respuesta.status, 403);

  servidor.close();
});

test("flujo completo: mecanico crea, admin cierra", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/ordenes`;

  const creada = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-mecanico" },
    body: JSON.stringify({ moto: "Yamaha", falla: "cadena" }),
  });
  const { data } = await creada.json();
  assert.equal(creada.status, 201);

  const cerrada = await fetch(`${base}/${data.id}/cerrar`, {
    method: "PATCH",
    headers: { Authorization: "Bearer token-admin" },
  });
  assert.equal(cerrada.status, 200);

  servidor.close();
});
