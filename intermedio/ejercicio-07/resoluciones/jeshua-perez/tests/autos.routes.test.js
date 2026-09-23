import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("GET /autos/:id responde 404 via HttpError", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/autos/999`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 404);
  assert.equal(cuerpo.message, "Auto no encontrado");

  servidor.close();
});

test("POST /autos responde 400 via HttpError si faltan datos", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/autos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marca: "Ferrari" }),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("POST /autos responde 400 con JSON malformado", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/autos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{marca: mal formado",
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
