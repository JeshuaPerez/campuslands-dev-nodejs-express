import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /peliculas/:id/resenas crea una resena valida", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/peliculas/1/resenas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ autor: "Ana", comentario: "Muy tensa" }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("GET /peliculas/:id/resenas responde 404 si la pelicula no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/peliculas/999/resenas`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});

test("GET /peliculas/:id/resenas solo devuelve las resenas de esa pelicula", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/peliculas/2/resenas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ autor: "Luis", comentario: "Clasico" }),
  });

  const respuesta = await fetch(`http://localhost:${port}/peliculas/1/resenas`);
  const cuerpo = await respuesta.json();

  assert.ok(cuerpo.data.every((r) => r.peliculaId === 1));

  servidor.close();
});
