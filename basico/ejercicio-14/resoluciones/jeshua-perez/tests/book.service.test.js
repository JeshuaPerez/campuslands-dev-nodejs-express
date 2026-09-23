import { test } from "node:test";
import assert from "node:assert/strict";
import { validateBook, createBook } from "../src/services/book.service.js";

test("validateBook no devuelve errores con datos validos", () => {
  const errores = validateBook({ title: "Dune", author: "Frank Herbert", pages: 412 });
  assert.deepEqual(errores, []);
});

test("validateBook acumula errores con datos faltantes", () => {
  const errores = validateBook({ title: "", author: "", pages: -1 });
  assert.equal(errores.length, 3);
});

test("createBook lanza si faltan datos", () => {
  assert.throws(() => createBook({ title: "Dune" }));
});

test("createBook devuelve el libro normalizado", () => {
  const libro = createBook({ title: " Dune ", author: " Frank Herbert ", pages: "412" });
  assert.deepEqual(libro, { title: "Dune", author: "Frank Herbert", pages: 412 });
});
