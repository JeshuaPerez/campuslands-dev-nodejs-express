import { app } from "./app.js";

const PUERTO = process.env.PORT || 3068;

app.listen(PUERTO, () => {
  console.log(`Servidor de paracaidismo escuchando en el puerto ${PUERTO}`);
});
