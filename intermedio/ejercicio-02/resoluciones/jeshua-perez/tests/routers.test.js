import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /armas responde con la lista de armas", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/armas`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.ok(cuerpo.data.length > 0);

  servidor.close();
});

test("GET /jugadores responde con la lista de jugadores", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/jugadores`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.ok(cuerpo.data.length > 0);

  servidor.close();
});
