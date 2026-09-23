/**
 * Sanitizacion basica: quita tags HTML/script para evitar que una
 * inyeccion XSS quede guardada tal cual. No reemplaza a una libreria
 * seria en produccion, pero muestra la idea de nunca confiar en el input.
 */
export function sanitizarTexto(texto) {
  if (typeof texto !== "string") {
    return texto;
  }

  return texto.replace(/<[^>]*>/g, "").trim();
}

export function sanitizarObjeto(objeto) {
  const resultado = {};

  for (const [clave, valor] of Object.entries(objeto)) {
    resultado[clave] = typeof valor === "string" ? sanitizarTexto(valor) : valor;
  }

  return resultado;
}
