import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("flujo completo: login, refresh y logout revoca el refresh token", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();
  const base = `http://localhost:${port}/auth`;

  const login = await fetch(`${base}/login`, { method: "POST" });
  const { accessToken, refreshToken } = await login.json();
  assert.ok(accessToken);
  assert.ok(refreshToken);

  const refrescado = await fetch(`${base}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  assert.equal(refrescado.status, 200);

  await fetch(`${base}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const despuesDeLogout = await fetch(`${base}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  assert.equal(despuesDeLogout.status, 401);

  servidor.close();
});

test("POST /auth/refresh responde 401 con un refresh token inventado", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: "no-existe" }),
  });

  assert.equal(respuesta.status, 401);

  servidor.close();
});
