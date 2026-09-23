import { test } from "node:test";
import assert from "node:assert/strict";
import { crearOrden, cerrarOrden } from "../src/services/ordenes.service.js";
import { OrdenNoEncontradaError, OrdenYaCerradaError } from "../src/errors/domain-errors.js";

test("cerrarOrden lanza OrdenNoEncontradaError si no existe", () => {
  assert.throws(() => cerrarOrden(999999), OrdenNoEncontradaError);
});

test("cerrarOrden lanza OrdenYaCerradaError la segunda vez", () => {
  const orden = crearOrden({ moto: "Honda", falla: "frenos" });
  cerrarOrden(orden.id);
  assert.throws(() => cerrarOrden(orden.id), OrdenYaCerradaError);
});
