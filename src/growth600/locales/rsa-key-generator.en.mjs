export const rsaKeyGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'RSA Key Generator',
  title: 'RSA Key Generator Free | UsefulVerse',
  description: 'Generate RSA-OAEP keys in your browser, export PEM and test short messages. Free, local and no upload; RSA is not for large files.',
  intro: 'Create an RSA-OAEP key pair in this browser, inspect its public-key fingerprint, and test a short message. Nothing is uploaded or saved by this tool.',
  howQuestion: 'How do I generate an RSA key pair?',
  howAnswer: 'Choose 2048, 3072 or 4096 bits and select Generate. The browser creates a public SPKI PEM and a private PKCS8 PEM. Copy or download either key only when you need it.',
  privacyQuestion: 'Are my keys uploaded or stored?',
  privacyAnswer: 'No. Web Crypto generates and uses the keys in this tab. The private key is displayed because you asked to create it; this page does not upload or persist it. Do not use a public browser tool for production secrets.',
  fields: {
    keySize: 'RSA key size', cryptoNote: 'Uses RSA-OAEP with SHA-256. Key generation may take a moment, especially at 4096 bits; a computer is recommended for that size.',
    privateKeyWarning: 'Treat the private key as a secret. Anyone who gets it may decrypt messages addressed to this key. This demo does not protect or save your key for you.',
    publicKey: 'Public key (SPKI PEM)', privateKey: 'Private key (PKCS8 PEM)', fingerprint: 'Public-key fingerprint (SHA-256)',
    demoTitle: 'Test a short message', demoMessage: 'Message to encrypt', demoHint: 'RSA-OAEP is for short messages only. With SHA-256, the limit is {limit} UTF-8 bytes for this key size; use hybrid encryption for larger data.',
    encryptedMessage: 'Encrypted message (Base64)', decryptedMessage: 'Decrypted message', algorithmNote: 'This is a local format and encryption demo, not a certificate, identity check, digital signature, or audited security product.',
  },
  actions: {
    generate: 'Generate key pair', copyPublic: 'Copy public key', downloadPublic: 'Download public key', copyPrivate: 'Copy private key', downloadPrivate: 'Download private key', copyFingerprint: 'Copy fingerprint',
    example: 'Load example', encrypt: 'Encrypt message', decrypt: 'Decrypt message', reset: 'Clear', result: 'Key and message tools',
  },
  messages: {
    generated: 'RSA key pair generated locally.', cryptoUnavailable: 'Web Crypto is unavailable. Use a current browser over HTTPS.', checkInputs: 'Check the message and selected key size.', noKey: 'Generate a key pair first.', copied: 'Copied to clipboard.', copyUnavailable: 'Clipboard is unavailable in this browser.', downloaded: 'Key file downloaded. Store it securely.', encrypted: 'Message encrypted locally.', decrypted: 'Message decrypted locally.', exampleLoaded: 'Example loaded.', reset: 'Cleared.', emptyCiphertext: 'Enter an encrypted message first.', busy: 'Generating RSA keys…',
  },
  additionalFaqs: [
    { question: 'How much text can RSA encrypt?', answer: 'Only a short message. RSA-OAEP with SHA-256 allows at most 190, 318 or 446 UTF-8 bytes for 2048-, 3072- or 4096-bit keys. RSA is not a file-encryption method; use a reviewed hybrid-encryption design for larger data.' },
    { question: 'What do SPKI and PKCS8 mean?', answer: 'SPKI is the standard SubjectPublicKeyInfo format used here for a public key. PKCS8 is the private-key container. Keep the PKCS8 private key confidential and make a secure backup yourself if you need one.' },
    { question: 'Does this create a trusted certificate or a digital signature?', answer: 'No. It creates an RSA-OAEP encryption key pair for a small demonstration. It does not issue certificates, prove identity, create signatures, or make a key trusted.' },
    { question: 'Is this suitable for production encryption?', answer: 'This page is a learning and interoperability demo, not an audited cryptographic application. Do not paste real secrets into a public computer, and do not rely on this page to manage or safeguard production keys.' },
  ],
});
