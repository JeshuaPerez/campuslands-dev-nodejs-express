import { app } from "./app.js";
import { programadorOrdenesVencidas } from "./jobs/revisar-ordenes-vencidas.job.js";

const PUERTO = process.env.PORT || 3073;

programadorOrdenesVencidas.iniciar();

app.listen(PUERTO, () => {
  console.log(`Servidor de soldadura escuchando en el puerto ${PUERTO}`);
});
