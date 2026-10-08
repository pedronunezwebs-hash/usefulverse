import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_SCHEMA_MARKUP_CHARS, validateSchemaMarkup } from './logic.mjs';

const vocabulary = { version: '30.1', types: ['Thing', 'Organization', 'Person', 'PostalAddress'], properties: ['name', 'url', 'address', 'streetAddress', 'sameAs'] };

test('validates a nested JSON-LD graph and checks known Schema.org terms', () => {
  const source = JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', name: 'UsefulVerse', url: 'https://example.com', address: { '@type': 'PostalAddress', streetAddress: '1 Main St' } },
      { '@type': 'Person', name: 'A user', sameAs: [] },
    ],
  });
  assert.deepEqual(validateSchemaMarkup(source, vocabulary), {
    jsonValid: true, vocabularyVersion: '30.1', entityCount: 3, typesChecked: 3, propertiesChecked: 6, issues: [],
  });
});

test('returns a blocking syntax error instead of treating invalid JSON as valid', () => {
  const result = validateSchemaMarkup('{\n  "@context": "https://schema.org",\n  "@type": ]\n}', vocabulary);
  assert.equal(result.jsonValid, false);
  assert.equal(result.issues[0].code, 'invalid-json');
  assert.match(result.issues[0].message, /Invalid JSON/u);
});

test('reports unknown Schema.org types and properties as warnings, not hard semantic errors', () => {
  const result = validateSchemaMarkup('{"@context":"https://schema.org","@type":"MadeUpThing","madeUpProperty":"x"}', vocabulary);
  assert.equal(result.jsonValid, true);
  assert.deepEqual(result.issues.map(({ code, severity }) => [code, severity]), [
    ['unknown-type', 'warning'], ['unknown-property', 'warning'],
  ]);
});

test('recognizes a declared Schema.org prefix and @vocab aliases', () => {
  const prefixed = validateSchemaMarkup('{"@context":{"s":"https://schema.org/"},"@type":"s:Thing","s:name":"A"}', vocabulary);
  assert.equal(prefixed.typesChecked, 1);
  assert.equal(prefixed.propertiesChecked, 1);
  assert.deepEqual(prefixed.issues, []);
  const vocab = validateSchemaMarkup('{"@context":{"@vocab":"https://schema.org/"},"@type":"Thing","name":"A"}', vocabulary);
  assert.equal(vocab.typesChecked, 1);
  assert.equal(vocab.propertiesChecked, 1);
});

test('does not flag terms from a non-Schema.org remote context it cannot resolve offline', () => {
  const result = validateSchemaMarkup('{"@context":"https://example.com/context.jsonld","@type":"Thing","name":"A"}', vocabulary);
  assert.equal(result.jsonValid, true);
  assert.equal(result.typesChecked, 0);
  assert.equal(result.propertiesChecked, 0);
});

test('accepts an object or an array root, while reporting non-object JSON roots', () => {
  assert.equal(validateSchemaMarkup('[{"@context":"https://schema.org","@type":"Thing"}]', vocabulary).entityCount, 1);
  const result = validateSchemaMarkup('"text"', vocabulary);
  assert.equal(result.jsonValid, true);
  assert.equal(result.issues[0].code, 'root-not-object');
});

test('valid JSON without typed entities gets an informational result', () => {
  const result = validateSchemaMarkup('{"name":"No type"}', vocabulary);
  assert.equal(result.jsonValid, true);
  assert.equal(result.entityCount, 0);
  assert.equal(result.issues[0].severity, 'info');
});

test('caps pasted input before parsing and rejects malformed vocabulary data', () => {
  assert.throws(() => validateSchemaMarkup(' '.repeat(MAX_SCHEMA_MARKUP_CHARS + 1), vocabulary), RangeError);
  assert.throws(() => validateSchemaMarkup('{}', { ...vocabulary, version: 'latest' }), /versioned Schema.org vocabulary/u);
});
