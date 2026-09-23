import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /partidas responde 201 y PATCH finalizar responde 200", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/partidas`;

  const creada = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mapa: "Dust" }),
  });
  const { data } = await creada.json();
  assert.equal(creada.status, 201);

  const finalizada = await fetch(`${base}/${data.id}/finalizar`, { method: "PATCH" });
  assert.equal(finalizada.status, 200);

  servidor.close();
});

test("PATCH finalizar responde 409 si ya estaba finalizada", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/partidas`;

  const creada = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mapa: "Mirage" }),
  });
  const { data } = await creada.json();

  await fetch(`${base}/${data.id}/finalizar`, { method: "PATCH" });
  const segundaVez = await fetch(`${base}/${data.id}/finalizar`, { method: "PATCH" });

  assert.equal(segundaVez.status, 409);

  servidor.close();
});

test("GET /partidas/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/partidas/999`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});
