import { app } from "./app.js";
import { config } from "./config/index.js";

app.listen(config.puerto, () => {
  console.log(`Servidor de ${config.nombreEstudio} (${config.entorno}) escuchando en el puerto ${config.puerto}`);
});
