import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("CRUD completo de formulas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/formulas`;

  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Sal", simbolo: "NaCl" }),
  });
  const { data: creada } = await creado.json();
  assert.equal(creado.status, 201);

  const obtenido = await fetch(`${base}/${creada.id}`);
  assert.equal(obtenido.status, 200);

  const actualizado = await fetch(`${base}/${creada.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Sal comun", simbolo: "NaCl" }),
  });
  const { data: actualizada } = await actualizado.json();
  assert.equal(actualizada.nombre, "Sal comun");

  const eliminado = await fetch(`${base}/${creada.id}`, { method: "DELETE" });
  assert.equal(eliminado.status, 204);

  const noEncontrado = await fetch(`${base}/${creada.id}`);
  assert.equal(noEncontrado.status, 404);

  servidor.close();
});

test("POST /formulas responde 400 si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/formulas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Sal" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
