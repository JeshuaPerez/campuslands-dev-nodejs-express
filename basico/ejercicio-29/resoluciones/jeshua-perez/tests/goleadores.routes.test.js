import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /goleadores?modalidad=futbol filtra por modalidad", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/goleadores?modalidad=futbol`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.length, 1);
  assert.equal(cuerpo.data[0].nombre, "Marta");

  servidor.close();
});

test("PATCH /goleadores/:id/gol suma un gol", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/goleadores/2/gol`, { method: "PATCH" });
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.goles, 13);

  servidor.close();
});

test("PATCH /goleadores/:id/gol responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/goleadores/999/gol`, { method: "PATCH" });

  assert.equal(respuesta.status, 404);

  servidor.close();
});
