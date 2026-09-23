import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { notificacionesEnviadas } from "../src/events/listeners.js";

test("vender un auto dispara el evento y el listener de notificaciones", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const antes = notificacionesEnviadas.length;

  const respuesta = await fetch(`http://localhost:${port}/autos/1/vender`, { method: "PATCH" });
  assert.equal(respuesta.status, 200);

  assert.equal(notificacionesEnviadas.length, antes + 1);
  assert.match(notificacionesEnviadas.at(-1), /Bugatti Chiron/);

  servidor.close();
});

test("vender el mismo auto dos veces responde 409 la segunda vez", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/autos/1/vender`, { method: "PATCH" });
  assert.equal(respuesta.status, 409);

  servidor.close();
});
