import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("el test importa solo app.js y elige su propio puerto efimero", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  assert.notEqual(port, 3078);

  const respuesta = await fetch(`http://localhost:${port}/zonas`);
  assert.equal(respuesta.status, 200);

  servidor.close();
});

test("app.js no tiene ninguna llamada a listen (server.js es quien la hace)", async () => {
  const codigoFuente = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("../src/app.js", import.meta.url), "utf-8")
  );

  assert.doesNotMatch(codigoFuente, /app\.listen/);
});
