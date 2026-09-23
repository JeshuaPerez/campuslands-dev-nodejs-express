import { test } from "node:test";
import assert from "node:assert/strict";
import { listarJugadores } from "../src/services/jugadores.service.js";

test("sin sort devuelve el orden original", () => {
  const jugadores = listarJugadores({});
  assert.equal(jugadores[0].nombre, "Ma Long");
});

test("ordena ascendente por puntaje", () => {
  const jugadores = listarJugadores({ sort: "puntaje" });
  assert.equal(jugadores[0].nombre, "Ovtcharov");
});

test("ordena descendente por puntaje", () => {
  const jugadores = listarJugadores({ sort: "puntaje", order: "desc" });
  assert.equal(jugadores[0].nombre, "Fan Zhendong");
});

test("lanza si el campo de sort no es valido", () => {
  assert.throws(() => listarJugadores({ sort: "edad" }));
});
