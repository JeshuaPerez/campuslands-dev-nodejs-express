import { app, config } from "./app.js";

app.listen(config.puerto, () => {
  console.log(`Servidor battle royale (${config.entorno}) escuchando en el puerto ${config.puerto}`);
});
