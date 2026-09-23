/**
 * Cola de tareas conceptual: procesa las tareas encoladas de a una, en
 * orden, sin bloquear el hilo principal (cada tarea es una funcion async).
 * No usa Redis ni un broker real, solo demuestra la idea.
 */
export class ColaTareas {
  #pendientes = [];
  #procesando = false;
  #completadas = [];

  encolar(tarea) {
    this.#pendientes.push(tarea);
    this.#procesar();
  }

  async #procesar() {
    if (this.#procesando) return;
    this.#procesando = true;

    while (this.#pendientes.length > 0) {
      const tarea = this.#pendientes.shift();
      try {
        const resultado = await tarea();
        this.#completadas.push({ estado: "ok", resultado });
      } catch (error) {
        this.#completadas.push({ estado: "error", mensaje: error.message });
      }
    }

    this.#procesando = false;
  }

  get pendientes() {
    return this.#pendientes.length;
  }

  get completadas() {
    return this.#completadas;
  }
}
