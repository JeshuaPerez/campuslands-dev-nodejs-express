import { app } from "./app.js";

const PUERTO = process.env.PORT || 3028;

app.listen(PUERTO, () => {
  console.log(`Servidor de hiperdeportivos escuchando en el puerto ${PUERTO}`);
});
