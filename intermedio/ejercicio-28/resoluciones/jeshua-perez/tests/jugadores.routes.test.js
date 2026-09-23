import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("flujo completo: crear, consultar y eliminar un jugador", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/jugadores`;

  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Ninja" }),
  });
  const { data } = await creado.json();
  assert.equal(creado.status, 201);

  const eliminado = await fetch(`${base}/${data.id}/eliminar`, { method: "PATCH" });
  const cuerpo = await eliminado.json();
  assert.equal(cuerpo.data.vivo, false);

  servidor.close();
});

test("POST /jugadores responde 400 sin nombre", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/jugadores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("GET /jugadores/:id responde 404 si no existe", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/jugadores/999`);
  assert.equal(respuesta.status, 404);

  servidor.close();
});
