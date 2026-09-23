import { app } from "./app.js";

const PUERTO = process.env.PORT || 3048;

app.listen(PUERTO, () => {
  console.log(`Servidor battle royale escuchando en el puerto ${PUERTO}`);
});
