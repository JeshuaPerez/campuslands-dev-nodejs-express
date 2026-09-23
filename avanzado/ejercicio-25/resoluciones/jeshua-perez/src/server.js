import { app } from "./app.js";

const PUERTO = process.env.PORT || 3075;

app.listen(PUERTO, () => {
  console.log(`Servidor de RPG escuchando en el puerto ${PUERTO}`);
});
