import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /estudios/:id/disenos devuelve todos los disenos del estudio", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/estudios/1/disenos`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.data.length, 2);

  servidor.close();
});

test("GET /estudios/:id/disenos filtra por ?estilo=", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/estudios/1/disenos?estilo=realismo`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.length, 1);
  assert.equal(cuerpo.data[0].nombre, "Retrato");

  servidor.close();
});

test("GET /estudios/:id/disenos devuelve 404 si el estudio no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/estudios/999/disenos`);

  assert.equal(respuesta.status, 404);

  servidor.close();
});
