import test from 'node:test';
import assert from 'node:assert/strict';
import { convertJsonToXml, convertXmlToJson, JSON_XML_LIMITS, parseJsonXmlInput } from './logic.mjs';

function element(name, { attributes = [], children = [] } = {}) {
  return { nodeType: 1, nodeName: name, attributes, childNodes: children };
}
function text(value, nodeType = 3) { return { nodeType, nodeValue: value }; }
function parserFor(documentXml) { return class { parseFromString() { return documentXml; } }; }

test('JSON objects, attributes, text and repeated array entries produce escaped XML', () => {
  const xml = convertJsonToXml('{"person":{"@id":"a&b","name":"Ana <B>","tag":["one","two"]}}', { rootName: 'people' });
  assert.match(xml, /<people>/u);
  assert.match(xml, /<person id="a&amp;b">/u);
  assert.match(xml, /<name>Ana &lt;B&gt;<\/name>/u);
  assert.equal((xml.match(/<tag>/gu) ?? []).length, 2);
  assert.match(xml, /<tag>one<\/tag>[\s\S]*<tag>two<\/tag>/u);
});

test('top-level JSON arrays stay valid XML by using the selected root and repeated item children', () => {
  const xml = convertJsonToXml('["first","second"]', { rootName: 'records' });
  assert.match(xml, /<records>\n  <item>first<\/item>\n  <item>second<\/item>\n<\/records>/u);
});

test('JSON converter preserves numeric/boolean lexical values and documents null as empty content', () => {
  const xml = convertJsonToXml('{"n":2.5,"ok":true,"missing":null}', { indent: 0 });
  assert.match(xml, /<n>2\.5<\/n>/u);
  assert.match(xml, /<ok>true<\/ok>/u);
  assert.match(xml, /<missing><\/missing>/u);
});

test('XML output rejects characters forbidden by XML 1.0 instead of producing malformed markup', () => {
  assert.throws(() => convertJsonToXml('{"x":"bad\\u0000value"}'), { message: 'invalid-xml-character' });
  assert.throws(() => convertJsonToXml('{"x":"unpaired \\ud800"}'), { message: 'invalid-xml-character' });
});

test('JSON parsing validates syntax, supported root names, size and bounded complexity', () => {
  assert.throws(() => parseJsonXmlInput('{bad}'), /invalid-json/u);
  assert.throws(() => convertJsonToXml('{}', { rootName: 'bad name' }), /invalid-xml-name/u);
  assert.throws(() => parseJsonXmlInput(' '.repeat(JSON_XML_LIMITS.characters + 1)), /too-large/u);
  assert.throws(() => parseJsonXmlInput(JSON.stringify(Array(JSON_XML_LIMITS.arrayItems + 1).fill(0))), /too-many-array-items/u);
  const deep = `${'{"a":'.repeat(JSON_XML_LIMITS.depth + 2)}0${'}'.repeat(JSON_XML_LIMITS.depth + 2)}`;
  assert.throws(() => parseJsonXmlInput(deep), /too-deep/u);
});

test('XML conversion groups repeated child elements into arrays and maps attributes to @ keys', () => {
  const childA = element('item', { attributes: [{ name: 'id', value: 'a' }], children: [text('first')] });
  const childB = element('item', { attributes: [{ name: 'id', value: 'b' }], children: [text('second')] });
  const root = element('items', { attributes: [{ name: 'source', value: 'test' }], children: [text('\n  '), childA, text('\n  '), childB, text('\n')] });
  const converted = convertXmlToJson('<items/>', { DOMParserImpl: parserFor({ documentElement: root }) });
  assert.deepEqual(converted, { items: { '@source': 'test', item: [{ '@id': 'a', '#text': 'first' }, { '@id': 'b', '#text': 'second' }] } });
});

test('XML names that overlap JavaScript object prototype properties remain ordinary JSON keys', () => {
  const root = element('root', { children: [element('__proto__', { children: [text('kept')] })] });
  const result = convertXmlToJson('<root/>', { DOMParserImpl: parserFor({ documentElement: root }) });
  assert.equal(Object.hasOwn(result.root, '__proto__'), true);
  assert.equal(result.root.__proto__, 'kept');
});

test('XML text, CDATA, mixed content and a single child are handled with declared string mapping', () => {
  const root = element('root', { children: [text('hello '), text('& world', 4)] });
  assert.deepEqual(convertXmlToJson('<root/>', { DOMParserImpl: parserFor({ documentElement: root }) }), { root: 'hello & world' });
  const mixed = element('root', { children: [text(' hello '), element('child', { children: [text('value')] }), text(' ignored whitespace ') ] });
  const result = convertXmlToJson('<root/>', { DOMParserImpl: parserFor({ documentElement: mixed }) });
  assert.deepEqual(result, { root: { '#text': 'hello ignored whitespace', child: 'value' } });
});

test('XML parser errors, DTD/entity declarations, missing parser and oversized documents fail closed', () => {
  const parserError = { nodeType: 1, namespaceURI: 'http://www.mozilla.org/newlayout/xml/parsererror.xml', textContent: 'bad' };
  const invalidDocument = { getElementsByTagName: (name) => name === 'parsererror' ? [parserError] : [], documentElement: element('parsererror') };
  assert.throws(() => convertXmlToJson('<broken>', { DOMParserImpl: parserFor(invalidDocument) }), /invalid-xml/u);
  assert.throws(() => convertXmlToJson('<!DOCTYPE root [<!ENTITY x "bad">]><root>&x;</root>', { DOMParserImpl: parserFor({}) }), /doctype-blocked/u);
  assert.throws(() => convertXmlToJson('<root/>', { DOMParserImpl: null }), /xml-parser-unavailable/u);
  assert.throws(() => convertXmlToJson('x'.repeat(JSON_XML_LIMITS.characters + 1)), /too-large/u);
});

test('XML traversal enforces depth and node-count limits', () => {
  let root = element('n'); let current = root;
  for (let depth = 0; depth < JSON_XML_LIMITS.depth + 1; depth += 1) { const next = element('n'); current.childNodes.push(next); current = next; }
  assert.throws(() => convertXmlToJson('<n/>', { DOMParserImpl: parserFor({ documentElement: root }) }), /too-deep/u);
});
