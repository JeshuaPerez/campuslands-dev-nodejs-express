import { app } from "./app.js";

const PUERTO = process.env.PORT || 3034;

app.listen(PUERTO, () => {
  console.log(`Servidor de libros escuchando en el puerto ${PUERTO}`);
});
