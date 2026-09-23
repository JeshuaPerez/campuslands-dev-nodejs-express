import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

let servidor;
let base;

before(() => {
  servidor = app.listen(0);
  base = `http://localhost:${servidor.address().port}/inventario`;
});

after(() => {
  servidor.close();
});

test("GET /inventario arranca vacio", async () => {
  const respuesta = await fetch(base);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.deepEqual(cuerpo.data, []);
});

test("POST /inventario responde 400 si faltan datos", async () => {
  const respuesta = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objeto: "Espada" }),
  });

  assert.equal(respuesta.status, 400);
});

test("POST /inventario crea el objeto y GET lo lista", async () => {
  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objeto: "Espada", rareza: "legendaria" }),
  });
  assert.equal(creado.status, 201);

  const lista = await fetch(base);
  const { data } = await lista.json();
  assert.equal(data.length, 1);
});

test("DELETE /inventario/:id elimina el objeto", async () => {
  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objeto: "Escudo", rareza: "comun" }),
  });
  const { data } = await creado.json();

  const eliminado = await fetch(`${base}/${data.id}`, { method: "DELETE" });
  assert.equal(eliminado.status, 204);
});

test("DELETE /inventario/:id responde 404 si no existe", async () => {
  const respuesta = await fetch(`${base}/999999`, { method: "DELETE" });
  assert.equal(respuesta.status, 404);
});
