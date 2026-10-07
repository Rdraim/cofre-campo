// Exemplo sintético / Synthetic example. No production access.
import { Cofre, gerarChave } from '../src/index.js';
const cofre = new Cofre({ chaves: { demo: gerarChave() }, atual: 'demo' });
const opcoes = { contexto: 'example:record-1:field' };
const token = cofre.cifrar('synthetic', opcoes);
console.log(cofre.decifrar(token, opcoes));
