/**
 * Servicio de dominio: inventario de un concesionario de autos de lujo.
 *
 * No sabe nada de argv ni de HTTP: recibe criterios ya parseados.
 */

export class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

/** Catalogo en memoria. El ejercicio 09 lo llevara a disco. */
const CATALOGO = Object.freeze([
  { id: 1, marca: 'Ferrari', modelo: '296 GTB', anio: 2024, precio: 1450000000, cv: 830, stock: 2 },
  { id: 2, marca: 'Lamborghini', modelo: 'Huracan STO', anio: 2023, precio: 1620000000, cv: 640, stock: 1 },
  { id: 3, marca: 'Porsche', modelo: '911 Turbo S', anio: 2025, precio: 980000000, cv: 650, stock: 4 },
  { id: 4, marca: 'Aston Martin', modelo: 'DB12', anio: 2024, precio: 1120000000, cv: 680, stock: 3 },
  { id: 5, marca: 'Porsche', modelo: 'Taycan Turbo', anio: 2025, precio: 720000000, cv: 625, stock: 6 },
  { id: 6, marca: 'Ferrari', modelo: 'Roma', anio: 2022, precio: 1280000000, cv: 620, stock: 0 },
]);

export const CAMPOS_ORDENABLES = Object.freeze(['precio', 'anio', 'cv', 'stock', 'marca']);

export function listarMarcas() {
  return [...new Set(CATALOGO.map((auto) => auto.marca))].sort();
}

export function obtenerCatalogo() {
  return CATALOGO.map((auto) => ({ ...auto }));
}

function validarNumero(valor, etiqueta) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    throw new ValidacionError(`${etiqueta} debe ser un numero no negativo.`);
  }

  return numero;
}

/**
 * Busca autos aplicando filtros y orden.
 *
 * @param {{marca?: string, precioMax?: number|string, anioMin?: number|string,
 *          soloDisponibles?: boolean, ordenarPor?: string, descendente?: boolean,
 *          limite?: number|string}} criterios
 * @throws {ValidacionError} si algun criterio no es valido.
 */
export function buscarAutos(criterios = {}) {
  let resultado = obtenerCatalogo();

  if (criterios.marca !== undefined) {
    const marca = String(criterios.marca).trim().toLowerCase();

    if (marca === '') {
      throw new ValidacionError('La marca no puede estar vacia.');
    }

    resultado = resultado.filter((auto) => auto.marca.toLowerCase() === marca);
  }

  if (criterios.precioMax !== undefined) {
    const precioMax = validarNumero(criterios.precioMax, 'El precio maximo');

    resultado = resultado.filter((auto) => auto.precio <= precioMax);
  }

  if (criterios.anioMin !== undefined) {
    const anioMin = validarNumero(criterios.anioMin, 'El anio minimo');

    resultado = resultado.filter((auto) => auto.anio >= anioMin);
  }

  if (criterios.soloDisponibles) {
    resultado = resultado.filter((auto) => auto.stock > 0);
  }

  const ordenarPor = criterios.ordenarPor ?? 'precio';

  if (!CAMPOS_ORDENABLES.includes(ordenarPor)) {
    throw new ValidacionError(
      `No se puede ordenar por ${ordenarPor}. Campos validos: ${CAMPOS_ORDENABLES.join(', ')}.`,
    );
  }

  resultado.sort((a, b) => {
    const izquierda = a[ordenarPor];
    const derecha = b[ordenarPor];

    const comparacion =
      typeof izquierda === 'string'
        ? izquierda.localeCompare(derecha)
        : izquierda - derecha;

    return criterios.descendente ? -comparacion : comparacion;
  });

  if (criterios.limite !== undefined) {
    const limite = Number(criterios.limite);

    if (!Number.isInteger(limite) || limite < 1) {
      throw new ValidacionError('El limite debe ser un entero mayor o igual a 1.');
    }

    resultado = resultado.slice(0, limite);
  }

  return resultado;
}

/** Resumen agregado del inventario, para el comando de estadisticas. */
export function resumirInventario() {
  const catalogo = obtenerCatalogo();
  const unidades = catalogo.reduce((suma, auto) => suma + auto.stock, 0);
  const valorStock = catalogo.reduce((suma, auto) => suma + auto.precio * auto.stock, 0);

  return {
    modelos: catalogo.length,
    unidades,
    marcas: listarMarcas(),
    sinStock: catalogo.filter((auto) => auto.stock === 0).map((auto) => auto.modelo),
    valorStock,
    precioMedio: Math.round(
      catalogo.reduce((suma, auto) => suma + auto.precio, 0) / catalogo.length,
    ),
    masPotente: catalogo.reduce((mejor, auto) => (auto.cv > mejor.cv ? auto : mejor)),
  };
}
