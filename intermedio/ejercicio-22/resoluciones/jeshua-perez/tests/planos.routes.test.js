import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("POST /planos sube un archivo permitido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const formData = new FormData();
  formData.append("plano", new Blob(["contenido falso"], { type: "application/pdf" }), "plano.pdf");

  const respuesta = await fetch(`http://localhost:${port}/planos`, {
    method: "POST",
    body: formData,
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 201);
  assert.equal(cuerpo.data.nombre, "plano.pdf");

  servidor.close();
});

test("POST /planos rechaza un tipo de archivo no permitido", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const formData = new FormData();
  formData.append("plano", new Blob(["contenido"], { type: "text/plain" }), "notas.txt");

  const respuesta = await fetch(`http://localhost:${port}/planos`, {
    method: "POST",
    body: formData,
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});

test("POST /planos responde 400 si no llega archivo", async () => {
  const servidor = app.listen(0);
  const { port } = servidor.address();

  const respuesta = await fetch(`http://localhost:${port}/planos`, {
    method: "POST",
    body: new FormData(),
  });

  assert.equal(respuesta.status, 400);

  servidor.close();
});
