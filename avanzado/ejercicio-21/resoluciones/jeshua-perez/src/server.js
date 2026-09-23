import { app } from "./app.js";

const PUERTO = process.env.PORT || 3071;

app.listen(PUERTO, () => {
  console.log(`Servidor de animacion 3D escuchando en el puerto ${PUERTO}`);
});
