import { app } from "./app.js";

const PUERTO = process.env.PORT || 3030;

app.listen(PUERTO, () => {
  console.log(`Servidor de pingpong escuchando en el puerto ${PUERTO}`);
});
