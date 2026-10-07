# cofre-campo

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.md)

Authenticated field encryption using AES-256-GCM and key IDs for gradual rotation. Node.js only.

## Start here

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/cofre-campo.git
cd cofre-campo
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { Cofre, gerarChave } from './src/index.js';
// Synthetic in-memory demo. Persist keys securely in a real application.
const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
const encrypted = cofre.cifrar('synthetic example');
console.log(cofre.decifrar(encrypted));
```

## API

`gerarChave()`; `new Cofre({ chaves, atual })`; `cifrar`, `decifrar`, `precisaRotacionar`, `reencriptar`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

Keys are 32-byte Buffers or canonical unpadded base64url strings. Tokens `c1.id.payload` contain a random 12-byte IV, a 16-byte tag and an authenticated header. Malformed or tampered tokens throw; `precisaRotacionar` also authenticates. Do not use reversible encryption for login passwords. Store and back up keys outside the repository. This format does not prevent replay; without an explicit context it also does not prevent ciphertext substitution across records. Enforce application context and access controls. It is not automatically compatible with the Nexus encryption format.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Version 1.1.0

Strict parsing, authenticated rotation checks and defensive key copying.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.md)

MIT © Rodrigo Rodrigues

Official reference: https://nodejs.org/api/crypto.html


## Practical use — 1.2.0

Methods accept optional `{ contexto }`, a stable string up to 1024 bytes authenticated with AAD. Decryption/rotation requires the same context. An empty context preserves older tokens; this does not prevent replay within the same context. The token does not contain the context.

Runnable example with synthetic data: `node examples/uso.mjs`.
