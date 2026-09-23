import { app } from "./app.js";

const PUERTO = process.env.PORT || 3051;

app.listen(PUERTO, () => {
  console.log(`Servidor de RPG (API versionada) escuchando en el puerto ${PUERTO}`);
});
