import { describe, test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Inventario } from "../src/services/inventario.service.js";

describe("Inventario de electrodos de soldadura", () => {
  let inventario;

  beforeEach(() => {
    inventario = new Inventario();
    inventario.agregar(10);
  });

  test("agregar suma al stock", () => {
    inventario.agregar(5);
    assert.equal(inventario.stock, 15);
  });

  test("agregar lanza con cantidad invalida", () => {
    assert.throws(() => inventario.agregar(0));
  });

  test("consumir resta del stock", () => {
    inventario.consumir(4);
    assert.equal(inventario.stock, 6);
  });

  test("consumir lanza si no hay stock suficiente", () => {
    assert.throws(() => inventario.consumir(999), /STOCK_INSUFICIENTE/);
  });

  test("cada test arranca con stock limpio gracias a beforeEach", () => {
    assert.equal(inventario.stock, 10);
  });
});
