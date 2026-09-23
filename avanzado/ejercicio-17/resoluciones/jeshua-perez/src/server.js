import { app } from "./app.js";

const PUERTO = process.env.PORT || 3067;

app.listen(PUERTO, () => {
  console.log(`Servidor de viajes escuchando en el puerto ${PUERTO}`);
});
