import { playRally } from "./services/rally.service.js";

const playerName = process.argv.length > 2 ? process.argv[2] : "Jugador 1";

console.log(`Sirviendo el punto para ${playerName}...`);

async function main() {
  try {
    const { result } = await playRally(playerName);
    console.log(result);
  } catch (error) {
    console.log(`Error en el rally: ${error.message}`);
  }
}

main();

console.log("Esta linea se imprime antes de que termine el rally");
