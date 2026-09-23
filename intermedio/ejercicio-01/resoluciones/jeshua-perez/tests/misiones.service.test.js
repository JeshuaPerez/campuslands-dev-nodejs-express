import { test } from "node:test";
import assert from "node:assert/strict";
import { crearMision, completarMision } from "../src/services/misiones.service.js";

test("crearMision valida titulo y recompensa", () => {
  assert.throws(() => crearMision({ titulo: "", recompensaOro: 100 }));
  assert.throws(() => crearMision({ titulo: "Cazar dragon", recompensaOro: -5 }));
});

test("crearMision crea una mision disponible", () => {
  const mision = crearMision({ titulo: "Cazar dragon", recompensaOro: 500 });
  assert.equal(mision.estado, "disponible");
});

test("completarMision cambia el estado y falla si ya estaba completada", () => {
  const mision = crearMision({ titulo: "Rescatar aldea", recompensaOro: 200 });
  completarMision(mision.id);
  assert.throws(() => completarMision(mision.id), /MISION_YA_COMPLETADA/);
});

test("completarMision lanza si el id no existe", () => {
  assert.throws(() => completarMision(999999), /MISION_NO_ENCONTRADA/);
});
