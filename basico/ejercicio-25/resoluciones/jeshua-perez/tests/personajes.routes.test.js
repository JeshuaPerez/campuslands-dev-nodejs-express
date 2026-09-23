import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /personajes responde 200", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/personajes`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});

test("GET /personajes/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/personajes/999`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});

test("POST /personajes responde 201 al crear", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/personajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Legolas", clase: "Arquero" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("POST /personajes responde 409 si el nombre ya existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/personajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Aragorn", clase: "Guerrero" }),
  });

  assert.equal(respuesta.status, 409);

  servidor.close();
});
