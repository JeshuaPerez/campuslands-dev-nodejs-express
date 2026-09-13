# Basico 06 - path y rutas seguras (Jeshua Perez)

Tematica: motos y mecanica.

## Que resuelve

Un servidor de manuales de taller que sirve archivos cuya ruta **la elige el
cliente**. Ese es justo el caso donde `path` deja de ser una utilidad comoda y
pasa a ser un asunto de seguridad.

La entrega incluye un archivo que no debe servirse nunca y un script que
demuestra, ejecutandolo, como una comprobacion mal hecha lo deja salir.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run dev        # con recarga
npm run rutas      # demo del ataque y de las defensas
npm test           # 36 pruebas
```

## El ataque de prefijo

La carpeta `publico-privado/` existe a proposito, al lado de `publico/`.
Su nombre **empieza por** el de la carpeta servible.

Una comprobacion que parece razonable:

```js
path.resolve(CARPETA_PUBLICA, entrada).startsWith(CARPETA_PUBLICA)
```

Con la entrada `../publico-privado/tarifas-internas.txt` devuelve `true`, porque
`.../publico-privado/...` literalmente empieza por `.../publico`. El archivo
interno sale por la API.

```bash
npm run rutas
```

```text
Entrada del cliente: ../publico-privado/tarifas-internas.txt
Comprobacion ingenua (startsWith sin separador): true  <- la deja pasar
Comprobacion buena: BLOQUEADA -> La ruta sale de la carpeta publica
```

La version correcta no compara textos, usa `path.relative`:

```js
export function estaDentroDe(base, destino) {
  const relativa = path.relative(base, destino);

  return relativa !== '' && !relativa.startsWith('..') && !path.isAbsolute(relativa);
}
```

Si para ir de la base al destino hay que subir, el destino esta fuera. Y punto.
Ambas funciones estan en el codigo y las pruebas las comparan: una prueba
afirma que la ingenua **si** deja pasar el ataque, para que quede documentado.

## Las capas de defensa

`resolverRutaPublica` aplica cinco comprobaciones en orden:

| # | Comprueba | Bloquea |
|---:|---|---|
| 1 | Tipo y contenido | entrada vacia, no textual |
| 2 | Byte nulo | `manual.txt\0.png`, que trunca cadenas en APIs de bajo nivel |
| 3 | Ruta absoluta | `/etc/passwd`, `C:\Windows\win.ini` |
| 4 | Resolucion + `estaDentroDe` | `../`, `..\`, y el ataque de prefijo |
| 5 | Lista blanca de extensiones | `.exe`, archivos sin extension |

Una lista blanca de extensiones es mas segura que una negra: lo que no esta
previsto se rechaza, en vez de intentar enumerar todo lo peligroso.

## 403 y 404 no son lo mismo

| Situacion | Status |
|---|---:|
| La ruta intentaba salirse o usa extension prohibida | 403 |
| La ruta es valida pero el archivo no existe | 404 |

Distinguirlos importa: un 403 en los logs senala un intento real de traversal,
un 404 solo un enlace roto.

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-06` | 200 | Respuesta del enunciado + estado del taller. |
| GET | `/basico/ejercicio-06/documentos` | 200 | Lista lo servible, recorriendo subcarpetas. |
| GET | `/basico/ejercicio-06/documentos/*ruta` | 200 / 403 / 404 | Lee un documento. |
| GET | `/basico/ejercicio-06/analizar?ruta=` | 200 / 403 | Descompone una ruta con `path`. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

El comodin se escribe `*ruta` porque en Express 5 los comodines llevan nombre y
llegan como arreglo de segmentos en `req.params.ruta`.

### Casos reales

```bash
curl http://localhost:3000/basico/ejercicio-06/documentos/informes/orden-1042.txt
# 200, contenido de la orden de servicio

curl "http://localhost:3000/basico/ejercicio-06/documentos/..%2Fpublico-privado%2Ftarifas-internas.txt"
# 403 {"ok":false,"message":"La ruta sale de la carpeta publica: ..."}

curl "http://localhost:3000/basico/ejercicio-06/documentos/manual.exe"
# 403 {"ok":false,"message":"Extension no permitida: .exe..."}

curl "http://localhost:3000/basico/ejercicio-06/documentos/otro.txt"
# 404 {"ok":false,"message":"No existe el documento: otro.txt"}
```

## El modulo path, de un vistazo

`GET /basico/ejercicio-06/analizar?ruta=informes/orden-1042.txt` aplica todas las
operaciones sobre la misma entrada:

| Operacion | Resultado en Windows |
|---|---|
| `join('publico', entrada)` | `publico\informes\orden-1042.txt` |
| `resolve(...)` | ruta absoluta desde la raiz |
| `normalize` | `informes\orden-1042.txt` |
| `dirname` | `informes` |
| `basename` | `orden-1042.txt` |
| `parse().name` | `orden-1042` |
| `extname` | `.txt` |
| `posix.normalize` | `informes/orden-1042.txt` |

`join` pega segmentos y normaliza; `resolve` produce una ruta absoluta.
`path.posix` y `path.win32` permiten forzar una notacion concreta, util para que
las rutas publicas sean iguales en todos los sistemas.

## Pruebas

```bash
npm test
```

```text
ℹ tests 36
ℹ suites 12
ℹ pass 36
ℹ fail 0
```

- **Normal**: archivo en la raiz y en subcarpeta, normalizacion de `./` y de
  barras invertidas, listado recursivo, descomposicion con `path`.
- **Limite**: la propia carpeta base no cuenta como "dentro", carpeta hermana
  con nombre que empieza igual, lista blanca de extensiones exacta.
- **Invalido**: entrada vacia o no textual, byte nulo, rutas absolutas de Unix y
  de Windows, traversal en sus variantes, extension prohibida, y la distincion
  403 contra 404.

## Estructura

```text
basico/ejercicio-06/resoluciones/jeshua-perez/
├── package.json
├── README.md
├── publico/                          # lo unico servible
│   ├── manual-cb500.txt
│   ├── ficha-mt07.txt
│   └── informes/orden-1042.txt
├── publico-privado/                  # NO servible, existe para el ataque
│   └── tarifas-internas.txt
├── scripts/demo-rutas.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── rutas.service.js          # validacion, estaDentroDe, describirRuta
│       └── manuales.service.js       # lectura y listado del taller
└── tests/
    ├── rutas.service.test.js
    ├── manuales.service.test.js
    └── ejercicio.routes.test.js
```
