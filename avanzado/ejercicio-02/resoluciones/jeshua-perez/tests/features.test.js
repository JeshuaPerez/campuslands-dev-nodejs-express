import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("cada feature expone su propio CRUD sin depender de la otra", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const armas = await fetch(`http://localhost:${port}/armas`);
  const jugadores = await fetch(`http://localhost:${port}/jugadores`);

  assert.equal(armas.status, 200);
  assert.equal(jugadores.status, 200);

  servidor.close();
});

test("POST /armas responde 400 si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/armas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "AWP" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
