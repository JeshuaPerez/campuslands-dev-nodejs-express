import { app } from "./app.js";

const PUERTO = process.env.PORT || 3037;

app.listen(PUERTO, () => {
  console.log(`Servidor de viajes escuchando en el puerto ${PUERTO}`);
});
