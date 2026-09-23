import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /modelos crea un modelo 3D valido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/modelos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Dragon", software: "Blender" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("POST /modelos responde 400 si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/modelos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Dragon" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("GET /modelos lista los modelos creados", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/modelos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Robot", software: "Maya" }),
  });

  const respuesta = await fetch(`http://localhost:${port}/modelos`);
  const cuerpo = await respuesta.json();

  assert.ok(cuerpo.data.some((m) => m.nombre === "Robot"));

  servidor.close();
});
