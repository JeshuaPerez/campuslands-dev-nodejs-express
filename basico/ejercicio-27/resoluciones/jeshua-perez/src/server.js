import { app } from "./app.js";

const PUERTO = process.env.PORT || 3017;

app.listen(PUERTO, () => {
  console.log(`Servidor de MOBA esports escuchando en el puerto ${PUERTO}`);
});
