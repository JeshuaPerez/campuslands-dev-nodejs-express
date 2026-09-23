import { app } from "./app.js";

const PUERTO = process.env.PORT || 3062;

app.listen(PUERTO, () => {
  console.log(`Servidor de peliculas de miedo escuchando en el puerto ${PUERTO}`);
});
