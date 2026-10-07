import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cofre, gerarChave } from '../src/index.js';

test('cifra e decifra ida e volta', () => {
  const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
  const token = cofre.cifrar('minha-senha-secreta');
  assert.ok(token.startsWith('c1.v1.'));
  assert.equal(cofre.decifrar(token), 'minha-senha-secreta');
});

test('cada cifragem é diferente (IV aleatório), mas decifra igual', () => {
  const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
  const a = cofre.cifrar('x'); const b = cofre.cifrar('x');
  assert.notEqual(a, b);
  assert.equal(cofre.decifrar(a), 'x');
});

test('adulteração é detectada (GCM)', () => {
  const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
  const token = cofre.cifrar('dado');
  const corpo = token.split('.')[2];
  const mexido = `c1.v1.${corpo.slice(0, -2)}${corpo.slice(-2) === 'AA' ? 'AB' : 'AA'}`;
  assert.throws(() => cofre.decifrar(mexido));
});

test('rotação de chave: decifra antiga, recifra na atual', () => {
  const v1 = gerarChave(), v2 = gerarChave();
  const antigo = new Cofre({ chaves: { v1 }, atual: 'v1' });
  const token1 = antigo.cifrar('segredo');

  const novo = new Cofre({ chaves: { v1, v2 }, atual: 'v2' });
  assert.equal(novo.decifrar(token1), 'segredo');       // ainda lê a antiga
  assert.equal(novo.precisaRotacionar(token1), true);
  const token2 = novo.reencriptar(token1);
  assert.ok(token2.startsWith('c1.v2.'));
  assert.equal(novo.decifrar(token2), 'segredo');
  assert.equal(novo.precisaRotacionar(token2), false);
});

test('recusa chave de tamanho errado e config inválida', () => {
  assert.throws(() => new Cofre({ chaves: { v1: 'MTIz' }, atual: 'v1' })); // 3 bytes
  assert.throws(() => new Cofre({ chaves: { v1: gerarChave() }, atual: 'v9' }));
  assert.throws(() => gerarChave() && new Cofre({}));
});

test('gerarChave produz 32 bytes', () => {
  assert.equal(Buffer.from(gerarChave(), 'base64url').length, 32);
});
