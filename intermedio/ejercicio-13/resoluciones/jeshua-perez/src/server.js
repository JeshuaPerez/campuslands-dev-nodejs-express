import { app } from "./app.js";

const PUERTO = process.env.PORT || 3033;

app.listen(PUERTO, () => {
  console.log(`Servidor de ciencia ficcion escuchando en el puerto ${PUERTO}`);
});
