import { test } from "node:test";
import assert from "node:assert/strict";
import { registrar, verificarClave } from "../src/services/paracaidistas.service.js";

test("registrar nunca guarda la clave en texto plano", async () => {
  await registrar({ nombre: "Ana", clave: "secreta123" });
  const valido = await verificarClave("Ana", "secreta123");
  assert.equal(valido, true);
});

test("verificarClave rechaza una clave incorrecta", async () => {
  await registrar({ nombre: "Luis", clave: "correcta" });
  const valido = await verificarClave("Luis", "incorrecta");
  assert.equal(valido, false);
});

test("registrar lanza si el nombre ya existe", async () => {
  await registrar({ nombre: "Marco", clave: "123456" });
  await assert.rejects(() => registrar({ nombre: "Marco", clave: "otra" }), /YA_REGISTRADO/);
});
