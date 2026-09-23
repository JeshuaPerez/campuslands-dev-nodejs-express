import { test } from "node:test";
import assert from "node:assert/strict";
import { crearOrden, cerrarOrden, listarOrdenes } from "../src/services/ordenes.service.js";

test("crearOrden valida moto y falla", () => {
  assert.throws(() => crearOrden({ moto: "Yamaha" }));
});

test("cerrarOrden falla si ya estaba cerrada", () => {
  const orden = crearOrden({ moto: "Honda", falla: "frenos" });
  cerrarOrden(orden.id);
  assert.throws(() => cerrarOrden(orden.id), /ORDEN_YA_CERRADA/);
});

test("listarOrdenes pagina el resultado", () => {
  for (let i = 0; i < 15; i++) {
    crearOrden({ moto: `Moto ${i}`, falla: "revision" });
  }
  const resultado = listarOrdenes({ page: 1, limit: 10 });
  assert.equal(resultado.data.length, 10);
  assert.ok(resultado.total >= 15);
});
