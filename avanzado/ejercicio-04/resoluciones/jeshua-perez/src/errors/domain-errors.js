export class DomainError extends Error {
  statusCode = 400;
}

export class PartidaNoEncontradaError extends DomainError {
  statusCode = 404;
  constructor() {
    super("Partida no encontrada");
  }
}

export class PartidaLlenaError extends DomainError {
  statusCode = 409;
  constructor() {
    super("La partida ya esta llena");
  }
}

export class DatosInvalidosError extends DomainError {
  statusCode = 400;
}
