import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const paracaidistas = [];

export async function registrar({ nombre, clave }) {
  if (!nombre || !clave) {
    throw new Error("nombre y clave son obligatorios");
  }

  if (paracaidistas.some((p) => p.nombre === nombre)) {
    throw new Error("YA_REGISTRADO");
  }

  const claveHasheada = await bcrypt.hash(clave, SALT_ROUNDS);
  const paracaidista = { nombre, claveHasheada };
  paracaidistas.push(paracaidista);

  return { nombre };
}

export async function verificarClave(nombre, clave) {
  const paracaidista = paracaidistas.find((p) => p.nombre === nombre);

  if (!paracaidista) {
    return false;
  }

  return bcrypt.compare(clave, paracaidista.claveHasheada);
}
