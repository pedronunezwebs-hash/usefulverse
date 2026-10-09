export const JSON_DIFF_LIMITS = Object.freeze({ characters: 200_000, nodes: 20_000, depth: 64, changes: 500 });

function inspect(value, label) {
  const stack = [{ value, depth: 0 }];
  let nodes = 0;
  while (stack.length) {
    const item = stack.pop();
    nodes += 1;
    if (nodes > JSON_DIFF_LIMITS.nodes) throw new Error(`${label}: too many values`);
    if (item.depth > JSON_DIFF_LIMITS.depth) throw new Error(`${label}: nesting is too deep`);
    if (item.value && typeof item.value === 'object') {
      for (const child of Object.values(item.value)) stack.push({ value: child, depth: item.depth + 1 });
    }
  }
}

export function parseJsonDocument(text, label = 'JSON') {
  if (typeof text !== 'string') throw new Error(`${label}: enter a JSON document`);
  if (text.length > JSON_DIFF_LIMITS.characters) throw new Error(`${label}: document is too large`);
  if (!text.trim()) throw new Error(`${label}: enter a JSON document`);
  let value;
  try { value = JSON.parse(text); } catch { throw new Error(`${label}: invalid JSON syntax`); }
  inspect(value, label);
  return value;
}

function pointer(path) {
  return path.length ? `/${path.map((part) => String(part).replaceAll('~', '~0').replaceAll('/', '~1')).join('/')}` : '';
}

function jsonPatch(before, after, path = [], operations = []) {
  if (Object.is(before, after)) return operations;
  const beforeArray = Array.isArray(before); const afterArray = Array.isArray(after);
  const beforeObject = before !== null && typeof before === 'object' && !beforeArray;
  const afterObject = after !== null && typeof after === 'object' && !afterArray;
  if (beforeArray && afterArray) {
    const shared = Math.min(before.length, after.length);
    for (let i = 0; i < shared; i += 1) jsonPatch(before[i], after[i], [...path, i], operations);
    for (let i = before.length - 1; i >= after.length; i -= 1) operations.push({ op: 'remove', path: pointer([...path, i]) });
    for (let i = shared; i < after.length; i += 1) operations.push({ op: 'add', path: `${pointer(path)}/-`, value: after[i] });
    return operations;
  }
  if (beforeObject && afterObject) {
    for (const key of Object.keys(before).filter((key) => !Object.hasOwn(after, key)).sort()) operations.push({ op: 'remove', path: pointer([...path, key]) });
    for (const key of Object.keys(after).filter((key) => !Object.hasOwn(before, key)).sort()) operations.push({ op: 'add', path: pointer([...path, key]), value: after[key] });
    for (const key of Object.keys(before).filter((key) => Object.hasOwn(after, key)).sort()) jsonPatch(before[key], after[key], [...path, key], operations);
    return operations;
  }
  operations.push({ op: 'replace', path: pointer(path), value: after });
  return operations;
}

function keyFor(value, keyName, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.hasOwn(value, keyName)) throw new Error(`${label}: every array item must have the selected key`);
  const key = value[keyName];
  if (!(typeof key === 'string' || (typeof key === 'number' && Number.isFinite(key)))) throw new Error(`${label}: array keys must be strings or finite numbers`);
  return `${typeof key}:${String(key)}`;
}

function addChange(changes, kind, path, before, after) {
  if (changes.length >= JSON_DIFF_LIMITS.changes) throw new Error('Comparison has too many changes; reduce the input size or scope.');
  changes.push({ kind, path: path || '$', before, after });
}

function childPath(path, segment) {
  const escaped = String(segment).replaceAll('~', '~0').replaceAll('/', '~1');
  return `${path}/${escaped}`;
}

function compare(before, after, path, changes, keyName) {
  if (Object.is(before, after)) return;
  const beforeArray = Array.isArray(before); const afterArray = Array.isArray(after);
  const beforeObject = before !== null && typeof before === 'object' && !beforeArray;
  const afterObject = after !== null && typeof after === 'object' && !afterArray;
  if (beforeObject && afterObject) {
    for (const key of Object.keys(before).filter((key) => !Object.hasOwn(after, key)).sort()) addChange(changes, 'removed', childPath(path, key), before[key], undefined);
    for (const key of Object.keys(after).filter((key) => !Object.hasOwn(before, key)).sort()) addChange(changes, 'added', childPath(path, key), undefined, after[key]);
    for (const key of Object.keys(before).filter((key) => Object.hasOwn(after, key)).sort()) compare(before[key], after[key], childPath(path, key), changes, keyName);
    return;
  }
  if (beforeArray && afterArray) {
    const recordArrays = before.concat(after).every((entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry));
    if (!keyName || !recordArrays) {
      const shared = Math.min(before.length, after.length);
      for (let i = 0; i < shared; i += 1) compare(before[i], after[i], childPath(path, i), changes, keyName);
      for (let i = shared; i < before.length; i += 1) addChange(changes, 'removed', childPath(path, i), before[i], undefined);
      for (let i = shared; i < after.length; i += 1) addChange(changes, 'added', childPath(path, i), undefined, after[i]);
      return;
    }
    const beforeMap = new Map(); const afterMap = new Map();
    before.forEach((entry, index) => { const key = keyFor(entry, keyName, 'Before JSON'); if (beforeMap.has(key)) throw new Error('Before JSON: duplicate keys in an array'); beforeMap.set(key, { entry, index, rawKey: entry[keyName] }); });
    after.forEach((entry, index) => { const key = keyFor(entry, keyName, 'After JSON'); if (afterMap.has(key)) throw new Error('After JSON: duplicate keys in an array'); afterMap.set(key, { entry, index, rawKey: entry[keyName] }); });
    for (const [key, item] of beforeMap) {
      const next = afterMap.get(key); const itemPath = childPath(path, `[@${String(item.rawKey)}]`);
      if (!next) addChange(changes, 'removed', itemPath, item.entry, undefined);
      else compare(item.entry, next.entry, itemPath, changes, keyName);
    }
    for (const [key, item] of afterMap) if (!beforeMap.has(key)) addChange(changes, 'added', childPath(path, `[@${String(item.rawKey)}]`), undefined, item.entry);
    return;
  }
  addChange(changes, 'changed', path, before, after);
}

export function compareJsonDocuments(beforeText, afterText, { arrayKey = '' } = {}) {
  if (typeof arrayKey !== 'string' || arrayKey.length > 80) throw new Error('Array key must be a property name of at most 80 characters.');
  const before = parseJsonDocument(beforeText, 'Before JSON');
  const after = parseJsonDocument(afterText, 'After JSON');
  const changes = [];
  compare(before, after, '', changes, arrayKey.trim());
  const summary = changes.reduce((counts, change) => { counts[change.kind] += 1; return counts; }, { added: 0, removed: 0, changed: 0 });
  return { summary, changes, patch: jsonPatch(before, after) };
}
