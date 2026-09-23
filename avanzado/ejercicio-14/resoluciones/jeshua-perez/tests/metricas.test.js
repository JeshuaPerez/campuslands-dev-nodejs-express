import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { metricas } from "../src/lib/metricas.js";

test("GET /metrics refleja las peticiones hechas antes", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/libros`);
  await fetch(`http://localhost:${port}/libros/999`);

  const respuesta = await fetch(`http://localhost:${port}/metrics`);
  const cuerpo = await respuesta.json();

  assert.ok(cuerpo.data.totalPeticiones >= 2);
  assert.ok(cuerpo.data.porRuta["GET /libros 200"] >= 1);
  assert.ok(cuerpo.data.porRuta["GET /libros/:id 404"] >= 1);

  servidor.close();
});

test("registrar acumula el contador de la misma clave", () => {
  const antes = metricas.resumen().totalPeticiones;
  metricas.registrar("GET", "/x", 200);
  metricas.registrar("GET", "/x", 200);

  assert.equal(metricas.resumen().totalPeticiones, antes + 2);
  assert.equal(metricas.resumen().porRuta["GET /x 200"], 2);
});
