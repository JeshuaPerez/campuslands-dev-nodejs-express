import { loadMarathon } from "./services/movie.service.js";

const primera = process.argv.length > 2 ? process.argv[2] : "It";
const segunda = process.argv.length > 3 ? process.argv[3] : "The Conjuring";

async function main() {
  try {
    console.log("Preparando maraton de terror...");
    const resultados = await loadMarathon(primera, segunda);
    resultados.forEach((mensaje) => console.log(mensaje));
  } catch (error) {
    console.log(`Error en la maraton: ${error.message}`);
  }
}

main();
