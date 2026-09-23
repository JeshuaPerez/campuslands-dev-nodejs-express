import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("viajero puede ver pero no crear reservas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const ver = await fetch(`http://localhost:${port}/reservas`, {
    headers: { Authorization: "Bearer token-viajero" },
  });
  assert.equal(ver.status, 200);

  const crear = await fetch(`http://localhost:${port}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-viajero" },
    body: JSON.stringify({ destino: "Cusco" }),
  });
  assert.equal(crear.status, 403);

  servidor.close();
});

test("agente puede crear pero no cancelar reservas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const crear = await fetch(`http://localhost:${port}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-agente" },
    body: JSON.stringify({ destino: "Cusco" }),
  });
  const { data } = await crear.json();
  assert.equal(crear.status, 201);

  const cancelar = await fetch(`http://localhost:${port}/reservas/${data.id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer token-agente" },
  });
  assert.equal(cancelar.status, 403);

  servidor.close();
});

test("admin puede cancelar una reserva", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const crear = await fetch(`http://localhost:${port}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-admin" },
    body: JSON.stringify({ destino: "Cartagena" }),
  });
  const { data } = await crear.json();

  const cancelar = await fetch(`http://localhost:${port}/reservas/${data.id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer token-admin" },
  });
  assert.equal(cancelar.status, 204);

  servidor.close();
});
