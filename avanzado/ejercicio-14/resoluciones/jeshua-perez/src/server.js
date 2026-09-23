import { app } from "./app.js";

const PUERTO = process.env.PORT || 3064;

app.listen(PUERTO, () => {
  console.log(`Servidor de libros escuchando en el puerto ${PUERTO}`);
});
