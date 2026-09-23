import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /health responde con uptime", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/health`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.ok(cuerpo.uptimeSegundos >= 0);

  servidor.close();
});

test("cada peticion queda logueada como JSON estructurado", async () => {
  const lineas = [];
  const originalLog = console.log;
  console.log = (linea) => lineas.push(linea);

  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/health`);

  console.log = originalLog;
  servidor.close();

  const entrada = JSON.parse(lineas[0]);
  assert.equal(entrada.nivel, "info");
  assert.equal(entrada.mensaje, "peticion_http");
  assert.equal(entrada.ruta, "/health");
});
