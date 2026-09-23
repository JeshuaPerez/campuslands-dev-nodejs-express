import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /peliculas/exportar trae Content-Disposition de descarga", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/peliculas/exportar`);
  const disposicion = respuesta.headers.get("content-disposition");

  assert.equal(respuesta.status, 200);
  assert.match(disposicion, /attachment; filename=peliculas-de-miedo\.json/);

  servidor.close();
});

test("el contenido exportado es un JSON valido con las peliculas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/peliculas/exportar`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.length, 2);
  assert.equal(cuerpo[0].titulo, "It");

  servidor.close();
});
