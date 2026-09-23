import { test } from "node:test";
import assert from "node:assert/strict";
import { ficharJugador } from "../src/services/fichajes.service.js";
import { obtenerEquipo } from "../src/repositorios/equipos.repositorio.js";

test("un fichaje valido mueve el presupuesto entre los dos equipos", () => {
  const resultado = ficharJugador("River", "Boca", 100);
  assert.equal(resultado.destino.presupuesto, 400);
  assert.equal(resultado.origen.presupuesto, 1100);
});

test("si el presupuesto queda negativo, la transaccion revierte todo", () => {
  const presupuestoRiverAntes = obtenerEquipo("River").presupuesto;
  const presupuestoBocaAntes = obtenerEquipo("Boca").presupuesto;

  assert.throws(() => ficharJugador("River", "Boca", 999999), /PRESUPUESTO_INSUFICIENTE/);

  assert.equal(obtenerEquipo("River").presupuesto, presupuestoRiverAntes);
  assert.equal(obtenerEquipo("Boca").presupuesto, presupuestoBocaAntes);
});
