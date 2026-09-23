import { app } from "./app.js";

const PUERTO = process.env.PORT || 3038;

app.listen(PUERTO, () => {
  console.log(`Servidor de paracaidismo escuchando en el puerto ${PUERTO}`);
});
