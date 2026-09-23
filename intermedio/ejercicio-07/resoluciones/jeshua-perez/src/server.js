import { app } from "./app.js";

const PUERTO = process.env.PORT || 3027;

app.listen(PUERTO, () => {
  console.log(`Servidor de autos de lujo escuchando en el puerto ${PUERTO}`);
});
