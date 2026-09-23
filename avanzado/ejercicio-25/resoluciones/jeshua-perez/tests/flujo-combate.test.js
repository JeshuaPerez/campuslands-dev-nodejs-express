import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

/**
 * Test de integracion: recorre routes -> controller -> service en
 * secuencia, como lo haria un cliente real (crear, equipar, atacar),
 * en vez de probar cada capa por separado.
 */
test("flujo completo: crear personaje, equipar arma y atacar con el dano correcto", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/personajes`;

  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Aragorn" }),
  });
  const { data: personaje } = await creado.json();
  assert.equal(personaje.poderAtaque, 5);

  const ataqueSinArma = await fetch(`${base}/${personaje.id}/atacar`, { method: "POST" });
  const { data: dano1 } = await ataqueSinArma.json();
  assert.equal(dano1.dano, 5);

  await fetch(`${base}/${personaje.id}/equipar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ arma: "martillo" }),
  });

  const ataqueConArma = await fetch(`${base}/${personaje.id}/atacar`, { method: "POST" });
  const { data: dano2 } = await ataqueConArma.json();
  assert.equal(dano2.dano, 25);

  servidor.close();
});

test("equipar un arma desconocida responde 400 y no cambia el poder de ataque", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/personajes`;

  const creado = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Legolas" }),
  });
  const { data: personaje } = await creado.json();

  const equipar = await fetch(`${base}/${personaje.id}/equipar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ arma: "raqueta" }),
  });
  assert.equal(equipar.status, 400);

  const ataque = await fetch(`${base}/${personaje.id}/atacar`, { method: "POST" });
  const { data } = await ataque.json();
  assert.equal(data.dano, 5);

  servidor.close();
});
