import { EXAMPLE_CERTIFICATE_PEM } from '../tools/certificate-decoder/example.mjs';

const certificateDecoderEnglishCopySource = {
  copyLanguage: 'en', name: 'X.509 Certificate Decoder', title: 'X.509 Certificate Decoder Free | UsefulVerse',
  description: 'Decode an X.509 PEM or DER certificate locally. Inspect subject, issuer, dates, SANs and SHA-256 fingerprint. No upload or account.',
  intro: 'Inspect an X.509 certificate on this device. Paste a PEM/base64 certificate or choose a PEM, CER, CRT or DER file to read its subject, issuer, validity dates, alternative names and SHA-256 fingerprint.',
  howQuestion: 'How do I decode an X.509 certificate?',
  howAnswer: 'Paste one PEM certificate or base64-encoded DER, or select a local PEM, CER, CRT or DER file. The decoder displays certificate fields and a SHA-256 fingerprint in your browser.',
  privacyQuestion: 'Is my certificate uploaded?',
  privacyAnswer: 'No. The selected certificate is read and decoded in this browser. It is not sent to a server. Files are limited to 1 MiB.',
  exampleCertificate: '-----BEGIN CERTIFICATE-----\nMIICnzCCAgigAwIBAgIUVuuIZFGbWwPYvXIIpJkqA1yqWDkwDQYJKoZIhvcNAQEL\nBQAwPTEgMB4GA1UEAwwXZml4dHVyZS5leGFtcGxlLmludmFsaWQxGTAXBgNVBAoM\nEFVzZWZ1bFZlcnNlIFRlc3QwHhcNMjYxMDA5MDYwODIxWhcNMjcxMDA5MDYwODIx\nWjA9MSAwHgYDVQQDDBdmaXh0dXJlLmV4YW1wbGUuaW52YWxpZDEZMBcGA1UECgwQ\nVXNlZnVsVmVyc2UgVGVzdDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAqgto\nQF9NkHw3Pa35sSQBcP29cJlRhXeOqHZ2tLqzpcAJdr89wrQ1ePDsviDCfGCNuOQf\ns1/Le2aXlA15UWwsHCHPs4HoQyb3ZmlCfP3rUlV+2DjLpt8yKUM9kGIWugChMGaj\nRjQ5ptjsUjLQHoe6YNHf2fNPu7GVVjo/13crF6UCAwEAAaOBmzCBmDAdBgNVHQ4E\nFgQUGYcHtvodMrJC0vOkX3pB0tDYQrQwHwYDVR0jBBgwFoAUGYcHtvodMrJC0vOk\nX3pB0tDYQrQwDwYDVR0TAQH/BAUwAwEB/zBFBgNVHREEPjA8ghdmaXh0dXJlLmV4\namwbHd3LmZpeHR1cmUuZXhhbXBsZS5pbnZhbGlkhwTAAAIBMA0GCSqGSIb3DQEB\nCwUAA4GBAI3w2gZRhqDG3PHrpV2A7/ByuE/7l8Z24uO44RchUbqo+rpCS8GeiPZC\nU6dXir6XvdTbpkRxhX6PBzYvgJTZ1EFgjoh6wey8YT4lG/cX9QatjzEY996UYqgc\nvqFQxrpMBSsXRRo6+VqbPWo4fQ+MEcsv06RiJEm9BaDWYPHDrGDo\n-----END CERTIFICATE-----',
  fields: {
    certificate: 'Certificate (PEM or base64 DER)', upload: 'Choose a local certificate file', supported: 'PEM, CER, CRT and DER files are supported. Maximum size: 1 MiB.', accuracyNote: 'Decoding does not verify a signature, trust chain, hostname, revocation status or whether a site is safe. Dates alone do not establish trust.', resultTitle: 'Certificate details', subject: 'Subject', issuer: 'Issuer', commonName: 'Common name', organizationName: 'Organization', countryName: 'Country', localityName: 'Locality', stateOrProvinceName: 'State or province', organizationalUnitName: 'Organizational unit', streetAddress: 'Street address', serialNumber: 'Serial number', notBefore: 'Not valid before (UTC)', notAfter: 'Not valid after (UTC)', alternativeNames: 'Subject alternative names', fingerprint: 'SHA-256 fingerprint', noAlternativeNames: 'No supported alternative names found.', unlistedAttribute: 'Other attribute',
  },
  actions: { decode: 'Decode certificate', example: 'Load example', copySummary: 'Copy summary', reset: 'Clear' },
  messages: { decoded: 'Certificate fields decoded locally.', invalid: 'This input is not a supported, complete X.509 certificate.', invalidPem: 'Paste one PEM certificate or base64-encoded DER data.', tooLarge: 'The certificate exceeds the 1 MiB limit.', fingerprintUnavailable: 'SHA-256 fingerprint is unavailable in this browser context.', copied: 'Summary copied.', copyUnavailable: 'Clipboard is not available in this browser.', exampleLoaded: 'Synthetic example certificate loaded.' },
  additionalFaqs: [
    { question: 'Does decoding prove that a certificate is trusted?', answer: 'No. This tool reads certificate fields only. It does not validate signatures, issuer chains, hostnames, revocation status or browser trust.' },
    { question: 'Can I decode a DER certificate?', answer: 'Yes. Choose a local DER file. You can also paste its base64-encoded DER representation.' },
    { question: 'What does the SHA-256 fingerprint identify?', answer: 'It is a digest of the certificate file bytes, useful for comparing copies. It is not a trust or safety verdict.' },
  ],
};

certificateDecoderEnglishCopySource.exampleCertificate = EXAMPLE_CERTIFICATE_PEM;
export const certificateDecoderEnglishCopy = Object.freeze(certificateDecoderEnglishCopySource);
