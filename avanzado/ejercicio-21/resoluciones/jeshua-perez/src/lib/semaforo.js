/**
 * Semaforo: limita cuantas tareas async corren al mismo tiempo. Las que
 * exceden el limite esperan en una cola hasta que se libera un lugar.
 */
export class Semaforo {
  #disponibles;
  #cola = [];

  constructor(maxConcurrentes) {
    this.#disponibles = maxConcurrentes;
  }

  async ejecutar(tarea) {
    await this.#adquirir();
    try {
      return await tarea();
    } finally {
      this.#liberar();
    }
  }

  #adquirir() {
    if (this.#disponibles > 0) {
      this.#disponibles -= 1;
      return Promise.resolve();
    }

    return new Promise((resolve) => this.#cola.push(resolve));
  }

  #liberar() {
    const siguiente = this.#cola.shift();
    if (siguiente) {
      siguiente();
    } else {
      this.#disponibles += 1;
    }
  }
}
