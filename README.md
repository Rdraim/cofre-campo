<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# cofre-campo

## Segurança e compatibilidade

Parsing estrito, autenticação na checagem de rotação e cópia defensiva da chave.

Chaves: Buffer de 32 bytes ou base64url canônico sem padding. Tokens `c1.id.payload` têm IV aleatório de 12 bytes, tag de 16 bytes e cabeçalho autenticado. Tokens malformados/adulterados lançam erro; `precisaRotacionar` também autentica. Não use para armazenar senha de login (use hashing apropriado). Guarde e faça backup das chaves fora do repositório. Não impede replay; sem contexto explícito também não impede troca de ciphertext entre registros. A aplicação deve controlar contexto e acesso. Não é compatível automaticamente com o formato de cifra do Nexus.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.2.1) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Cifra de **campo em repouso** com **AES-256-GCM** e **rotação de chave**, usando
só `node:crypto`. Para guardar um segredo (token, chave de API, dado sensível)
cifrado numa coluna/documento, sem amarrar o banco à chave.

AES-256-GCM dá confidencialidade **e** integridade: a decifragem **falha** se o
dado foi adulterado. O token carrega o id da chave usada, então você pode
**trocar a chave** sem reescrever tudo de uma vez.

## Instalação

```bash
git clone https://github.com/Rdraim/cofre-campo.git
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

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md)

Referência oficial: https://nodejs.org/api/crypto.html


## Uso prático — 1.2.0

Os métodos aceitam `{ contexto }` opcional, string estável de até 1024 bytes, autenticada via AAD. Decifrar/rotacionar exige o mesmo contexto. Contexto vazio preserva tokens anteriores; não evita replay no mesmo contexto. Não contém o contexto no token.

Exemplo executável com dados sintéticos: `node examples/uso.mjs`.

---

<p align="center">
  <img src="assets/support/banner-pt-br.svg" width="960" alt="Código aberto. Um café faz diferença. Apoie o trabalho de Rodrigo Rodrigues.">
</p>

## ☕ Me pague um café

Este projeto te ajudou a resolver um problema, aprender algo novo ou dar os primeiros passos no desenvolvimento? Se você sentir vontade de apoiar meu trabalho, um café é uma forma carinhosa de agradecer.

Sou **Rodrigo Rodrigues**, criador do **Nexus** e destes projetos de código aberto. Seu apoio me ajuda a dedicar tempo para melhorar o código, escrever exemplos mais claros e continuar compartilhando o que aprendo.

**Contribua com o valor que fizer sentido para você. O apoio é totalmente voluntário — o projeto continua gratuito sob a licença MIT.**

<p>
  <a href="#apoie-com-pix"><img src="assets/support/pix-pt-br.svg" width="190" height="44" alt="Apoiar com Pix"></a>
  <a href="https://github.com/Rdraim/cofre-campo/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou"><img src="assets/support/comment-pt-br.svg" width="210" height="44" alt="Deixar um comentário"></a>
</p>

### Apoie com Pix

No aplicativo do seu banco, escaneie o QR Code ou copie a chave Pix abaixo. Escolha o valor e confira os dados do destinatário antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Code Pix original fornecido por Rodrigo Rodrigues; a chave em texto abaixo é uma alternativa.">
</p>

**Chave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Você também pode apoiar compartilhando o projeto, relatando um problema, melhorando a documentação ou deixando um comentário.

### Seu comentário também faz diferença

[Conte como o projeto te ajudou](https://github.com/Rdraim/cofre-campo/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou). Vou gostar de saber o que você criou, o que aprendeu e o que poderia ficar mais claro para quem está começando.

O comentário é bem-vindo com ou sem doação. Preserve sua privacidade: não publique comprovantes, dados pessoais, credenciais ou informações de usuários nas Issues.

---

**Obrigado por apoiar meu trabalho e me ajudar a continuar criando e compartilhando. ❤️**
