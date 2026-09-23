import { app } from "./app.js";

const PUERTO = process.env.PORT || 3065;

app.listen(PUERTO, () => {
  console.log(`Servidor de comida urbana escuchando en el puerto ${PUERTO}`);
});
