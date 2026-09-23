import { test } from "node:test";
import assert from "node:assert/strict";
import { playTrack } from "../src/services/track.service.js";

test("playTrack resuelve con el mensaje de reproduccion", async () => {
  const mensaje = await playTrack("Yesterday");
  assert.match(mensaje, /Reproduciendo: Yesterday/);
});

test("playTrack rechaza si el nombre viene vacio", async () => {
  await assert.rejects(() => playTrack(""), /El nombre de la cancion es obligatorio/);
});
