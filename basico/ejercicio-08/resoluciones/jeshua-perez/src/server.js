/**
 * Punto de entrada HTTP.
 *
 * Si la configuracion no es valida, el proceso muere aqui con un mensaje que
 * enumera TODO lo que falta. Arrancar a medias y fallar mas tarde con un
 * "undefined is not a function" es mucho peor que no arrancar.
 */

import { crearApp } from './app.js';
import { ConfiguracionInvalidaError, cargarConfiguracion, ocultarSecretos } from './config/index.js';

let configuracion;

try {
  configuracion = cargarConfiguracion(process.env);
} catch (error) {
  if (error instanceof ConfiguracionInvalidaError) {
    console.error('\nNo se puede arrancar.\n');
    console.error(error.message);
    console.error('\nRevisa .env.example y crea tu .env a partir de ahi.\n');
    process.exit(1);
  }

  throw error;
}

crearApp(configuracion).listen(configuracion.PORT, () => {
  console.log(`${configuracion.APP_NOMBRE} escuchando en http://localhost:${configuracion.PORT}`);
  console.log(`Entorno: ${configuracion.NODE_ENV} | Log: ${configuracion.LOG_NIVEL}`);
  console.log('Configuracion cargada (secretos ocultos):');
  console.table(ocultarSecretos(configuracion));
});
