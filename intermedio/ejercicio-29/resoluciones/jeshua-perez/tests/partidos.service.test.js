import { test } from "node:test";
import assert from "node:assert/strict";
import { crearPartido, registrarGol } from "../src/services/partidos.service.js";

test("crearPartido valida que local y visitante no sean el mismo equipo", () => {
  assert.throws(() => crearPartido({ local: "River", visitante: "River" }));
});

test("registrarGol suma al equipo correcto", () => {
  const partido = crearPartido({ local: "River", visitante: "Boca" });
  registrarGol(partido.id, "visitante");
  assert.equal(partido.golesVisitante, 1);
  assert.equal(partido.golesLocal, 0);
});

test("registrarGol lanza si el equipo no es local ni visitante", () => {
  const partido = crearPartido({ local: "River", visitante: "Boca" });
  assert.throws(() => registrarGol(partido.id, "arbitro"));
});

test("registrarGol lanza si el partido no existe", () => {
  assert.throws(() => registrarGol(999999, "local"), /PARTIDO_NO_ENCONTRADO/);
});
