import { test } from "node:test";
import assert from "node:assert/strict";
import { loadMovie, loadMarathon } from "../src/services/movie.service.js";

test("loadMovie resuelve con el mensaje de carga", async () => {
  const mensaje = await loadMovie("It");
  assert.match(mensaje, /It lista para ver/);
});

test("loadMovie rechaza si el nombre viene vacio", async () => {
  await assert.rejects(() => loadMovie(""), /El nombre de la pelicula es obligatorio/);
});

test("loadMarathon carga las dos peliculas en orden", async () => {
  const resultados = await loadMarathon("It", "Annabelle");
  assert.deepEqual(resultados, ["It lista para ver", "Annabelle lista para ver"]);
});
