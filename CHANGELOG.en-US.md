<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Rdraim identity, visual presentation, compatibility review and more efficient history guard. Runtime API preserved.

Methods accept optional `{ contexto }`, a stable string up to 1024 bytes authenticated with AAD. Decryption/rotation requires the same context. An empty context preserves older tokens; this does not prevent replay within the same context. The token does not contain the context.

# 1.1.0 — 2026-10-07

Strict parsing, authenticated rotation checks and defensive key copying.

PT-BR/EN-US documentation, optional support with no payment channel, and publication checks.
