import { app } from "./app.js";

const PUERTO = process.env.PORT || 3026;

app.listen(PUERTO, () => {
  console.log(`Servidor del taller de motos escuchando en el puerto ${PUERTO}`);
});
