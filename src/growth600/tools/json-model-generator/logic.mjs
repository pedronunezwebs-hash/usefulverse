export const JSON_MODEL_LIMITS = Object.freeze({ inputBytes: 500_000, nodes: 30_000, depth: 24, arraySamples: 300 });

function fail(code) { throw new Error(code); }
function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function pascal(value) {
  const words = String(value).match(/[A-Za-z0-9]+/gu) ?? [];
  let result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  if (!result) result = 'Model';
  if (/^\d/u.test(result)) result = `Model${result}`;
  return result;
}
function camel(value) { const result = pascal(value); return result.charAt(0).toLowerCase() + result.slice(1); }

function parseDocument(text) {
  if (typeof text !== 'string' || !text.trim()) fail('emptyInput');
  if (new TextEncoder().encode(text).byteLength > JSON_MODEL_LIMITS.inputBytes) fail('tooLarge');
  let value;
  try { value = JSON.parse(text); } catch { fail('invalidJson'); }
  return value;
}

function infer(values, name, depth, context) {
  context.nodes += 1;
  if (context.nodes > JSON_MODEL_LIMITS.nodes) fail('tooManyValues');
  if (depth > JSON_MODEL_LIMITS.depth) fail('tooDeep');
  const hasNull = values.some((value) => value === null);
  const nonNull = values.filter((value) => value !== null);
  if (!nonNull.length) return { kind: 'null', nullable: true };
  const kinds = new Set(nonNull.map((value) => Array.isArray(value) ? 'array' : isObject(value) ? 'object' : typeof value));
  if (kinds.size > 1) {
    const members = [];
    for (const kind of kinds) {
      const memberValues = nonNull.filter((value) => (Array.isArray(value) ? 'array' : isObject(value) ? 'object' : typeof value) === kind);
      members.push(infer(memberValues, name, depth, context));
    }
    if (hasNull) members.push({ kind: 'null', nullable: true });
    return { kind: 'union', members };
  }
  const kind = [...kinds][0];
  if (kind === 'object') {
    const typeName = context.uniqueName(name);
    const keys = [...new Set(nonNull.flatMap((value) => Object.keys(value)))];
    const properties = keys.map((key) => {
      const present = nonNull.filter((value) => Object.hasOwn(value, key));
      return { key, optional: present.length !== nonNull.length, type: infer(present.map((value) => value[key]), key, depth + 1, context) };
    });
    return { kind: 'object', typeName, properties, nullable: hasNull };
  }
  if (kind === 'array') {
    const samples = nonNull.flat().slice(0, JSON_MODEL_LIMITS.arraySamples);
    const item = samples.length ? infer(samples, `${name}Item`, depth + 1, context) : { kind: 'unknown' };
    return { kind: 'array', item, nullable: hasNull };
  }
  return { kind: kind === 'number' ? (nonNull.some((value) => !Number.isInteger(value)) ? 'decimal' : 'integer') : kind, nullable: hasNull };
}

function makeContext() {
  const used = new Set();
  return { nodes: 0, uniqueName(name) { const base = pascal(name); let candidate = base; let suffix = 2; while (used.has(candidate.toLowerCase())) candidate = `${base}${suffix++}`; used.add(candidate.toLowerCase()); return candidate; } };
}

export function inferJsonModels(text, rootName = 'Root') {
  const value = parseDocument(text); const context = makeContext();
  const rootArray = Array.isArray(value);
  if (rootArray && value.length === 0) fail('emptyRootArray');
  const rootSamples = rootArray ? value.slice(0, JSON_MODEL_LIMITS.arraySamples) : [value];
  const modelArray = rootArray && rootSamples.length > 0 && rootSamples.every(isObject);
  const root = modelArray ? infer(rootSamples, rootName, 0, context) : infer([value], rootName, 0, context);
  if (root.kind !== 'object') {
    const wrapper = context.uniqueName(rootName);
    const wrappedRoot = { kind: 'object', typeName: wrapper, properties: [{ key: rootArray ? 'items' : 'value', optional: false, type: root }] };
    const definitions = [];
    function collectWrapped(node) {
      if (node.kind === 'union') { node.members.forEach(collectWrapped); return; }
      if (node.kind === 'array') { collectWrapped(node.item); return; }
      if (node.kind !== 'object') return;
      node.properties.forEach(({ type }) => collectWrapped(type)); definitions.push(node);
    }
    collectWrapped(wrappedRoot);
    return { root: wrappedRoot, definitions, arrayOfRoot: false };
  }
  const definitions = [];
  function collect(node) {
    if (node.kind === 'union') { node.members.forEach(collect); return; }
    if (node.kind === 'array') { collect(node.item); return; }
    if (node.kind !== 'object') return;
    node.properties.forEach(({ type }) => collect(type)); definitions.push(node);
  }
  collect(root);
  return { root, definitions, arrayOfRoot: modelArray };
}

function tsType(node) {
  if (node.kind === 'union') return [...new Set(node.members.map(tsType))].join(' | ');
  if (node.kind === 'null') return 'null';
  const base = node.kind === 'string' || node.kind === 'boolean' || node.kind === 'integer' || node.kind === 'decimal'
    ? (node.kind === 'integer' || node.kind === 'decimal' ? 'number' : node.kind)
    : node.kind === 'object' ? node.typeName
      : node.kind === 'array' ? `Array<${tsType(node.item)}>` : 'unknown';
  return node.nullable ? `${base} | null` : base;
}
function csType(node, optional = false) {
  if (node.kind === 'union') {
    const nonNull = node.members.filter((member) => member.kind !== 'null');
    const names = [...new Set(nonNull.map((member) => csType(member).replace(/\?$/u, '')))];
    return names.length === 1 ? `${names[0]}${node.members.some((member) => member.kind === 'null') || optional ? '?' : ''}` : 'object?';
  }
  if (node.kind === 'null') return 'object?';
  let base;
  if (node.kind === 'array') base = `List<${csType(node.item)}>`;
  else if (node.kind === 'object') base = node.typeName;
  else base = ({ string: 'string', boolean: 'bool', integer: 'long', decimal: 'double', unknown: 'object' })[node.kind] ?? 'object';
  return (optional || node.nullable) && !base.endsWith('?') ? `${base}?` : base;
}
function javaType(node) {
  if (node.kind === 'union') {
    const types = [...new Set(node.members.filter((member) => member.kind !== 'null').map(javaType))];
    return types.length === 1 ? types[0] : 'Object';
  }
  if (node.kind === 'array') return `java.util.List<${javaType(node.item)}>`;
  if (node.kind === 'object') return node.typeName;
  return ({ string: 'String', boolean: 'Boolean', integer: 'Long', decimal: 'Double', null: 'Object', unknown: 'Object' })[node.kind] ?? 'Object';
}
function tsProperty(key) { return /^[A-Za-z_$][\w$]*$/u.test(key) ? key : JSON.stringify(key); }
function javaProperty(key) { const value = camel(key); return new Set(['class','public','private','static','final','void','int','long','double','float','boolean','char','byte','short','new','return','package','import','interface','enum','extends','implements','this','null','true','false']).has(value) ? `${value}_` : value; }
function uniqueProperty(key, convert, used) {
  const base = convert(key); let candidate = base; let suffix = 2;
  while (used.has(candidate)) candidate = `${base}${suffix++}`;
  used.add(candidate); return candidate;
}

export function generateJsonModels(text, { language = 'typescript', rootName = 'Root' } = {}) {
  if (!['typescript', 'csharp', 'java'].includes(language)) fail('invalidLanguage');
  const cleanName = pascal(rootName);
  if ([...cleanName].length > 48) fail('nameTooLong');
  const schema = inferJsonModels(text, cleanName);
  if (language === 'typescript') {
    const code = schema.definitions.map((node) => `export interface ${node.typeName} {\n${node.properties.map(({ key, optional, type }) => `  ${tsProperty(key)}${optional ? '?' : ''}: ${tsType(type)};`).join('\n')}\n}`).join('\n\n');
    return schema.arrayOfRoot ? `// The JSON root is an array; each item matches this interface.\n${code}` : code;
  }
  if (language === 'csharp') {
    const lines = ['#nullable enable', 'using System.Collections.Generic;', '', ...(schema.arrayOfRoot ? ['// The JSON root is a list of this model.'] : []), `public class ${schema.root.typeName}`, '{'];
    for (const node of schema.definitions) {
      if (node !== schema.root) { lines.push(`    public class ${node.typeName}`, '    {'); }
      const indent = node === schema.root ? '    ' : '        ';
      const usedProperties = new Set();
      for (const { key, optional, type } of node.properties) {
        if (optional) lines.push(`${indent}// Optional in some sample objects.`);
        const property = uniqueProperty(key, pascal, usedProperties);
        lines.push(`${indent}public ${csType(type, optional)} ${property} { get; set; }`);
      }
      if (node !== schema.root) lines.push('    }');
    }
    lines.push('}'); return lines.join('\n');
  }
  const lines = [...(schema.arrayOfRoot ? ['// The JSON root is a list of this model.'] : []), `public class ${schema.root.typeName} {`];
  for (const node of schema.definitions) {
    if (node !== schema.root) lines.push(`    public static class ${node.typeName} {`);
    const indent = node === schema.root ? '    ' : '        ';
    const usedProperties = new Set();
    for (const { key, optional, type } of node.properties) {
      if (optional || type.nullable || type.kind === 'null' || type.kind === 'union' && type.members.some((member) => member.kind === 'null')) lines.push(`${indent}// ${optional ? 'Optional' : 'Nullable'} in the JSON sample.`);
      lines.push(`${indent}public ${javaType(type)} ${uniqueProperty(key, javaProperty, usedProperties)};`);
    }
    if (node !== schema.root) lines.push('    }');
  }
  lines.push('}'); return lines.join('\n');
}
