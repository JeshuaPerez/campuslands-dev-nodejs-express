import { test } from "node:test";
import assert from "node:assert/strict";
import { crearServidor } from "../src/server.js";

test("GET /platillos responde 200 con la lista", async () => {
  const servidor = crearServidor().listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/platillos`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.ok, true);
  assert.ok(cuerpo.data.length > 0);

  servidor.close();
});

test("una ruta desconocida responde 404", async () => {
  const servidor = crearServidor().listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/no-existe`);

  assert.equal(respuesta.status, 404);

  servidor.close();
});
