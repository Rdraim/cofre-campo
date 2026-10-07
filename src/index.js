/* ============================================================================
   cofre-campo — cifra de campo em repouso com AES-256-GCM e rotação de chave.

   Para guardar um segredo (token, chave de API, dado sensível) cifrado numa
   coluna/documento, sem amarrar o banco à chave. AES-256-GCM garante
   confidencialidade E integridade (a decifragem falha se o dado foi adulterado).

   O token carrega o identificador da chave usada, então você pode TROCAR a chave
   (rotação) sem reescrever tudo de uma vez: cifra com a nova, decifra as antigas.

   Só `node:crypto`. Nada de senha em claro, nada de chave no código.
   ============================================================================ */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const VERSAO = 'c1';
const b64 = (buf) => Buffer.from(buf).toString('base64url');
const deB64 = (s) => {
  if (typeof s !== 'string' || !/^[A-Za-z0-9_-]+$/.test(s)) throw new Error('base64url inválido');
  const buf = Buffer.from(s, 'base64url');
  if (b64(buf) !== s) throw new Error('base64url não canônico');
  return buf;
};
const partesToken = (token) => {
  if (typeof token !== 'string') throw new Error('token inválido');
  const partes = token.split('.');
  if (partes.length !== 3 || partes[0] !== VERSAO || !idValido(partes[1])) throw new Error('token inválido');
  const bruto = deB64(partes[2]);
  if (bruto.length < 28) throw new Error('token truncado');
  return { id: partes[1], bruto };
};

/** Gera uma chave AES-256 (32 bytes) em base64url, pronta para a variável de ambiente. */
export function gerarChave() { return b64(randomBytes(32)); }

const normalizarChave = (v) => {
  const buf = Buffer.isBuffer(v) ? Buffer.from(v) : deB64(v);
  if (buf.length !== 32) throw new Error('chave AES-256 precisa ter 32 bytes');
  return buf;
};
const idValido = (id) => /^[A-Za-z0-9_-]{1,32}$/.test(id);

export class Cofre {
  /**
   * @param {object} cfg
   * @param {Record<string,string|Buffer>} cfg.chaves  mapa id -> chave (32 bytes)
   * @param {string} cfg.atual  id da chave usada para CIFRAR
   */
  constructor({ chaves, atual } = {}) {
    if (!chaves || !atual) throw new Error('informe { chaves, atual }');
    if (!idValido(atual) || !Object.hasOwn(chaves, atual)) throw new Error('chave "atual" ausente ou id inválido');
    this.chaves = Object.fromEntries(Object.entries(chaves).map(([id, k]) => {
      if (!idValido(id)) throw new Error(`id de chave inválido: ${id}`);
      return [id, normalizarChave(k)];
    }));
    this.atual = atual;
  }

  /** Cifra um texto. Devolve "c1.<idChave>.<base64url(iv|tag|cifra)>". */
  cifrar(texto) {
    const chave = this.chaves[this.atual];
    const iv = randomBytes(12);
    const aad = Buffer.from(`${VERSAO}.${this.atual}`);
    const cipher = createCipheriv('aes-256-gcm', chave, iv);
    cipher.setAAD(aad);
    const dados = Buffer.concat([cipher.update(String(texto), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${VERSAO}.${this.atual}.${b64(Buffer.concat([iv, tag, dados]))}`;
  }

  /** Decifra um token. Lança se foi adulterado ou se a chave não está presente. */
  decifrar(token) {
    const { id, bruto } = partesToken(token);
    const chave = Object.hasOwn(this.chaves, id) ? this.chaves[id] : null;
    if (!chave) throw new Error(`chave "${id}" não disponível para decifrar`);
    const iv = bruto.subarray(0, 12);
    const tag = bruto.subarray(12, 28);
    const dados = bruto.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', chave, iv);
    decipher.setAAD(Buffer.from(`${VERSAO}.${id}`));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(dados), decipher.final()]).toString('utf8');
  }

  /** True se o token foi cifrado com uma chave diferente da atual (candidato a rotação). */
  precisaRotacionar(token) { const { id } = partesToken(token); this.decifrar(token); return id !== this.atual; }

  /** Decifra e cifra de novo com a chave atual (rotação de chave). */
  reencriptar(token) { return this.cifrar(this.decifrar(token)); }
}

export default Cofre;
