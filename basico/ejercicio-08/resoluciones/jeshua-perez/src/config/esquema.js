/**
 * Esquema de configuracion.
 *
 * Declara que variables existen, de que tipo son, si son obligatorias y que
 * valor toman si faltan. Tenerlo en un solo sitio evita el patron de ir
 * salpicando `process.env.LO_QUE_SEA || 'algo'` por todo el codigo, donde nadie
 * sabe ya que se puede configurar ni que pasa si falta.
 */

export const NIVELES_LOG = Object.freeze(['error', 'warn', 'info', 'debug']);
export const ENTORNOS = Object.freeze(['development', 'test', 'production']);

/**
 * `secreto: true` marca los valores que nunca deben imprimirse enteros.
 */
export const ESQUEMA = Object.freeze({
  APP_NOMBRE: {
    tipo: 'texto',
    obligatoria: true,
    descripcion: 'Nombre visible de la escuderia.',
  },
  API_CLAVE: {
    tipo: 'texto',
    obligatoria: true,
    secreto: true,
    minimo: 16,
    descripcion: 'Clave de la API. Minimo 16 caracteres.',
  },
  NODE_ENV: {
    tipo: 'enumerado',
    valores: ENTORNOS,
    porDefecto: 'development',
    descripcion: 'Entorno de ejecucion.',
  },
  PORT: {
    tipo: 'entero',
    porDefecto: 3000,
    minimo: 1,
    maximo: 65535,
    descripcion: 'Puerto HTTP.',
  },
  LOG_NIVEL: {
    tipo: 'enumerado',
    valores: NIVELES_LOG,
    porDefecto: 'info',
    descripcion: 'Detalle de los logs.',
  },
  MAX_VELOCIDAD_KMH: {
    tipo: 'entero',
    porDefecto: 400,
    minimo: 1,
    descripcion: 'Tope de velocidad admitido al registrar un auto.',
  },
  TELEMETRIA_ACTIVA: {
    tipo: 'booleano',
    porDefecto: true,
    descripcion: 'Si se registran metricas de cada peticion.',
  },
  FACTOR_CONVERSION_MILLAS: {
    tipo: 'decimal',
    porDefecto: 0.621371,
    descripcion: 'Factor km a millas.',
  },
});
