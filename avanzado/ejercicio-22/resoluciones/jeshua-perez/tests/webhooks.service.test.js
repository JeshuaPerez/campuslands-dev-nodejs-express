import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { suscribir, dispararEvento } from "../src/services/webhooks.service.js";

test("suscribir valida url y evento", () => {
  assert.throws(() => suscribir({ url: "http://x" }));
});

test("dispara el evento solo a los suscriptores de ese evento", async () => {
  const recibidos = [];
  const receptor = http.createServer((req, res) => {
    let cuerpo = "";
    req.on("data", (chunk) => (cuerpo += chunk));
    req.on("end", () => {
      recibidos.push(JSON.parse(cuerpo));
      res.writeHead(200);
      res.end();
    });
  });
  await new Promise((resolve) => receptor.listen(0, resolve));
  const { port } = receptor.address();

  suscribir({ url: `http://localhost:${port}/webhook`, evento: "render.completado" });
  suscribir({ url: `http://localhost:${port}/webhook`, evento: "otro.evento" });

  const resultados = await dispararEvento("render.completado", { id: 1 });

  assert.equal(resultados.length, 1);
  assert.equal(resultados[0].ok, true);
  assert.equal(recibidos.length, 1);
  assert.deepEqual(recibidos[0], { id: 1 });

  receptor.close();
});

test("un suscriptor caido no detiene el envio a los demas", async () => {
  suscribir({ url: "http://localhost:1/no-existe", evento: "fallo.test" });

  const resultados = await dispararEvento("fallo.test", {});

  assert.equal(resultados.length, 1);
  assert.equal(resultados[0].ok, false);
});
