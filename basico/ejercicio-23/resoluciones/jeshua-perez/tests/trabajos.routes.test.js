import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /trabajos crea y GET /trabajos lo lista", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/trabajos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pieza: "Viga", tipoSoldadura: "MIG" }),
  });

  const respuesta = await fetch(`http://localhost:${port}/trabajos`);
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.length, 1);

  servidor.close();
});

test("DELETE /trabajos/:id elimina el trabajo", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const creado = await fetch(`http://localhost:${port}/trabajos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pieza: "Tuberia", tipoSoldadura: "TIG" }),
  });
  const { data } = await creado.json();

  const respuesta = await fetch(`http://localhost:${port}/trabajos/${data.id}`, {
    method: "DELETE",
  });

  assert.equal(respuesta.status, 204);

  servidor.close();
});

test("DELETE /trabajos/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/trabajos/999`, {
    method: "DELETE",
  });

  assert.equal(respuesta.status, 404);

  servidor.close();
});
