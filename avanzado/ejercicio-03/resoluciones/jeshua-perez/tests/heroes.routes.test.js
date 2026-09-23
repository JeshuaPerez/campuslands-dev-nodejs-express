import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /heroes crea con datos validos y aplica el default de nivel", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Axe", rol: "tanque" }),
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 201);
  assert.equal(cuerpo.data.nivel, 1);

  servidor.close();
});

test("POST /heroes responde 400 si el rol no es valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Axe", rol: "granjero" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("POST /heroes responde 400 si el nivel esta fuera de rango", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/heroes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Axe", rol: "tanque", nivel: 999 }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
