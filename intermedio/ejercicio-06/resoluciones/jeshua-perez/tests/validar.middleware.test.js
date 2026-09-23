import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /reparaciones crea con datos validos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/reparaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moto: "Yamaha", costo: 150 }),
  });

  assert.equal(respuesta.status, 201);

  servidor.close();
});

test("POST /reparaciones responde 400 si falta un campo requerido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/reparaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moto: "Yamaha" }),
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 400);
  assert.match(cuerpo.message, /costo es obligatorio/);

  servidor.close();
});

test("POST /reparaciones responde 400 si el tipo es incorrecto", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/reparaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moto: "Yamaha", costo: "ciento cincuenta" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
