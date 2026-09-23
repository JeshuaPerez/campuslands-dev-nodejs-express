import { playTrack } from "./services/track.service.js";

const trackName = process.argv.length > 2 ? process.argv[2] : "Bohemian Rhapsody";

console.log(`Cargando: ${trackName}...`);

playTrack(trackName)
  .then((mensaje) => console.log(mensaje))
  .catch((error) => console.log(`Error al reproducir: ${error.message}`));

console.log("Esta linea se imprime antes de que termine de cargar");
