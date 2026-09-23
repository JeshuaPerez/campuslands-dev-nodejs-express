import { test } from "node:test";
import assert from "node:assert/strict";
import { crearColeccionService } from "../src/services/coleccion.service.js";

test("el mismo servicio funciona para distintos recursos de forma independiente", () => {
  const jugadores = crearColeccionService("Jugador");
  const zonas = crearColeccionService("Zona");

  jugadores.crear({ nombre: "Ninja" });
  zonas.crear({ nombre: "Zona segura" });

  assert.equal(jugadores.listar().length, 1);
  assert.equal(zonas.listar().length, 1);
});

test("obtener lanza con el nombre del recurso si no existe", () => {
  const jugadores = crearColeccionService("Jugador");
  assert.throws(() => jugadores.obtener(999), /Jugador no encontrado/);
});
