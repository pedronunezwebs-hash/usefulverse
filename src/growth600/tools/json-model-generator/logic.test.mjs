import assert from 'node:assert/strict';
import test from 'node:test';
import { generateJsonModels, inferJsonModels, JSON_MODEL_LIMITS } from './logic.mjs';

test('TypeScript preserves explicit null unions and marks fields missing from sample objects optional', () => {
  const code = generateJsonModels('[{"name":null},{"name":"Ada","score":9.5,"active":true}]', { rootName: 'Person' });
  assert.match(code, /root is an array/u);
  assert.match(code, /export interface Person/u);
  assert.match(code, /name: string \| null;/u);
  assert.match(code, /score\?: number;/u);
  assert.match(code, /active\?: boolean;/u);
});

test('C# and Java use valid nullable/reference-friendly model declarations and retain nested arrays', () => {
  const input = '[{"name":null,"tags":["new"],"count":1},{"name":"Ada","count":2}]';
  const csharp = generateJsonModels(input, { language: 'csharp', rootName: 'Person' });
  assert.match(csharp, /^#nullable enable/mu);
  assert.match(csharp, /public string\? Name \{ get; set; \}/u);
  assert.match(csharp, /public List<string>\? Tags \{ get; set; \}/u);
  assert.match(csharp, /public long Count \{ get; set; \}/u);
  assert.match(csharp, /Optional in some sample objects/u);
  const java = generateJsonModels(input, { language: 'java', rootName: 'Person' });
  assert.doesNotMatch(java, /^import\s/mu);
  assert.match(java, /public java\.util\.List<String> tags;/u);
  assert.match(java, /Nullable in the JSON sample/u);
  assert.match(java, /Optional in the JSON sample/u);
});

test('nested model names do not collide with the root type and unusual JSON keys remain represented', () => {
  const code = generateJsonModels('{"person":{"class":1,"bad-key":true}}', { rootName: 'Person' });
  assert.match(code, /export interface Person2/u);
  assert.match(code, /export interface Person \{/u);
  assert.match(code, /"bad-key": boolean;/u);
  assert.match(code, /class: number;/u);
});

test('C# and Java normalize property names without creating collisions after punctuation removal', () => {
  const input = '{"foo-bar":1,"foo bar":2,"class":3}';
  const csharp = generateJsonModels(input, { language: 'csharp' });
  assert.match(csharp, /long FooBar \{ get; set; \}/u);
  assert.match(csharp, /long FooBar2 \{ get; set; \}/u);
  const java = generateJsonModels(input, { language: 'java' });
  assert.match(java, /Long fooBar;/u);
  assert.match(java, /Long fooBar2;/u);
  assert.match(java, /Long class_;/u);
});

test('scalar roots and primitive root arrays still produce a wrapper model in each target language', () => {
  for (const language of ['typescript', 'csharp', 'java']) {
    const scalar = generateJsonModels('"hello"', { language, rootName: 'Response' });
    const array = generateJsonModels('[1,2,3]', { language, rootName: 'Response' });
    assert.ok(scalar.length > 0, language);
    assert.ok(array.length > 0, language);
    assert.match(scalar, /value/iu, language);
    assert.match(array, /List|Array/u, language);
  }
});

test('heterogeneous samples remain explicit in TypeScript and use documented object fallbacks elsewhere', () => {
  const input = '[{"value":"x"},{"value":3}]';
  assert.match(generateJsonModels(input), /value: string \| number;/u);
  assert.match(generateJsonModels(input, { language: 'csharp' }), /public object\? Value/u);
  assert.match(generateJsonModels(input, { language: 'java' }), /public Object value;/u);
});

test('JSON parsing, byte, depth, node, root-array and model-name limits fail with stable errors', () => {
  assert.throws(() => inferJsonModels(''), /emptyInput/u);
  assert.throws(() => inferJsonModels('{'), /invalidJson/u);
  assert.throws(() => inferJsonModels('x'.repeat(JSON_MODEL_LIMITS.inputBytes + 1)), /tooLarge/u);
  assert.throws(() => inferJsonModels('[]'), /emptyRootArray/u);
  assert.throws(() => generateJsonModels('{"x":1}', { language: 'rust' }), /invalidLanguage/u);
  assert.throws(() => generateJsonModels('{"x":1}', { rootName: 'A'.repeat(49) }), /nameTooLong/u);
  let deep = '1'; for (let index = 0; index <= JSON_MODEL_LIMITS.depth; index += 1) deep = `[${deep}]`;
  assert.throws(() => inferJsonModels(deep), /tooDeep/u);
});

test('array inference samples a bounded prefix and still handles ordinary empty nested arrays', () => {
  const input = JSON.stringify({ items: Array.from({ length: 400 }, (_, index) => ({ id: index })) });
  const result = inferJsonModels(input);
  assert.ok(result.definitions.some(({ properties }) => properties.some(({ key }) => key === 'id')));
  assert.match(generateJsonModels('{"items":[]}'), /items: Array<unknown>/u);
});
