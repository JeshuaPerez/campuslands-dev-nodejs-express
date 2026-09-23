import { crearServidor } from "./server.js";

const PUERTO = process.env.PORT || 3005;

crearServidor().listen(PUERTO, () => {
  console.log(`Servidor de comida urbana escuchando en el puerto ${PUERTO}`);
});
