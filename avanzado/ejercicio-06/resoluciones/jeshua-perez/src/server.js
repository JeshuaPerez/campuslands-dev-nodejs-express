import { app } from "./app.js";

const PUERTO = process.env.PORT || 3056;

app.listen(PUERTO, () => {
  console.log(`Servidor del taller de motos escuchando en el puerto ${PUERTO}`);
});
