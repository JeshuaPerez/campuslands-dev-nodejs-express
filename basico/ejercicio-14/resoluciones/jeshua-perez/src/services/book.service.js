/**
 * Valida los datos de un libro nuevo.
 * @param {{title?: string, author?: string, pages?: number}} datos
 * @returns {string[]} lista de errores encontrados (vacia si es valido)
 */
export function validateBook({ title, author, pages } = {}) {
  const errores = [];

  if (!title || !title.trim()) {
    errores.push("El titulo es obligatorio");
  }

  if (!author || !author.trim()) {
    errores.push("El autor es obligatorio");
  }

  if (pages === undefined || pages === null || Number.isNaN(Number(pages))) {
    errores.push("Las paginas deben ser un numero");
  } else if (Number(pages) <= 0) {
    errores.push("Las paginas deben ser mayores a 0");
  }

  return errores;
}

/**
 * Crea un libro si los datos son validos. Lanza si no lo son.
 * @param {{title?: string, author?: string, pages?: number}} datos
 */
export function createBook(datos) {
  const errores = validateBook(datos);
  if (errores.length > 0) {
    throw new Error(errores.join(", "));
  }

  return { title: datos.title.trim(), author: datos.author.trim(), pages: Number(datos.pages) };
}
