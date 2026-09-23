const formulas = [{ id: 1, nombre: "Agua", simbolo: "H2O" }];

export function buscarPorSimbolo(simbolo) {
  return formulas.find((f) => f.simbolo === simbolo) ?? null;
}

export function guardar(formula) {
  formulas.push(formula);
  return formula;
}
