import { app } from "./app.js";

const PUERTO = process.env.PORT || 3021;

app.listen(PUERTO, () => {
  console.log(`Servidor de misiones RPG escuchando en el puerto ${PUERTO}`);
});
