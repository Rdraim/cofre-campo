import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cofre, gerarChave } from '../src/index.js';
test('rejeita sufixos, tokens truncados e codificações não canônicas', () => {
  const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
  const t = cofre.cifrar('');
  assert.equal(cofre.decifrar(t), '');
  for (const errado of [t + '.extra', t + '=', t + '!', 'c1.v1.AA', 'c1.v1.', null]) {
    assert.throws(() => cofre.decifrar(errado));
    assert.throws(() => cofre.precisaRotacionar(errado));
  }
});
test('copia Buffer da chave e autentica cabeçalho', () => {
  const chave = Buffer.alloc(32, 7);
  const cofre = new Cofre({ chaves: { v1: chave, v2: Buffer.alloc(32, 7) }, atual: 'v1' });
  chave.fill(8);
  const t = cofre.cifrar('fixture');
  assert.equal(cofre.decifrar(t), 'fixture');
  assert.throws(() => cofre.decifrar(t.replace('c1.v1.', 'c1.v2.')));
});
