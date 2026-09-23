import { test } from "node:test";
import assert from "node:assert/strict";
import { Programador } from "../src/lib/programador.js";
import { marcarVencidas } from "../src/jobs/revisar-ordenes-vencidas.job.js";

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("corre la tarea repetidamente en el intervalo dado", async () => {
  const programador = new Programador(async () => {}, 15);
  programador.iniciar();

  await esperar(50);
  programador.detener();

  assert.ok(programador.ejecuciones >= 2);
});

test("no superpone ejecuciones si la anterior tarda mas que el intervalo", async () => {
  let corriendo = 0;
  let maximoSimultaneo = 0;

  const programador = new Programador(async () => {
    corriendo += 1;
    maximoSimultaneo = Math.max(maximoSimultaneo, corriendo);
    await esperar(30);
    corriendo -= 1;
  }, 10);

  programador.iniciar();
  await esperar(70);
  programador.detener();

  assert.equal(maximoSimultaneo, 1);
});

test("marcarVencidas solo marca las ordenes abiertas con mas de 7 dias", () => {
  const vencidas = marcarVencidas();
  assert.ok(vencidas.some((o) => o.pieza === "Viga"));
  assert.ok(!vencidas.some((o) => o.pieza === "Tuberia"));
});
