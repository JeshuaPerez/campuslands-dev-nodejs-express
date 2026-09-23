import { app } from "./app.js";

const PUERTO = process.env.PORT || 3035;

app.listen(PUERTO, () => {
  console.log(`Servidor de comida urbana escuchando en el puerto ${PUERTO}`);
});
