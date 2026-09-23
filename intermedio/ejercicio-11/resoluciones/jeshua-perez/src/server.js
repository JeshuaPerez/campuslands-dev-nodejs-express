import { app } from "./app.js";

const PUERTO = process.env.PORT || 3031;

app.listen(PUERTO, () => {
  console.log(`Servidor de musica escuchando en el puerto ${PUERTO}`);
});
