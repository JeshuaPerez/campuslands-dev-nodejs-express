import { app } from "./app.js";

const PUERTO = process.env.PORT || 3045;

app.listen(PUERTO, () => {
  console.log(`Servidor de RPG escuchando en el puerto ${PUERTO}`);
});
