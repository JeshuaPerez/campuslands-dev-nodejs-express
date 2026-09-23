import { app } from "./app.js";

const PUERTO = process.env.PORT || 3060;

app.listen(PUERTO, () => {
  console.log(`Servidor de pingpong escuchando en el puerto ${PUERTO}`);
});
