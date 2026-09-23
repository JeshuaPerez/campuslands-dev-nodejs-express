import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { marcarListo, marcarNoListo, inicializarDependencias } from "../src/services/estado.service.js";

test("GET /health responde 200 aunque el servicio no este listo todavia", async () => {
  marcarNoListo();

  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/health`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});

test("GET /ready responde 503 antes de inicializar y 200 despues", async () => {
  marcarNoListo();

  const servidor = app.listen(0);
  const { port } = servidor.address();

  const antes = await fetch(`http://localhost:${port}/ready`);
  assert.equal(antes.status, 503);

  await inicializarDependencias();

  const despues = await fetch(`http://localhost:${port}/ready`);
  assert.equal(despues.status, 200);

  servidor.close();
});

test("marcarNoListo hace que /ready vuelva a fallar (simula apagado)", async () => {
  marcarListo();

  const servidor = app.listen(0);
  const { port } = servidor.address();

  marcarNoListo();

  const respuesta = await fetch(`http://localhost:${port}/ready`);
  assert.equal(respuesta.status, 503);

  servidor.close();
});
