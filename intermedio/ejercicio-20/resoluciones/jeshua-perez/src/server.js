import { app } from "./app.js";

const PUERTO = process.env.PORT || 3040;

app.listen(PUERTO, () => {
  console.log(`Servidor de dibujo digital escuchando en el puerto ${PUERTO}`);
});
