/**
 * Contador de metricas en memoria: cuantas peticiones llegaron por
 * ruta+metodo+status, y el total general. Conceptual (no persiste, no es
 * Prometheus), pero muestra la idea.
 */
class Metricas {
  #contadores = new Map();
  #totalPeticiones = 0;

  registrar(metodo, ruta, status) {
    const clave = `${metodo} ${ruta} ${status}`;
    this.#contadores.set(clave, (this.#contadores.get(clave) ?? 0) + 1);
    this.#totalPeticiones += 1;
  }

  resumen() {
    return {
      totalPeticiones: this.#totalPeticiones,
      porRuta: Object.fromEntries(this.#contadores),
    };
  }
}

export const metricas = new Metricas();
