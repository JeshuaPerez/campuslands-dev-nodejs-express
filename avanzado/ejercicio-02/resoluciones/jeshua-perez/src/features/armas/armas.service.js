const armas = [{ id: 1, nombre: "AK-47", tipo: "rifle" }];

export function listarArmas() {
  return armas;
}

export function crearArma({ nombre, tipo }) {
  if (!nombre || !tipo) {
    throw new Error("nombre y tipo son obligatorios");
  }

  const arma = { id: armas.length + 1, nombre, tipo };
  armas.push(arma);
  return arma;
}
