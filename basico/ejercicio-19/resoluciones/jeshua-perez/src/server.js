import { app } from "./app.js";

const PUERTO = process.env.PORT || 3009;

app.listen(PUERTO, () => {
  console.log(`Servidor de tatuajes escuchando en el puerto ${PUERTO}`);
});
