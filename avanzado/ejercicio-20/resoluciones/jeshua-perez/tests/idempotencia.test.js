import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("reenviar la misma Idempotency-Key no crea el recurso dos veces", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const opciones = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": "abc-123" },
    body: JSON.stringify({ titulo: "Paisaje" }),
  };

  const primera = await fetch(`http://localhost:${port}/ilustraciones`, opciones);
  const segunda = await fetch(`http://localhost:${port}/ilustraciones`, opciones);

  const cuerpo1 = await primera.json();
  const cuerpo2 = await segunda.json();

  assert.deepEqual(cuerpo1, cuerpo2);

  const listado = await fetch(`http://localhost:${port}/ilustraciones`);
  const { data } = await listado.json();
  assert.equal(data.length, 1);

  servidor.close();
});

test("sin Idempotency-Key, cada peticion crea un recurso nuevo", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const antes = (await (await fetch(`http://localhost:${port}/ilustraciones`)).json()).data.length;

  await fetch(`http://localhost:${port}/ilustraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Retrato" }),
  });
  await fetch(`http://localhost:${port}/ilustraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Retrato" }),
  });

  const listado = await fetch(`http://localhost:${port}/ilustraciones`);
  const { data } = await listado.json();
  assert.equal(data.length, antes + 2);

  servidor.close();
});
