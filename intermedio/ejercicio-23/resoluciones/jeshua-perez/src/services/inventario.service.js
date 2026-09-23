export class Inventario {
  #electrodos = 0;

  agregar(cantidad) {
    if (cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }
    this.#electrodos += cantidad;
    return this.#electrodos;
  }

  consumir(cantidad) {
    if (cantidad > this.#electrodos) {
      throw new Error("STOCK_INSUFICIENTE");
    }
    this.#electrodos -= cantidad;
    return this.#electrodos;
  }

  get stock() {
    return this.#electrodos;
  }
}
