export class DomainError extends Error {
  statusCode = 400;
}

export class OrdenNoEncontradaError extends DomainError {
  statusCode = 404;
  constructor() {
    super("Orden no encontrada");
  }
}

export class OrdenYaCerradaError extends DomainError {
  statusCode = 409;
  constructor() {
    super("La orden ya estaba cerrada");
  }
}
