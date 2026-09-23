const personajes = [];
let siguienteId = 1;

const ARMAS = {
  espada: 15,
  daga: 8,
  martillo: 25,
};

export function crearPersonaje({ nombre }) {
  if (!nombre) {
    throw new Error("El nombre es obligatorio");
  }

  const personaje = { id: siguienteId++, nombre, armaEquipada: null, poderAtaque: 5 };
  personajes.push(personaje);
  return personaje;
}

export function equiparArma(id, arma) {
  const personaje = personajes.find((p) => p.id === id);

  if (!personaje) {
    throw new Error("PERSONAJE_NO_ENCONTRADO");
  }

  if (!ARMAS[arma]) {
    throw new Error("ARMA_DESCONOCIDA");
  }

  personaje.armaEquipada = arma;
  personaje.poderAtaque = ARMAS[arma];
  return personaje;
}

export function atacar(id) {
  const personaje = personajes.find((p) => p.id === id);

  if (!personaje) {
    throw new Error("PERSONAJE_NO_ENCONTRADO");
  }

  return { atacante: personaje.nombre, dano: personaje.poderAtaque };
}
