import { app } from "./app.js";

/**
 * Unico archivo que conoce el puerto real y llama app.listen. Si mañana
 * hay que correr la misma app detras de un proxy, en un test runner con
 * cluster, o exportarla para una funcion serverless, server.js es lo
 * unico que cambia.
 */
const PUERTO = process.env.PORT || 3078;

app.listen(PUERTO, () => {
  console.log(`Servidor battle royale escuchando en el puerto ${PUERTO}`);
});
