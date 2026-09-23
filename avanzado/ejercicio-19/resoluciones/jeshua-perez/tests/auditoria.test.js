import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("crear un diseno queda registrado en la auditoria con el usuario", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  await fetch(`http://localhost:${port}/disenos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Usuario": "Ana" },
    body: JSON.stringify({ nombre: "Golondrina" }),
  });

  await esperar(20);

  const auditoria = await fetch(`http://localhost:${port}/auditoria`);
  const { data } = await auditoria.json();

  assert.ok(data.some((registro) => registro.usuario === "Ana" && registro.accion === "crear_diseno"));

  servidor.close();
});

test("un intento fallido (400) no se registra en la auditoria", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const antes = (await (await fetch(`http://localhost:${port}/auditoria`)).json()).data.length;

  await fetch(`http://localhost:${port}/disenos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  await esperar(20);

  const despues = (await (await fetch(`http://localhost:${port}/auditoria`)).json()).data.length;
  assert.equal(despues, antes);

  servidor.close();
});
