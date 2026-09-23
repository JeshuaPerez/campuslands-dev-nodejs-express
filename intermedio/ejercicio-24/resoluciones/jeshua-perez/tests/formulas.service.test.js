import { test } from "node:test";
import assert from "node:assert/strict";
import { crearFormula } from "../src/services/formulas.service.js";

function crearRepositorioFalso(existente = null) {
  const guardados = [];
  return {
    buscarPorSimbolo: () => existente,
    guardar: (formula) => {
      guardados.push(formula);
      return formula;
    },
    guardados,
  };
}

test("crearFormula usa el repositorio inyectado, sin tocar el real", () => {
  const repositorioFalso = crearRepositorioFalso();
  const formula = crearFormula(repositorioFalso, { nombre: "Sal", simbolo: "NaCl" });

  assert.deepEqual(formula, { nombre: "Sal", simbolo: "NaCl" });
  assert.equal(repositorioFalso.guardados.length, 1);
});

test("crearFormula lanza si el repositorio dice que el simbolo ya existe", () => {
  const repositorioFalso = crearRepositorioFalso({ nombre: "Agua", simbolo: "H2O" });

  assert.throws(
    () => crearFormula(repositorioFalso, { nombre: "Agua", simbolo: "H2O" }),
    /SIMBOLO_YA_EXISTE/
  );
});

test("crearFormula valida los datos antes de tocar el repositorio", () => {
  const repositorioFalso = crearRepositorioFalso();
  assert.throws(() => crearFormula(repositorioFalso, { nombre: "Sal" }));
  assert.equal(repositorioFalso.guardados.length, 0);
});
