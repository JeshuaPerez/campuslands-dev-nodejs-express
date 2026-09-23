import { app } from "./app.js";

const PUERTO = process.env.PORT || 3049;

app.listen(PUERTO, () => {
  console.log(`Servidor de futbol escuchando en el puerto ${PUERTO}`);
});
