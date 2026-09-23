import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /ilustraciones crea con un body JSON valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Paisaje", software: "Procreate" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("POST /ilustraciones responde 400 con JSON malformado", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{titulo: mal formado",
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 400);
  assert.match(cuerpo.message, /JSON invalido/);

  servidor.close();
});

test("POST /ilustraciones responde 400 si faltan campos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ilustraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Paisaje" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
