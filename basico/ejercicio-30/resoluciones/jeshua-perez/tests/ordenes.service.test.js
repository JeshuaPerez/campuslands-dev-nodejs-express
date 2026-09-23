import { test } from "node:test";
import assert from "node:assert/strict";
import { crearOrden, obtenerOrden, cerrarOrden } from "../src/services/ordenes.service.js";

test("crearOrden valida moto y falla", () => {
  assert.throws(() => crearOrden({ moto: "", falla: "no arranca" }));
  assert.throws(() => crearOrden({ moto: "Yamaha", falla: "" }));
});

test("crearOrden crea una orden pendiente", () => {
  const orden = crearOrden({ moto: "Yamaha FZ", falla: "no arranca" });
  assert.equal(orden.estado, "pendiente");
});

test("cerrarOrden cambia el estado y falla si ya estaba cerrada", () => {
  const orden = crearOrden({ moto: "Honda", falla: "frenos" });
  cerrarOrden(orden.id);
  assert.equal(obtenerOrden(orden.id).estado, "cerrada");
  assert.throws(() => cerrarOrden(orden.id), /ORDEN_YA_CERRADA/);
});

test("obtenerOrden lanza si el id no existe", () => {
  assert.throws(() => obtenerOrden(999999), /ORDEN_NO_ENCONTRADA/);
});
