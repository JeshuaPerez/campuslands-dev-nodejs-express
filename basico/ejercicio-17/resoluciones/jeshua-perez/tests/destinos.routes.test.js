import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /destinos responde con la lista completa", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/destinos`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.data.length, 3);

  servidor.close();
});

test("GET /destinos?pais=Peru filtra por pais", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/destinos?pais=Peru`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.length, 1);
  assert.equal(cuerpo.data[0].nombre, "Cusco");

  servidor.close();
});

test("GET /destinos/:id devuelve 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/destinos/999`);

  assert.equal(respuesta.status, 404);

  servidor.close();
});
