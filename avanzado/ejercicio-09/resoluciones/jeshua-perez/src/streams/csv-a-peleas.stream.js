import { Transform } from "node:stream";

/**
 * Transform stream: convierte lineas CSV "nombre,golpes,resultado" en
 * objetos JS, uno por chunk emitido. Procesa linea por linea sin cargar
 * todo el archivo en memoria de una vez.
 */
export class CsvAPeleasStream extends Transform {
  #buffer = "";

  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk, encoding, callback) {
    this.#buffer += chunk.toString();
    const lineas = this.#buffer.split("\n");
    this.#buffer = lineas.pop();

    for (const linea of lineas) {
      this.#procesarLinea(linea);
    }

    callback();
  }

  _flush(callback) {
    if (this.#buffer.trim()) {
      this.#procesarLinea(this.#buffer);
    }
    callback();
  }

  #procesarLinea(linea) {
    if (!linea.trim()) return;

    const [nombre, golpes, resultado] = linea.split(",").map((v) => v.trim());
    this.push({ nombre, golpes: Number(golpes), resultado });
  }
}
