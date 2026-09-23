import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { rateLimit } from "../src/middlewares/rate-limit.middleware.js";

function crearApp() {
  const app = express();
  app.use(rateLimit({ maxPeticiones: 2, ventanaMs: 60000 }));
  app.get("/", (req, res) => res.json({ ok: true }));
  return app;
}

test("permite hasta el limite y luego responde 429", async () => {
  const servidor = crearApp().listen(0);
  const { port } = servidor.address();

  const r1 = await fetch(`http://localhost:${port}/`);
  const r2 = await fetch(`http://localhost:${port}/`);
  const r3 = await fetch(`http://localhost:${port}/`);

  assert.equal(r1.status, 200);
  assert.equal(r2.status, 200);
  assert.equal(r3.status, 429);

  servidor.close();
});
