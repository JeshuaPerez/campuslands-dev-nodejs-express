import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("un alumno puede ver pero no crear saltos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const ver = await fetch(`http://localhost:${port}/saltos`, {
    headers: { Authorization: "Bearer token-alumno" },
  });
  assert.equal(ver.status, 200);

  const crear = await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-alumno" },
    body: JSON.stringify({ alumno: "Ana" }),
  });
  assert.equal(crear.status, 403);

  servidor.close();
});

test("un instructor (rol multiple) puede crear pero no eliminar saltos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const crear = await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-instructor" },
    body: JSON.stringify({ alumno: "Luis" }),
  });
  const { data } = await crear.json();
  assert.equal(crear.status, 201);

  const eliminar = await fetch(`http://localhost:${port}/saltos/${data.id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer token-instructor" },
  });
  assert.equal(eliminar.status, 403);

  servidor.close();
});

test("el jefe de salto (con los tres roles) puede eliminar un salto", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const crear = await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer token-jefe" },
    body: JSON.stringify({ alumno: "Marco" }),
  });
  const { data } = await crear.json();

  const eliminar = await fetch(`http://localhost:${port}/saltos/${data.id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer token-jefe" },
  });
  assert.equal(eliminar.status, 204);

  servidor.close();
});
