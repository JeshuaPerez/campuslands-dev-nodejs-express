import { app } from "./app.js";

const PUERTO = process.env.PORT || 3042;

app.listen(PUERTO, () => {
  console.log(`Servidor de arquitectura 3D escuchando en el puerto ${PUERTO}`);
});
