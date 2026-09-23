import { app } from "./app.js";

const PUERTO = process.env.PORT || 3023;

app.listen(PUERTO, () => {
  console.log(`Servidor de MOBA escuchando en el puerto ${PUERTO}`);
});
