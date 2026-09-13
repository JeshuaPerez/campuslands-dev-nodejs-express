/** Punto de entrada HTTP. */

const { crearApp } = require('./app');

const PUERTO = Number(process.env.PORT || 3000);

// `require.main === module` es el "main" de CommonJS: solo es cierto cuando
// este archivo se ejecuto directamente, no cuando alguien lo requiere.
if (require.main === module) {
  crearApp().listen(PUERTO, () => {
    console.log(`Servidor MOBA escuchando en http://localhost:${PUERTO}`);
    console.log('Endpoint principal: GET /basico/ejercicio-03');
  });
}
