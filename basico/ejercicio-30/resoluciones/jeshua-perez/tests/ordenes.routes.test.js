import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("flujo completo: crear, consultar, cerrar y volver a cerrar una orden", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/ordenes`;

  const creada = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moto: "Suzuki", falla: "cadena floja" }),
  });
  const { data } = await creada.json();
  assert.equal(creada.status, 201);

  const consultada = await fetch(`${base}/${data.id}`);
  assert.equal(consultada.status, 200);

  const cerrada = await fetch(`${base}/${data.id}/cerrar`, { method: "PATCH" });
  assert.equal(cerrada.status, 200);

  const segundoCierre = await fetch(`${base}/${data.id}/cerrar`, { method: "PATCH" });
  assert.equal(segundoCierre.status, 409);

  servidor.close();
});

test("POST /ordenes responde 400 si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moto: "Suzuki" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("GET /ordenes/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/ordenes/999999`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});
