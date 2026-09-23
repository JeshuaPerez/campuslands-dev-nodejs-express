import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("el logger no interfiere con la respuesta y loguea la peticion", async () => {
  const lineas = [];
  const originalLog = console.log;
  console.log = (linea) => lineas.push(linea);

  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/partidas`);

  console.log = originalLog;
  servidor.close();

  assert.equal(respuesta.status, 200);
  assert.equal(lineas.length, 1);
  assert.match(lineas[0], /GET \/partidas -> 200/);
});
