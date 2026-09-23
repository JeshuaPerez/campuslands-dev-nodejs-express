import { test } from "node:test";
import assert from "node:assert/strict";
import { listarNavesConPiloto, obtenerNaveConPiloto } from "../src/services/naves.service.js";

test("listarNavesConPiloto incluye el piloto relacionado", () => {
  const naves = listarNavesConPiloto();
  const nostromo = naves.find((n) => n.nombre === "Nostromo");
  assert.equal(nostromo.piloto.nombre, "Ripley");
});

test("obtenerNaveConPiloto lanza si la nave no existe", () => {
  assert.throws(() => obtenerNaveConPiloto(999999), /NAVE_NO_ENCONTRADA/);
});
