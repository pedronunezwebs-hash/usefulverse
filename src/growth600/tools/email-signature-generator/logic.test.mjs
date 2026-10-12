import assert from 'node:assert/strict';
import test from 'node:test';
import { createEmailSignature } from './logic.mjs';

test('renders an email-safe table signature with escaped identity and contact links', () => {
  const result = createEmailSignature({ fullName: 'A & <B>', jobTitle: 'Designer', organization: 'Studio', email: 'a@example.com', phone: '+1 (555) 010-2345', website: 'example.com', location: 'New York', accentColor: '#123abc' });
  assert.match(result.html, /A &amp; &lt;B&gt;/u);
  assert.match(result.html, /href="mailto:a@example\.com"/u);
  assert.match(result.html, /href="tel:\+15550102345"/u);
  assert.match(result.html, /href="https:\/\/example\.com\//u);
  assert.match(result.html, /role="presentation"/u);
  assert.doesNotMatch(result.html, /<script|onerror=/iu);
  assert.match(result.plainText, /Designer\nStudio\nNew York/u);
});

test('rejects javascript URLs, unsafe phone content and malformed email addresses', () => {
  assert.throws(() => createEmailSignature({ fullName: 'Sam', website: 'javascript:alert(1)' }), RangeError);
  assert.throws(() => createEmailSignature({ fullName: 'Sam', email: 'not an email' }), RangeError);
  assert.throws(() => createEmailSignature({ fullName: 'Sam', phone: '555<script>' }), RangeError);
});

test('logo image is constrained to small PNG, JPEG or GIF data URLs', () => {
  const result = createEmailSignature({ fullName: 'Sam', logoDataUrl: 'data:image/png;base64,aGVsbG8=', logoAlt: 'Company mark' });
  assert.match(result.html, /alt="Company mark"/u);
  assert.throws(() => createEmailSignature({ fullName: 'Sam', logoDataUrl: 'data:image/svg+xml;base64,PHN2Zy8+' }), RangeError);
  assert.throws(() => createEmailSignature({ fullName: 'Sam', logoDataUrl: `data:image/png;base64,${'A'.repeat(700000)}` }), RangeError);
});

test('requires a name and validates the accent color', () => {
  assert.throws(() => createEmailSignature({ fullName: ' ' }), RangeError);
  assert.throws(() => createEmailSignature({ fullName: 'Sam', accentColor: 'red' }), RangeError);
});
