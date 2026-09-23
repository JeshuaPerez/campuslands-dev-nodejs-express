/**
 * Programador de jobs conceptual: corre una tarea cada cierto intervalo,
 * sin superponer ejecuciones (si la anterior todavia esta corriendo,
 * espera al siguiente tick en vez de acumular llamadas).
 */
export class Programador {
  #tarea;
  #intervaloMs;
  #timer = null;
  #ejecutando = false;
  ejecuciones = 0;

  constructor(tarea, intervaloMs) {
    this.#tarea = tarea;
    this.#intervaloMs = intervaloMs;
  }

  iniciar() {
    this.#timer = setInterval(() => this.#tick(), this.#intervaloMs);
  }

  detener() {
    clearInterval(this.#timer);
  }

  async #tick() {
    if (this.#ejecutando) return;

    this.#ejecutando = true;
    try {
      await this.#tarea();
      this.ejecuciones += 1;
    } finally {
      this.#ejecutando = false;
    }
  }
}
