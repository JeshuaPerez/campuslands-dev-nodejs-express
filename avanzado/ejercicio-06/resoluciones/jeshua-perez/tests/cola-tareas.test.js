import { test } from "node:test";
import assert from "node:assert/strict";
import { ColaTareas } from "../src/lib/cola-tareas.js";

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("procesa las tareas en el orden en que se encolaron", async () => {
  const cola = new ColaTareas();
  const orden = [];

  cola.encolar(async () => {
    await esperar(20);
    orden.push(1);
  });
  cola.encolar(async () => {
    orden.push(2);
  });

  await esperar(60);

  assert.deepEqual(orden, [1, 2]);
});

test("una tarea que falla no detiene la cola", async () => {
  const cola = new ColaTareas();

  cola.encolar(async () => {
    throw new Error("fallo simulado");
  });
  cola.encolar(async () => "tarea ok");

  await esperar(30);

  assert.equal(cola.completadas.length, 2);
  assert.equal(cola.completadas[0].estado, "error");
  assert.equal(cola.completadas[1].estado, "ok");
});
