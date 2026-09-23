import { app } from "./app.js";

const PUERTO = process.env.PORT || 3024;

app.listen(PUERTO, () => {
  console.log(`Servidor battle royale escuchando en el puerto ${PUERTO}`);
});
