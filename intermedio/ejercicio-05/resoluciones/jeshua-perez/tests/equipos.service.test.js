import { test } from "node:test";
import assert from "node:assert/strict";
import { crearEquipo, obtenerEquipo, listarEquipos } from "../src/services/equipos.service.js";

test("crearEquipo valida nombre y liga", () => {
  assert.throws(() => crearEquipo({ nombre: "Barcelona" }));
});

test("crearEquipo guarda el equipo en el repositorio", () => {
  const equipo = crearEquipo({ nombre: "River Plate", liga: "Argentina" });
  assert.equal(listarEquipos().some((e) => e.id === equipo.id), true);
});

test("obtenerEquipo lanza si el id no existe", () => {
  assert.throws(() => obtenerEquipo(999999), /EQUIPO_NO_ENCONTRADO/);
});
