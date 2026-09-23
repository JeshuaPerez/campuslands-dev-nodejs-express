import { app } from "./app.js";

const PUERTO = process.env.PORT || 3052;

app.listen(PUERTO, () => {
  console.log(`Servidor de shooters escuchando en el puerto ${PUERTO}`);
});
