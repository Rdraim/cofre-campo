<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Identidade Rdraim, apresentação gráfica, revisão de compatibilidade e guarda do histórico mais eficiente. API de runtime preservada.

Os métodos aceitam `{ contexto }` opcional, string estável de até 1024 bytes, autenticada via AAD. Decifrar/rotacionar exige o mesmo contexto. Contexto vazio preserva tokens anteriores; não evita replay no mesmo contexto. Não contém o contexto no token.

# 1.1.0 — 2026-10-07

Parsing estrito, autenticação na checagem de rotação e cópia defensiva da chave.

Documentação PT-BR/EN-US, apoio voluntário ainda sem canal de pagamento e verificações de publicação.
