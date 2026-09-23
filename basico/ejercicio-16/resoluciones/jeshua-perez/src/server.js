import { app } from "./app.js";

const PUERTO = process.env.PORT || 3006;

app.listen(PUERTO, () => {
  console.log(`Servidor de sneakers escuchando en el puerto ${PUERTO}`);
});
