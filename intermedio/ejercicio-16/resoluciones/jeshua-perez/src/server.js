import { app } from "./app.js";

const PUERTO = process.env.PORT || 3036;

app.listen(PUERTO, () => {
  console.log(`Servidor de sneakers escuchando en el puerto ${PUERTO}`);
});
