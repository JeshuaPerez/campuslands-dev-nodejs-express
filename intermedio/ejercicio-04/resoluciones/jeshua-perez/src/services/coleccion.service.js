/**
 * Fabrica un servicio CRUD en memoria reutilizable para cualquier recurso.
 * @param {string} nombreRecurso usado en los mensajes de error
 */
export function crearColeccionService(nombreRecurso) {
  const elementos = [];
  let siguienteId = 1;

  return {
    listar() {
      return elementos;
    },
    obtener(id) {
      const elemento = elementos.find((e) => e.id === id);
      if (!elemento) {
        throw new Error(`${nombreRecurso} no encontrado`);
      }
      return elemento;
    },
    crear(datos) {
      const elemento = { id: siguienteId++, ...datos };
      elementos.push(elemento);
      return elemento;
    },
  };
}
