import { app } from "./app.js";

const PUERTO = process.env.PORT || 3014;

app.listen(PUERTO, () => {
  console.log(`Servidor de formulas quimicas escuchando en el puerto ${PUERTO}`);
});
