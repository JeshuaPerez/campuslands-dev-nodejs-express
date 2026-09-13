/** Texto de ayuda del CLI. Un CLI sin --ayuda esta a medio hacer. */

export const COMANDOS = Object.freeze(['listar', 'buscar', 'resumen', 'ayuda']);

export function textoDeAyuda() {
  return `
concesionario - inventario de autos de lujo

USO
  node src/cli/index.js <comando> [opciones]

COMANDOS
  listar      Muestra el catalogo completo.
  buscar      Filtra el catalogo con las opciones de abajo.
  resumen     Estadisticas agregadas del inventario.
  ayuda       Muestra este texto.

OPCIONES
  -m, --marca <texto>       Filtra por marca.
  -p, --precio-max <n>      Precio maximo.
  -a, --anio-min <n>        Anio minimo.
  -d, --disponibles         Solo modelos con stock.
  -o, --ordenar <campo>     precio | anio | cv | stock | marca. Por defecto precio.
      --desc                Orden descendente.
  -l, --limite <n>          Cuantos resultados como maximo.
      --json                Salida en JSON en vez de tabla.
  -h, --ayuda               Muestra esta ayuda.

EJEMPLOS
  node src/cli/index.js listar
  node src/cli/index.js buscar --marca Ferrari
  node src/cli/index.js buscar -m Porsche -o cv --desc
  node src/cli/index.js buscar --precio-max=1000000000 --disponibles --json
  node src/cli/index.js resumen

CODIGOS DE SALIDA
  0  todo bien
  1  argumentos invalidos
  2  comando desconocido
`.trim();
}
