# 1.2.0 — 2026-10-07

Os métodos aceitam `{ contexto }` opcional, string estável de até 1024 bytes, autenticada via AAD. Decifrar/rotacionar exige o mesmo contexto. Contexto vazio preserva tokens anteriores; não evita replay no mesmo contexto. Não contém o contexto no token. / Methods accept optional `{ contexto }`, a stable string up to 1024 bytes authenticated with AAD. Decryption/rotation requires the same context. An empty context preserves older tokens; this does not prevent replay within the same context. The token does not contain the context.

# 1.1.0 — 2026-10-07

Parsing estrito, autenticação na checagem de rotação e cópia defensiva da chave. / Strict parsing, authenticated rotation checks and defensive key copying.

Documentação PT-BR/EN-US, apoio voluntário ainda sem canal de pagamento e verificações de publicação. / PT-BR/EN-US documentation, optional support with no payment channel, and publication checks.
