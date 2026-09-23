const ORIGENES_PERMITIDOS = ["http://localhost:5173", "https://estudio-dibujo.example.com"];

/**
 * Opciones de cors: solo permite los origenes de la lista, y las peticiones
 * sin origen (curl, apps nativas, Postman).
 */
export const corsOptions = {
  origin(origin, callback) {
    if (!origin || ORIGENES_PERMITIDOS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origen no permitido por CORS"));
  },
};
