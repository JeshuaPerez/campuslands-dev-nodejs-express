export const configPorEntorno = {
  development: { logNivel: "debug", maxPartidasSimultaneas: 5 },
  test: { logNivel: "silent", maxPartidasSimultaneas: 1 },
  production: { logNivel: "warn" },
};
