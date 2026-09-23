const heroes = [{ id: 1, nombre: "Invoker", rol: "mago" }];
let siguienteId = 2;

export class HeroeNoEncontradoError extends Error {}

export async function listarHeroes() {
  return heroes;
}

export async function crearHeroe({ nombre, rol }) {
  if (!nombre || !rol) {
    throw new Error("nombre y rol son obligatorios");
  }

  const heroe = { id: siguienteId++, nombre, rol };
  heroes.push(heroe);
  return heroe;
}

export async function obtenerHeroe(id) {
  const heroe = heroes.find((h) => h.id === id);
  if (!heroe) {
    throw new HeroeNoEncontradoError("Heroe no encontrado");
  }
  return heroe;
}
