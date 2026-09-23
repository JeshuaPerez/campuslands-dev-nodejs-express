import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("flujo completo: mecanico crea con schema valido, admin cierra", async () => {
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

  const segundoCierre = await fetch(`${base}/${data.id}/cerrar`, {
    method: "PATCH",
    headers: { Authorization: "Bearer token-admin" },
  });
  assert.equal(segundoCierre.status, 409);

  servidor.close();
});

test("POST /ordenes responde 400 si el schema no valida (falta falla)", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-mecanico" },
    body: JSON.stringify({ moto: "Yamaha" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("PATCH /ordenes/:id/cerrar responde 403 si el rol no es admin", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/ordenes`;

  const creada = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-mecanico" },
    body: JSON.stringify({ moto: "Suzuki", falla: "frenos" }),
  });
  const { data } = await creada.json();

  const cerrar = await fetch(`${base}/${data.id}/cerrar`, {
    method: "PATCH",
    headers: { Authorization: "Bearer token-mecanico" },
  });
  assert.equal(cerrar.status, 403);

  servidor.close();
});

test("GET /health responde 200 sin autenticacion", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/health`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});
