import { app } from "./app.js";

const PUERTO = process.env.PORT || 3046;

app.listen(PUERTO, () => {
  console.log(`Servidor de shooters escuchando en el puerto ${PUERTO}`);
});
