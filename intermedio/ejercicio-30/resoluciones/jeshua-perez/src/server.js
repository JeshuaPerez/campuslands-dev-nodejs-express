import { app } from "./app.js";
import { cargarConfig } from "./config/index.js";

const config = cargarConfig();

app.listen(config.puerto, () => {
  console.log(`Servidor del taller de motos (${config.entorno}) escuchando en el puerto ${config.puerto}`);
});
