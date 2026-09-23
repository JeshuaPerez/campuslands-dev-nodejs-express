import { test } from "node:test";
import assert from "node:assert/strict";
import { Semaforo } from "../src/lib/semaforo.js";

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("nunca deja mas de N tareas corriendo al mismo tiempo", async () => {
  const semaforo = new Semaforo(2);
  let enCurso = 0;
  let maximoObservado = 0;

  const tarea = async () => {
    enCurso += 1;
    maximoObservado = Math.max(maximoObservado, enCurso);
    await esperar(20);
    enCurso -= 1;
  };

  await Promise.all([
    semaforo.ejecutar(tarea),
    semaforo.ejecutar(tarea),
    semaforo.ejecutar(tarea),
    semaforo.ejecutar(tarea),
  ]);

  assert.equal(maximoObservado, 2);
});

test("libera el lugar aunque la tarea lance un error", async () => {
  const semaforo = new Semaforo(1);

  await assert.rejects(() =>
    semaforo.ejecutar(async () => {
      throw new Error("fallo");
    })
  );

  const resultado = await semaforo.ejecutar(async () => "ok");
  assert.equal(resultado, "ok");
});
