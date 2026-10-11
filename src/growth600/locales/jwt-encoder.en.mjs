export const jwtEncoderEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'JWT Encoder',
  title: 'JWT Encoder Free | UsefulVerse',
  description: 'Build and sign a JWT locally with HS256, HS384 or HS512. Free, no upload or account. Use test secrets only; not user authentication.',
  intro: 'Create a compact JSON Web Token from claims and sign it in this browser. Use this page for learning and test tokens, not production authentication.',
  howQuestion: 'How do I create and sign a JWT?',
  howAnswer: 'Enter a JSON object of claims, choose HS256, HS384 or HS512, and provide a test secret. Optionally add an expiration time. The browser creates the token locally; copy it only into a safe test environment.',
  privacyQuestion: 'Is my secret sent to a server?',
  privacyAnswer: 'No. Signing uses Web Crypto in this browser tab. The secret and claims are not uploaded or saved by this tool. Do not enter a production secret: browser extensions or a compromised device may still access page content.',
  fields: {
    algorithm: 'HMAC algorithm', claims: 'Claims as a JSON object', secret: 'Test signing secret', expiration: 'Expiration in minutes (optional)',
    token: 'Signed JWT', headerPreview: 'Header preview', claimsPreview: 'Claims preview', localNote: 'Signing runs locally in this browser; nothing is uploaded or stored.',
    securityNote: 'Use test data only. HMAC uses one shared secret for signing and verification. Never enter a production secret here.',
    purposeNote: 'This creates a token; it does not authenticate users, verify identities or replace a production identity provider.',
    secretLimit: 'Secret limit: 4 KiB. Claims limit: 192 KiB.',
  },
  actions: { sign: 'Create signed JWT', example: 'Load example', copy: 'Copy token', reset: 'Clear', result: 'Token' },
  messages: {
    signed: 'JWT created locally.', copied: 'Token copied.', copyUnavailable: 'Copy is unavailable in this browser.', checkInputs: 'Check the JSON, secret and expiration.',
    cryptoUnavailable: 'Web Crypto is unavailable. Use a current browser over HTTPS.', exampleLoaded: 'Example loaded. Replace the test secret before signing.', empty: 'Create a token first.',
  },
  additionalFaqs: [
    { question: 'Does creating a JWT log a user in?', answer: 'No. A signed token by itself does not authenticate anyone. A server must validate its signature, issuer, audience, expiration and application-specific rules.' },
    { question: 'Can I use my production secret here?', answer: 'No. Use only a disposable test secret. HMAC signing secrets are shared keys, and anyone who has the key can generate signatures. Keep production keys in a secure server-side secret manager.' },
    { question: 'Which algorithms are supported?', answer: 'This tool supports HS256, HS384 and HS512 only. It does not support asymmetric algorithms such as RS256 or ES256.' },
  ],
});
