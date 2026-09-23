/**
 * En una app real esto llamaria a un servidor externo de partidas (matchmaking).
 * Se exporta como objeto (no funcion suelta) porque los exports nombrados de
 * ESM son de solo lectura y node:test no puede redefinirlos con mock.method;
 * un metodo de objeto si se puede reemplazar.
 */
export const servidorPartidasClient = {
  async buscarSala(region) {
    return { id: `sala-${region}`, jugadores: 8, region };
  },
};
