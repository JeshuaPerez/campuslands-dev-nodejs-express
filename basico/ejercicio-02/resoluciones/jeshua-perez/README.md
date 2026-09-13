# Basico 02 - npm scripts y package.json (Jeshua Perez)

Tematica: shooters competitivos.

## Que resuelve

El tema del ejercicio es el manifiesto y sus scripts, asi que aqui el
`package.json` no es solo configuracion: **es el dato de negocio**. La API lo lee
del disco y expone sus scripts documentados, y los propios scripts de npm
demuestran hooks, composicion y paso de argumentos.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start              # dispara prestart y levanta la API
npm run dev            # con recarga (node --watch)
npm test               # 27 pruebas con el runner nativo
npm run validar        # reporte de scripts + pruebas
```

## Los scripts, que es el tema del ejercicio

| Invocacion | Comando | Para que sirve |
|---|---|---|
| `npm start` | `node src/server.js` | Levanta la API. |
| `npm run prestart` | `node scripts/verificar-entorno.js` | **Se ejecuta solo** antes de `start`. |
| `npm run dev` | `node --watch src/server.js` | Recarga al guardar. |
| `npm run scripts:listar` | `node scripts/reporte-scripts.js` | Imprime esta tabla por consola. |
| `npm run loadout` | `node scripts/generar-loadout.js` | Genera un loadout. Admite argumentos. |
| `npm test` | `node --test` | Bateria de pruebas. |
| `npm run test:watch` | `node --test --watch` | Pruebas en modo watch. |
| `npm run validar` | `npm run scripts:listar && npm test` | Composicion de dos scripts. |

Cuatro detalles de npm que la entrega demuestra en codigo:

1. **Hook `prestart`**: npm lo ejecuta automaticamente antes de `start`. Si sale
   con codigo distinto de 0, `start` nunca corre. `scripts/verificar-entorno.js`
   aborta si Node es menor que 20.
2. **Variables `npm_package_*`**: npm vuelca el manifiesto en el entorno.
   `verificar-entorno.js` lee `npm_package_name` y `npm_package_version` sin
   abrir ningun archivo.
3. **Campo `config`**: `config.puerto` llega al proceso como
   `npm_package_config_puerto` y `src/server.js` lo usa como puerto por defecto.
4. **Argumentos con `--`**: todo lo que va despues del separador llega al script.

```bash
npm run loadout -- AWP agresivo
```

```text
┌───────────────────┬─────────────────┐
│ armaPrincipal     │ 'AWP'           │
│ tipo              │ 'francotirador' │
│ estilo            │ 'agresivo'      │
│ danoEfectivo      │ 127             │
│ costeTotal        │ 5350            │
│ creditosRestantes │ 2650            │
└───────────────────┴─────────────────┘
```

`npm start` encadenado con su hook:

```text
> basico-ejercicio-02-jeshua-perez@1.2.0 prestart
> node scripts/verificar-entorno.js
Verificando entorno de basico-ejercicio-02-jeshua-perez v1.2.0
Node v24.15.0 cumple el minimo (>= 20). Arrancando...
> basico-ejercicio-02-jeshua-perez@1.2.0 start
> node src/server.js
Servidor de shooters escuchando en http://localhost:3000
```

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-02` | 200 | Respuesta del enunciado + resumen del manifiesto. |
| GET | `/basico/ejercicio-02/scripts` | 200 | Los scripts del package.json, documentados. |
| GET | `/basico/ejercicio-02/armas` | 200 | Catalogo de armas y estilos. |
| POST | `/basico/ejercicio-02/loadouts` | 201 / 400 | Arma un loadout validando la entrada. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

### GET /basico/ejercicio-02

```json
{
  "ok": true,
  "message": "Ejercicio ejecutado correctamente",
  "topic": "npm scripts y package.json",
  "paquete": {
    "nombre": "basico-ejercicio-02-jeshua-perez",
    "version": "1.2.0",
    "tipoModulo": "module",
    "nodeRequerido": ">=20",
    "dependencias": ["express"],
    "totalScripts": 8
  }
}
```

### POST /basico/ejercicio-02/loadouts

```bash
curl -X POST http://localhost:3000/basico/ejercicio-02/loadouts \
  -H "Content-Type: application/json" \
  -d '{"armaPrincipal":"AWP","estilo":"agresivo","granadas":3}'
```

```json
{
  "ok": true,
  "message": "Loadout creado correctamente",
  "data": {
    "armaPrincipal": "AWP", "tipo": "francotirador", "estilo": "agresivo",
    "granadas": 3, "danoEfectivo": 127, "movilidad": 115, "utilidad": 60,
    "costeTotal": 5650, "creditosRestantes": 2350
  }
}
```

Entrada invalida (400):

```json
{ "ok": false, "message": "Arma no disponible. Usa una de: AK-47, M4A1-S, AWP, MP9, Desert." }
```

## Reglas de validacion

| Campo | Regla | Si falla |
|---|---|---|
| `armaPrincipal` | obligatoria, una de las 5 del catalogo, no distingue mayusculas | 400 |
| `estilo` | opcional, `agresivo` / `tactico` / `apoyo`, por defecto `tactico` | 400 |
| `granadas` | opcional, entero de 0 a 4, por defecto 2 | 400 |
| coste total | no puede superar los 8000 creditos | 400 |

## Pruebas

```bash
npm test
```

```text
ℹ tests 27
ℹ suites 11
ℹ pass 27
ℹ fail 0
```

- **Normal**: valores por defecto, coste, ajuste por estilo, normalizacion, y el
  producto de las 5 armas por los 3 estilos.
- **Limite**: 0 y 4 granadas, y el loadout mas caro sin pasarse del presupuesto.
- **Invalido**: sin argumentos, arma vacia o desconocida, estilo inexistente,
  granadas -1 / 5 / 1.5; y por HTTP los 400 y el 404.

Ademas se comprueba que el servicio lee el manifiesto real y que marca `start` y
`test` como invocables sin `run`.

## Estructura

```text
basico/ejercicio-02/resoluciones/jeshua-perez/
├── package.json                      # el tema del ejercicio: scripts, config, engines
├── README.md
├── scripts/
│   ├── verificar-entorno.js          # hook prestart, lee npm_package_*
│   ├── reporte-scripts.js            # tabla de scripts por consola
│   └── generar-loadout.js            # CLI con argumentos tras --
├── src/
│   ├── app.js
│   ├── server.js                     # puerto desde PORT o npm_package_config_puerto
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── package-info.service.js   # lee y resume el propio package.json
│       └── loadout.service.js        # reglas del dominio shooter
└── tests/
    ├── package-info.service.test.js
    ├── loadout.service.test.js
    └── ejercicio.routes.test.js
```

La consola y la API comparten `package-info.service.js`, asi nunca se
contradicen sobre como se invoca un script.
