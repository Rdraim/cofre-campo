import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cofre, gerarChave } from '../src/index.js';
test('contexto autentica campo/registro e impede troca de ciphertext', () => {
  const chaves = { a: gerarChave(), b: gerarChave() };
  const antigo = new Cofre({ chaves, atual: 'a' });
  const novo = new Cofre({ chaves, atual: 'b' });
  const opcoes = { contexto: 'example:record-1:field' };
  const token = antigo.cifrar('synthetic', opcoes);
  assert.equal(novo.decifrar(token, opcoes), 'synthetic');
  assert.throws(() => novo.decifrar(token));
  assert.throws(() => novo.decifrar(token, { contexto: 'example:record-2:field' }));
  assert.equal(novo.precisaRotacionar(token, opcoes), true);
  assert.equal(novo.decifrar(novo.reencriptar(token, opcoes), opcoes), 'synthetic');
  assert.equal(novo.decifrar(antigo.cifrar('legacy')), 'legacy');
  assert.throws(() => novo.cifrar('synthetic', { contexto: '😀'.repeat(257) }), TypeError);
});
