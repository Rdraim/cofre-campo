# cofre-campo

[English (United States)](README.en-US.md) · [Apoio voluntário](SUPPORT.md)

## Revisão 1.1.0

Parsing estrito, autenticação na checagem de rotação e cópia defensiva da chave.

Chaves: Buffer de 32 bytes ou base64url canônico sem padding. Tokens `c1.id.payload` têm IV aleatório de 12 bytes, tag de 16 bytes e cabeçalho autenticado. Tokens malformados/adulterados lançam erro; `precisaRotacionar` também autentica. Não use para armazenar senha de login (use hashing apropriado). Guarde e faça backup das chaves fora do repositório. Não impede replay; sem contexto explícito também não impede troca de ciphertext entre registros. A aplicação deve controlar contexto e acesso. Não é compatível automaticamente com o formato de cifra do Nexus.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.1.0) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Cifra de **campo em repouso** com **AES-256-GCM** e **rotação de chave**, usando
só `node:crypto`. Para guardar um segredo (token, chave de API, dado sensível)
cifrado numa coluna/documento, sem amarrar o banco à chave.

AES-256-GCM dá confidencialidade **e** integridade: a decifragem **falha** se o
dado foi adulterado. O token carrega o id da chave usada, então você pode
**trocar a chave** sem reescrever tudo de uma vez.

## Instalação

```bash
git clone https://github.com/techrodrigo21-ux/cofre-campo.git
cd cofre-campo
npm test
```

## Uso

```js
import { Cofre, gerarChave } from './src/index.js';

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

## Manutenção e apoio

Código independente inspirado em problemas resolvidos no Nexus, projeto de Rodrigo Rodrigues. Não inclui banco, configuração privada, logs, dados de usuários ou credenciais. Evolução coordenada significa revisar mudanças relacionadas no mesmo ciclo; não há cópia automática de arquivos privados.

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md) · [Apoio voluntário](SUPPORT.md)

Referência oficial: https://nodejs.org/api/crypto.html


## Uso prático — 1.2.0

Os métodos aceitam `{ contexto }` opcional, string estável de até 1024 bytes, autenticada via AAD. Decifrar/rotacionar exige o mesmo contexto. Contexto vazio preserva tokens anteriores; não evita replay no mesmo contexto. Não contém o contexto no token.

Exemplo executável com dados sintéticos: `node examples/uso.mjs`.
