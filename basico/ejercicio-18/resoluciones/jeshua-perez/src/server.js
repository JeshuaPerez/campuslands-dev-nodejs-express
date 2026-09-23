import { app } from "./app.js";

const PUERTO = process.env.PORT || 3008;

app.listen(PUERTO, () => {
  console.log(`Servidor de paracaidismo escuchando en el puerto ${PUERTO}`);
});
