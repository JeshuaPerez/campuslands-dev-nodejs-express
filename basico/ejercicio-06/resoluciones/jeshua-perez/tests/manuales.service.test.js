import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DocumentoNoEncontradoError,
  leerDocumento,
  listarDocumentos,
} from '../src/services/manuales.service.js';
import { RutaInseguraError } from '../src/services/rutas.service.js';

describe('listarDocumentos', () => {
  it('recorre subcarpetas y devuelve rutas con barras normales', async () => {
    const documentos = await listarDocumentos();
    const rutas = documentos.map((documento) => documento.ruta);

    assert.deepEqual(rutas, [
      'ficha-mt07.txt',
      'informes/orden-1042.txt',
      'manual-cb500.txt',
    ]);
  });

  it('nunca incluye la carpeta hermana privada', async () => {
    const documentos = await listarDocumentos();

    assert.ok(documentos.every((documento) => !documento.ruta.includes('privado')));
  });

  it('informa del tamano y la extension de cada documento', async () => {
    const documentos = await listarDocumentos();

    assert.ok(documentos.every((documento) => documento.bytes > 0));
    assert.ok(documentos.every((documento) => documento.extension === '.txt'));
  });
});

describe('leerDocumento - casos normales', () => {
  it('lee un documento de la raiz', async () => {
    const documento = await leerDocumento('manual-cb500.txt');

    assert.equal(documento.nombre, 'manual-cb500.txt');
    assert.match(documento.contenido, /Honda CB500F/);
    assert.equal(documento.lineas, 5);
  });

  it('lee un documento de una subcarpeta', async () => {
    const documento = await leerDocumento('informes/orden-1042.txt');

    assert.equal(documento.ruta, 'informes/orden-1042.txt');
    assert.match(documento.contenido, /Orden de servicio 1042/);
  });
});

describe('leerDocumento - casos invalidos', () => {
  it('lanza RutaInseguraError si la ruta se escapa', async () => {
    await assert.rejects(
      () => leerDocumento('../publico-privado/tarifas-internas.txt'),
      (error) => {
        assert.ok(error instanceof RutaInseguraError);
        assert.equal(error.statusCode, 403);
        return true;
      },
    );
  });

  it('lanza DocumentoNoEncontradoError si la ruta es valida pero no existe', async () => {
    await assert.rejects(() => leerDocumento('manual-inexistente.txt'), (error) => {
      assert.ok(error instanceof DocumentoNoEncontradoError);
      assert.equal(error.statusCode, 404);
      return true;
    });
  });

  it('distingue 403 de 404 segun el motivo', async () => {
    // Esta distincion importa: un 403 senala un intento de traversal, un 404
    // solo un archivo que no esta.
    await assert.rejects(() => leerDocumento('/etc/passwd'), RutaInseguraError);
    await assert.rejects(() => leerDocumento('otro.txt'), DocumentoNoEncontradoError);
  });
});
