export const rsaKeyGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'RSA Key Generator', title: 'RSA Key Generator Free | UsefulVerse',
  description: 'Generate RSA-OAEP keys and encrypt short text locally. Free and no account needed; private keys stay on this device.',
  intro: 'Create an RSA public/private key pair in this browser, inspect its SHA-256 fingerprint, and encrypt or decrypt short messages locally.',
  howQuestion: 'How do I create an RSA key pair?',
  howAnswer: 'Choose 2048 or 3072 bits and generate a pair. The public key uses SPKI PEM and the private key uses PKCS8 PEM. Save the private key safely; it is not uploaded or backed up.',
  privacyQuestion: 'Are my keys or messages uploaded?',
  privacyAnswer: 'No. Web Crypto generates and uses the keys in this browser. Your keys and messages are not uploaded or saved by this page.',
  fields: { keySize: 'RSA key size', bits2048: '2048 bits', bits3072: '3072 bits', accuracyNote: 'Local demonstration, not a certificate, trusted identity, key-storage service or security audit. Anyone with the private key can decrypt messages. Keep a secure backup; losing it can make ciphertext unrecoverable.', publicKey: 'Public key (SPKI PEM)', privateKey: 'Private key (PKCS8 PEM)', fingerprint: 'Public-key SHA-256 fingerprint', message: 'Short message to encrypt', ciphertext: 'Ciphertext (Base64)', decryptOutput: 'Decrypted message', maxBytes: 'Maximum plaintext bytes for this key and padding', encryptionNote: 'RSA-OAEP with SHA-256 only encrypts short messages: 190 UTF-8 bytes at 2048 bits or 318 bytes at 3072 bits. Use hybrid encryption for larger data.', privateKeyWarning: 'The private key is shown so you can save it. Do not share it or paste it into an untrusted site.' },
  actions: { generate: 'Generate key pair', encrypt: 'Encrypt message', decrypt: 'Decrypt message', copyPublic: 'Copy public key', copyPrivate: 'Copy private key', copyFingerprint: 'Copy fingerprint', copyCiphertext: 'Copy ciphertext', reset: 'Clear all' },
  messages: { generating: 'Generating keys locally…', generated: 'RSA key pair generated in this browser.', checkInputs: 'Check the key, message and selected size.', encrypted: 'Message encrypted locally.', decrypted: 'Message decrypted locally.', copied: 'Copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', cleared: 'Fields cleared.' },
  additionalFaqs: [
    { question: 'Can RSA encrypt a large file?', answer: 'No. RSA-OAEP is limited to short messages. This tool allows at most 190 UTF-8 bytes with a 2048-bit key or 318 bytes with a 3072-bit key. Larger files need a reviewed hybrid-encryption design.' },
    { question: 'Is a public key a certificate?', answer: 'No. An SPKI public key contains key material but does not prove who owns it. A SHA-256 fingerprint helps compare keys through a trusted separate channel.' },
    { question: 'What happens if I lose my private key?', answer: 'You may not be able to decrypt messages encrypted for that key. Save a backup somewhere you control before relying on the pair.' },
  ],
});
