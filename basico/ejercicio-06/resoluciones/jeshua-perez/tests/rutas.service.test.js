import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

import {
  CARPETA_PUBLICA,
  EXTENSIONES_PERMITIDAS,
  RutaInseguraError,
  describirRuta,
  estaDentroDe,
  pareceSeguraIngenuo,
  resolverRutaPublica,
} from '../src/services/rutas.service.js';

describe('resolverRutaPublica - casos normales', () => {
  it('acepta un archivo de la raiz publica', () => {
    const ruta = resolverRutaPublica('manual-cb500.txt');

    assert.equal(path.basename(ruta), 'manual-cb500.txt');
    assert.ok(ruta.startsWith(CARPETA_PUBLICA));
  });

  it('acepta un archivo en subcarpeta', () => {
    const ruta = resolverRutaPublica('informes/orden-1042.txt');

    assert.equal(path.basename(ruta), 'orden-1042.txt');
    assert.equal(path.basename(path.dirname(ruta)), 'informes');
  });

  it('normaliza el prefijo ./ y las barras invertidas', () => {
    const conPunto = resolverRutaPublica('./ficha-mt07.txt');
    const conBarra = resolverRutaPublica('informes\\orden-1042.txt');

    assert.equal(path.basename(conPunto), 'ficha-mt07.txt');
    assert.equal(path.basename(conBarra), 'orden-1042.txt');
  });

  it('acepta las tres extensiones de la lista blanca', () => {
    assert.deepEqual(EXTENSIONES_PERMITIDAS, ['.txt', '.json', '.md']);
  });
});

describe('el ataque de prefijo', () => {
  const ataque = '../publico-privado/tarifas-internas.txt';

  it('la comprobacion ingenua lo deja pasar', () => {
    // Documenta la vulnerabilidad: "publico-privado" empieza por "publico",
    // asi que startsWith sin separador devuelve true.
    assert.equal(pareceSeguraIngenuo(ataque), true);
  });

  it('la comprobacion buena lo bloquea', () => {
    assert.throws(() => resolverRutaPublica(ataque), RutaInseguraError);
  });

  it('estaDentroDe distingue la carpeta hermana', () => {
    const hermana = path.resolve(CARPETA_PUBLICA, '..', 'publico-privado', 'x.txt');
    const dentro = path.resolve(CARPETA_PUBLICA, 'informes', 'x.txt');

    assert.equal(estaDentroDe(CARPETA_PUBLICA, hermana), false);
    assert.equal(estaDentroDe(CARPETA_PUBLICA, dentro), true);
  });

  it('estaDentroDe rechaza la propia carpeta base', () => {
    assert.equal(estaDentroDe(CARPETA_PUBLICA, CARPETA_PUBLICA), false);
  });
});

describe('resolverRutaPublica - casos invalidos', () => {
  it('rechaza entradas vacias o no textuales', () => {
    assert.throws(() => resolverRutaPublica(''), RutaInseguraError);
    assert.throws(() => resolverRutaPublica('   '), RutaInseguraError);
    assert.throws(() => resolverRutaPublica(undefined), RutaInseguraError);
    assert.throws(() => resolverRutaPublica(42), RutaInseguraError);
  });

  it('rechaza el byte nulo', () => {
    assert.throws(
      () => resolverRutaPublica('manual-cb500.txt\0.png'),
      /byte nulo/,
    );
  });

  it('rechaza rutas absolutas de Unix y de Windows', () => {
    assert.throws(() => resolverRutaPublica('/etc/passwd'), /absolutas/);
    assert.throws(() => resolverRutaPublica('C:\\Windows\\win.ini'), /absolutas/);
  });

  it('rechaza el salto de carpeta en sus variantes', () => {
    assert.throws(() => resolverRutaPublica('../../../../etc/passwd'), RutaInseguraError);
    assert.throws(() => resolverRutaPublica('..\\publico-privado\\x.txt'), RutaInseguraError);
    assert.throws(
      () => resolverRutaPublica('informes/../../publico-privado/tarifas-internas.txt'),
      RutaInseguraError,
    );
  });

  it('rechaza extensiones fuera de la lista blanca', () => {
    assert.throws(() => resolverRutaPublica('manual-cb500.exe'), /Extension no permitida/);
    assert.throws(() => resolverRutaPublica('sin-extension'), /Extension no permitida/);
  });

  it('expone statusCode 403 en el error de ruta', () => {
    assert.throws(() => resolverRutaPublica('/etc/passwd'), (error) => {
      assert.equal(error.statusCode, 403);
      return true;
    });
  });
});

describe('describirRuta', () => {
  it('descompone la ruta con el modulo path', () => {
    const info = describirRuta('informes/orden-1042.txt');

    assert.equal(info.dirname, 'informes');
    assert.equal(info.basename, 'orden-1042.txt');
    assert.equal(info.nombreSinExtension, 'orden-1042');
    assert.equal(info.extension, '.txt');
    assert.equal(info.esAbsoluta, false);
  });

  it('siempre devuelve la version posix con barras normales', () => {
    const info = describirRuta('informes\\orden-1042.txt');

    assert.equal(info.comoPosix, 'informes/orden-1042.txt');
  });

  it('rechaza una entrada vacia', () => {
    assert.throws(() => describirRuta(''), RutaInseguraError);
  });
});
