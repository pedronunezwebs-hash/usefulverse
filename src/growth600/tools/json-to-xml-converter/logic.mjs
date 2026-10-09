export const JSON_XML_LIMITS = Object.freeze({ characters: 200_000, nodes: 20_000, depth: 64, arrayItems: 5_000 });

const XML_NAME = /^[A-Za-z_][A-Za-z0-9_.-]*$/u;

function fail(code) { throw new Error(code); }

function inspectJson(value) {
  const stack = [{ value, depth: 0 }];
  let nodes = 0;
  while (stack.length) {
    const { value: current, depth } = stack.pop();
    nodes += 1;
    if (nodes > JSON_XML_LIMITS.nodes) fail('too-many-nodes');
    if (depth > JSON_XML_LIMITS.depth) fail('too-deep');
    if (Array.isArray(current)) {
      if (current.length > JSON_XML_LIMITS.arrayItems) fail('too-many-array-items');
      for (const item of current) stack.push({ value: item, depth: depth + 1 });
    } else if (current && typeof current === 'object') {
      for (const item of Object.values(current)) stack.push({ value: item, depth: depth + 1 });
    }
  }
}

export function parseJsonXmlInput(text) {
  if (typeof text !== 'string') fail('empty-input');
  if (text.length > JSON_XML_LIMITS.characters) fail('too-large');
  if (!text.trim()) fail('empty-input');
  let value;
  try { value = JSON.parse(text); } catch { fail('invalid-json'); }
  inspectJson(value);
  return value;
}

function escapeXml(value, attribute = false) {
  const text = String(value);
  if (/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/u.test(text)) fail('invalid-xml-character');
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', attribute ? '&quot;' : '"').replaceAll("'", attribute ? '&apos;' : "'");
}

function assertName(name) {
  if (typeof name !== 'string' || !XML_NAME.test(name)) fail('invalid-xml-name');
  return name;
}

function scalarText(value) {
  if (value === null) return '';
  if (typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return String(value);
  fail('expected-scalar');
}

function renderElement(name, value, depth, indent) {
  assertName(name);
  const pad = ' '.repeat(depth * indent);
  if (Array.isArray(value)) return value.map((item) => renderElement(name, item, depth, indent)).join('\n');
  if (value === null || typeof value !== 'object') return `${pad}<${name}>${escapeXml(scalarText(value))}</${name}>`;

  const attributes = [];
  const children = [];
  let text = '';
  for (const [key, child] of Object.entries(value)) {
    if (key === '#text') { text = escapeXml(scalarText(child)); continue; }
    if (key.startsWith('@')) {
      const attributeName = assertName(key.slice(1));
      if (child === null || (typeof child === 'object')) fail('attribute-must-be-scalar');
      attributes.push(`${attributeName}="${escapeXml(scalarText(child), true)}"`);
      continue;
    }
    if (key.startsWith('#')) fail('unknown-reserved-key');
    if (Array.isArray(child) && child.length > JSON_XML_LIMITS.arrayItems) fail('too-many-array-items');
    children.push(renderElement(key, child, depth + 1, indent));
  }
  const open = `<${name}${attributes.length ? ` ${attributes.join(' ')}` : ''}>`;
  if (!children.length) return `${pad}${open}${text}</${name}>`;
  const body = text ? [`${' '.repeat((depth + 1) * indent)}${text}`, ...children] : children;
  return `${pad}${open}\n${body.join('\n')}\n${pad}</${name}>`;
}

export function convertJsonToXml(text, { rootName = 'root', indent = 2 } = {}) {
  const value = parseJsonXmlInput(text);
  assertName(rootName);
  if (![0, 2, 4].includes(indent)) fail('invalid-indent');
  const documentValue = Array.isArray(value) ? { item: value } : value;
  return `<?xml version="1.0" encoding="UTF-8"?>\n${renderElement(rootName, documentValue, 0, indent)}`;
}

function hasParserError(documentXml) {
  const errors = [...(documentXml?.getElementsByTagName?.('parsererror') ?? [])];
  return errors.some((element) => element.namespaceURI?.endsWith('mozilla.org/newlayout/xml/parsererror.xml')
    || element.textContent?.includes('This page contains the following errors:')
    || element.textContent?.includes('XML Parsing Error:'));
}

function validateXmlTree(root) {
  const stack = [{ node: root, depth: 0 }];
  let nodes = 0;
  while (stack.length) {
    const { node, depth } = stack.pop();
    if (node.nodeType !== 1) continue;
    nodes += 1;
    if (nodes > JSON_XML_LIMITS.nodes) fail('too-many-nodes');
    if (depth > JSON_XML_LIMITS.depth) fail('too-deep');
    for (const child of node.childNodes ?? []) if (child.nodeType === 1) stack.push({ node: child, depth: depth + 1 });
  }
}

function nodeToValue(element) {
  const attributes = [...(element.attributes ?? [])];
  const children = [...(element.childNodes ?? [])].filter((node) => node.nodeType === 1);
  const textNodes = [...(element.childNodes ?? [])].filter((node) => node.nodeType === 3 || node.nodeType === 4);
  const text = textNodes.map((node) => node.nodeValue ?? node.textContent ?? '').join('');
  if (!attributes.length && !children.length) return text;
  const output = {};
  for (const attribute of attributes) output[`@${attribute.name}`] = attribute.value;
  if (children.length) {
    if (text.trim()) output['#text'] = text.replace(/\s+/gu, ' ').trim();
    for (const child of children) {
      const key = child.nodeName;
      const value = nodeToValue(child);
      if (Object.hasOwn(output, key)) output[key] = Array.isArray(output[key]) ? [...output[key], value] : [output[key], value];
      else Object.defineProperty(output, key, { value, enumerable: true, configurable: true, writable: true });
    }
    return output;
  }
  if (text) output['#text'] = text;
  return output;
}

export function convertXmlToJson(text, { DOMParserImpl = globalThis.DOMParser } = {}) {
  if (typeof text !== 'string' || !text.trim()) fail('empty-input');
  if (text.length > JSON_XML_LIMITS.characters) fail('too-large');
  if (/<!\s*(?:DOCTYPE|ENTITY)\b/iu.test(text)) fail('doctype-blocked');
  if (typeof DOMParserImpl !== 'function') fail('xml-parser-unavailable');
  const documentXml = new DOMParserImpl().parseFromString(text, 'application/xml');
  if (hasParserError(documentXml)) fail('invalid-xml');
  const root = documentXml?.documentElement;
  if (!root || root.nodeType !== 1) fail('invalid-xml');
  validateXmlTree(root);
  return { [root.nodeName]: nodeToValue(root) };
}
