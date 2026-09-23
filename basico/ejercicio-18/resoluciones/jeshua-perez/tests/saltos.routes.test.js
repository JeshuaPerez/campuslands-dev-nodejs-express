import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /saltos crea un salto valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paracaidista: "Ana", altitudMetros: 4000 }),
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 201);
  assert.equal(cuerpo.data.paracaidista, "Ana");

  servidor.close();
});

test("POST /saltos responde 400 si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paracaidista: "" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("GET /saltos devuelve los saltos creados", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/saltos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paracaidista: "Luis", altitudMetros: 3500 }),
  });

  const respuesta = await fetch(`http://localhost:${port}/saltos`);
  const cuerpo = await respuesta.json();

  assert.ok(cuerpo.data.some((s) => s.paracaidista === "Luis"));

  servidor.close();
});
