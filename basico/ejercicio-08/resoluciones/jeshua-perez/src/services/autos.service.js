/**
 * Servicio de dominio: registro de hiperdeportivos.
 *
 * Recibe la configuracion ya validada por inyeccion, en vez de leer
 * `process.env` por su cuenta. Asi las reglas dependen de un objeto normal y
 * las pruebas pueden cambiarlas sin tocar el entorno del proceso.
 */

export class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

const CATALOGO_BASE = Object.freeze([
  { id: 1, marca: 'Bugatti', modelo: 'Chiron Super Sport', velocidadMaxima: 440, cv: 1600 },
  { id: 2, marca: 'Koenigsegg', modelo: 'Jesko Absolut', velocidadMaxima: 483, cv: 1600 },
  { id: 3, marca: 'Rimac', modelo: 'Nevera', velocidadMaxima: 412, cv: 1914 },
  { id: 4, marca: 'McLaren', modelo: 'Speedtail', velocidadMaxima: 403, cv: 1070 },
  { id: 5, marca: 'Pagani', modelo: 'Huayra R', velocidadMaxima: 383, cv: 850 },
]);

/**
 * Devuelve el catalogo con la velocidad convertida a millas.
 *
 * El factor de conversion sale de la configuracion, para demostrar que un
 * valor de entorno puede cambiar el resultado del dominio.
 */
export function obtenerCatalogo(configuracion) {
  return CATALOGO_BASE.map((auto) => ({
    ...auto,
    velocidadMaximaMph: Math.round(
      auto.velocidadMaxima * configuracion.FACTOR_CONVERSION_MILLAS,
    ),
    superaElTope: auto.velocidadMaxima > configuracion.MAX_VELOCIDAD_KMH,
  }));
}

/**
 * Registra un auto respetando el tope configurado en MAX_VELOCIDAD_KMH.
 *
 * @throws {ValidacionError} si los datos no cumplen o se pasa del tope.
 */
export function registrarAuto(datos = {}, configuracion) {
  const { marca, modelo, velocidadMaxima } = datos;

  if (typeof marca !== 'string' || marca.trim() === '') {
    throw new ValidacionError('La marca es obligatoria.');
  }

  if (typeof modelo !== 'string' || modelo.trim() === '') {
    throw new ValidacionError('El modelo es obligatorio.');
  }

  if (!Number.isFinite(velocidadMaxima) || velocidadMaxima <= 0) {
    throw new ValidacionError('La velocidad maxima debe ser un numero positivo.');
  }

  // Este es el punto del ejercicio: una variable de entorno define una regla
  // de negocio, y cambiarla cambia que entradas se aceptan.
  if (velocidadMaxima > configuracion.MAX_VELOCIDAD_KMH) {
    throw new ValidacionError(
      `La velocidad ${velocidadMaxima} km/h supera el tope configurado de ${configuracion.MAX_VELOCIDAD_KMH} km/h.`,
    );
  }

  return {
    marca: marca.trim(),
    modelo: modelo.trim(),
    velocidadMaxima,
    velocidadMaximaMph: Math.round(velocidadMaxima * configuracion.FACTOR_CONVERSION_MILLAS),
    registradoEn: configuracion.NODE_ENV,
  };
}
