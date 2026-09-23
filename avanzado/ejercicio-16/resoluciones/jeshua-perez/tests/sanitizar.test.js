import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizarTexto } from "../src/lib/sanitizar.js";
import { app } from "../src/app.js";

test("sanitizarTexto quita tags HTML/script", () => {
  const resultado = sanitizarTexto('<script>alert("x")</script>Air Force 1');
  assert.equal(resultado, 'alert("x")Air Force 1');
});

test("POST /sneakers guarda el modelo ya sanitizado", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/sneakers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelo: "<b>Superstar</b>" }),
  });
  const cuerpo = await respuesta.json();

  assert.equal(cuerpo.data.modelo, "Superstar");

  servidor.close();
});
