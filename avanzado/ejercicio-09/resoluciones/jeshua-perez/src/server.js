import { app } from "./app.js";

const PUERTO = process.env.PORT || 3059;

app.listen(PUERTO, () => {
  console.log(`Servidor de kickboxing escuchando en el puerto ${PUERTO}`);
});
