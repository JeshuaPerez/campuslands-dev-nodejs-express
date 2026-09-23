import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /docs describe todos los endpoints reales de la API", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/docs`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.endpoints.length, 2);
  assert.ok(cuerpo.endpoints.some((e) => e.metodo === "GET" && e.ruta === "/torneos"));
  assert.ok(cuerpo.endpoints.some((e) => e.metodo === "POST" && e.ruta === "/torneos"));

  servidor.close();
});
