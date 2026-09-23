/**
 * Cache en memoria con expiracion (TTL). No persiste entre reinicios ni se
 * comparte entre instancias del servidor: es solo para evitar recalcular
 * algo costoso dentro de un mismo proceso.
 */
export class CacheTTL {
  #datos = new Map();

  constructor(ttlMs) {
    this.ttlMs = ttlMs;
  }

  get(clave) {
    const entrada = this.#datos.get(clave);

    if (!entrada) {
      return undefined;
    }

    if (Date.now() > entrada.expiraEn) {
      this.#datos.delete(clave);
      return undefined;
    }

    return entrada.valor;
  }

  set(clave, valor) {
    this.#datos.set(clave, { valor, expiraEn: Date.now() + this.ttlMs });
  }

  get tamano() {
    return this.#datos.size;
  }
}
