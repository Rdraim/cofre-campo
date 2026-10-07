<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# cofre-campo

Cifrado autenticado de campos con AES-256-GCM e identificadores de clave para rotación gradual. Solo Node.js.

## Empezá acá

Necesitás Git y Node.js 22+ para las pruebas. Sin dependencias de ejecución. Descargá este repositorio; no instales un paquete homónimo sin verificar del registro npm.

```sh
git clone https://github.com/techrodrigo21-ux/cofre-campo.git
cd cofre-campo
npm test
node tools/check-public-content.mjs
```

Las importaciones del ejemplo funcionan desde la raíz del repositorio clonado. Para usar el módulo en otro proyecto, fijá una revisión Git (tag v1.2.0) o copiá el módulo conservando la licencia MIT. Esta documentación no afirma que exista una publicación en el registro npm.

```js
import { Cofre, gerarChave } from './src/index.js';
// Demo sintética en memoria. Guardá las claves de forma segura en una aplicación real.
const cofre = new Cofre({ chaves: { v1: gerarChave() }, atual: 'v1' });
const encrypted = cofre.cifrar('ejemplo sintético');
console.log(cofre.decifrar(encrypted));
```

## API

`gerarChave()`; `new Cofre({ chaves, atual })`; `cifrar`, `decifrar`, `precisaRotacionar`, `reencriptar`.

Los nombres públicos de funciones y opciones se mantienen en portugués por compatibilidad.

## Comportamiento y límites

Las claves son Buffers de 32 bytes o cadenas base64url canónicas sin relleno. Los tokens `c1.id.payload` contienen un IV aleatorio de 12 bytes, una etiqueta de 16 bytes y una cabecera autenticada. Los tokens alterados o mal formados generan errores; `precisaRotacionar` también autentica. No uses cifrado reversible para contraseñas de acceso. Guardá las claves y sus copias de respaldo fuera del repositorio. El formato no evita la repetición de mensajes; sin contexto explícito tampoco evita sustituir ciphertext entre registros. Aplicá contexto y controles de acceso. No es automáticamente compatible con el formato de cifrado de Nexus.

## Seguridad y compatibilidad

Análisis estricto, comprobaciones autenticadas de rotación y copias defensivas de las claves.

## Uso práctico — 1.2.0

Los métodos aceptan `{ contexto }`, una cadena estable de hasta 1024 bytes autenticada con AAD. Descifrar o rotar exige el mismo contexto. Un contexto vacío conserva la compatibilidad con tokens anteriores; no impide repetir mensajes dentro del mismo contexto. El token no contiene el contexto.

Ejemplo ejecutable con datos sintéticos: `node examples/uso.mjs`.

## Mantenimiento

Estos módulos independientes se inspiran en problemas resueltos en Nexus, proyecto de Rodrigo Rodrigues. No incluyen bases privadas, configuración de despliegue, logs, credenciales ni registros de usuarios. El mantenimiento coordinado consiste en revisar cambios relacionados en el mismo ciclo; no copia automáticamente archivos privados.

[Cómo contribuir](CONTRIBUTING.md) · [Seguridad](SECURITY.md)

MIT © Rodrigo Rodrigues

Referencia oficial: https://nodejs.org/api/crypto.html

---

<p align="center">
  <img src="assets/support/banner-es-ar.svg" width="960" alt="Código abierto. Un café suma. Apoyá el trabajo de Rodrigo Rodrigues.">
</p>

## ☕ Invitame un café

¿Este proyecto te ayudó a resolver un problema, aprender algo nuevo o dar tus primeros pasos en desarrollo? Si querés apoyar mi trabajo, un café es una linda forma de agradecer.

Soy **Rodrigo Rodrigues**, creador de **Nexus** y de estos proyectos de código abierto. Tu aporte me ayuda a dedicar tiempo a mejorar el código, escribir ejemplos más claros y seguir compartiendo lo que aprendo.

**Aportá el monto que tenga sentido para vos. El apoyo es totalmente voluntario; el proyecto sigue siendo gratuito bajo la licencia MIT.**

[Apoyá con Pix](#apoyá-con-pix) · [Dejá un comentario](https://github.com/techrodrigo21-ux/cofre-campo/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3)

### Apoyá con Pix

En la app de tu banco, escaneá el QR o copiá la clave Pix de abajo. Elegí el monto y revisá los datos del destinatario antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Pix original proporcionado por Rodrigo Rodrigues; también podés usar la clave de texto de abajo.">
</p>

**Clave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Pix es el sistema de pagos de Brasil. Si tu banco no lo admite, también podés ayudar compartiendo el proyecto, reportando un problema, mejorando la documentación o dejando un comentario.

### Tu comentario también suma

[Contame cómo te ayudó el proyecto](https://github.com/techrodrigo21-ux/cofre-campo/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3). Me gustaría saber qué creaste, qué aprendiste y qué podría ser más claro para quienes recién empiezan.

Los comentarios son bienvenidos con o sin donación. Cuidá tu privacidad: no publiques comprobantes de pago, datos personales, credenciales ni información privada de usuarios en las Issues.

**Gracias por apoyar mi trabajo y ayudarme a seguir creando y compartiendo. ❤️**
