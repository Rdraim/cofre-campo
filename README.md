# cofre-campo

Cifra de **campo em repouso** com **AES-256-GCM** e **rotação de chave**, usando
só `node:crypto`. Para guardar um segredo (token, chave de API, dado sensível)
cifrado numa coluna/documento, sem amarrar o banco à chave.

AES-256-GCM dá confidencialidade **e** integridade: a decifragem **falha** se o
dado foi adulterado. O token carrega o id da chave usada, então você pode
**trocar a chave** sem reescrever tudo de uma vez.

## Instalação

```bash
npm install cofre-campo
```

## Uso

```js
import { Cofre, gerarChave } from 'cofre-campo';

// gere a chave uma vez e guarde na variável de ambiente (nunca no código):
//   COFRE_V1=<saída de gerarChave()>
const cofre = new Cofre({ chaves: { v1: process.env.COFRE_V1 }, atual: 'v1' });

const token = cofre.cifrar('token-super-secreto'); // "c1.v1.<base64url>"
cofre.decifrar(token);                              // 'token-super-secreto'
```

### Rotação de chave

```js
const cofre = new Cofre({
  chaves: { v1: process.env.COFRE_V1, v2: process.env.COFRE_V2 },
  atual: 'v2',               // cifra novo com v2, ainda lê os v1
});

if (cofre.precisaRotacionar(token)) token = cofre.reencriptar(token);
```

## API

- `gerarChave()` → chave AES-256 (32 bytes) em base64url.
- `new Cofre({ chaves, atual })` — `chaves` é um mapa `id → chave`; `atual` é o id de cifragem.
- `cofre.cifrar(texto)` → token string.
- `cofre.decifrar(token)` → texto (lança se adulterado ou chave ausente).
- `cofre.precisaRotacionar(token)` → `true` se não foi cifrado com a chave atual.
- `cofre.reencriptar(token)` → recifra com a chave atual.

> Cifra em repouso protege o dado **no banco/arquivo**, não substitui TLS no
> transporte nem controle de acesso. Guarde as chaves fora do código (variável de
> ambiente / cofre de segredos) e faça backup delas — perdeu a chave, perdeu o dado.

## Testes

```bash
npm test
```

## Licença

MIT © Rodrigo Rodrigues
