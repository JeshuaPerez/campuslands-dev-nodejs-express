import { app } from "./app.js";

const PUERTO = process.env.PORT || 3043;

app.listen(PUERTO, () => {
  console.log(`Servidor de soldadura escuchando en el puerto ${PUERTO}`);
});
