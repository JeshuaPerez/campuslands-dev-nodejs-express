import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /heroes responde 200", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});

test("POST /heroes crea un heroe valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Axe", rol: "tanque" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("GET /heroes/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes/999999`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});
