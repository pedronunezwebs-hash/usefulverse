export const MAX_SCHEMA_MARKUP_CHARS = 300_000;

const SCHEMA_CONTEXTS = new Set(['https://schema.org', 'https://schema.org/', 'http://schema.org', 'http://schema.org/']);

function contextState(context, inherited = { schemaVocabulary: false, prefixes: {} }) {
  const state = { schemaVocabulary: inherited.schemaVocabulary, prefixes: { ...inherited.prefixes } };
  const visit = (item) => {
    if (typeof item === 'string') {
      if (SCHEMA_CONTEXTS.has(item)) state.schemaVocabulary = true;
      return;
    }
    if (Array.isArray(item)) { item.forEach(visit); return; }
    if (!item || typeof item !== 'object') return;
    const vocab = item['@vocab'];
    if (typeof vocab === 'string' && SCHEMA_CONTEXTS.has(vocab)) state.schemaVocabulary = true;
    for (const [prefix, value] of Object.entries(item)) {
      if (prefix.startsWith('@')) continue;
      const iri = typeof value === 'string' ? value : value && typeof value === 'object' ? value['@id'] : '';
      if (typeof iri === 'string' && (SCHEMA_CONTEXTS.has(iri) || iri === 'https://schema.org/' || iri === 'http://schema.org/')) {
        state.prefixes[prefix] = 'schema';
        state.schemaVocabulary = true;
      } else if (typeof iri === 'string' && iri.startsWith('schema:')) {
        state.prefixes[prefix] = 'schema';
      }
    }
    if (item.schema === 'https://schema.org/' || item.schema === 'http://schema.org/') state.prefixes.schema = 'schema';
    if (item['@vocab'] && SCHEMA_CONTEXTS.has(item['@vocab'])) state.schemaVocabulary = true;
  };
  visit(context);
  return state;
}

function schemaTerm(value, state) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const term = value.trim();
  const uriMatch = term.match(/^https?:\/\/schema\.org\/(.+)$/u);
  if (uriMatch) return uriMatch[1];
  const prefixed = term.match(/^([^:]+):(.+)$/u);
  if (prefixed) return state.prefixes[prefixed[1]] === 'schema' ? prefixed[2] : null;
  return state.schemaVocabulary ? term : null;
}

function positionFromSyntaxError(error) {
  const match = String(error?.message ?? '').match(/(?:position|at)\s+(\d+)/iu);
  return match ? Number(match[1]) : null;
}

function lineAndColumn(source, position) {
  const before = source.slice(0, position);
  const lines = before.split('\n');
  return { line: lines.length, column: [...lines.at(-1)].length + 1 };
}

export function validateSchemaMarkup(source, vocabulary) {
  if (typeof source !== 'string') throw new TypeError('Schema markup input must be text.');
  if (source.length > MAX_SCHEMA_MARKUP_CHARS) throw new RangeError(`Schema markup is limited to ${MAX_SCHEMA_MARKUP_CHARS} characters.`);
  if (!vocabulary || !/^\d+\.\d+$/u.test(vocabulary.version) || !Array.isArray(vocabulary.types) || !Array.isArray(vocabulary.properties)) {
    throw new TypeError('A versioned Schema.org vocabulary is required.');
  }
  const types = new Set(vocabulary.types);
  const properties = new Set(vocabulary.properties);
  let document;
  try { document = JSON.parse(source); }
  catch (error) {
    const position = positionFromSyntaxError(error);
    const location = position === null ? '' : ` (line ${lineAndColumn(source, position).line}, column ${lineAndColumn(source, position).column})`;
    return { jsonValid: false, vocabularyVersion: vocabulary.version, entityCount: 0, typesChecked: 0, propertiesChecked: 0, issues: [{ severity: 'error', code: 'invalid-json', path: '$', message: `Invalid JSON${location}.` }] };
  }
  if (!document || typeof document !== 'object') {
    return { jsonValid: true, vocabularyVersion: vocabulary.version, entityCount: 0, typesChecked: 0, propertiesChecked: 0, issues: [{ severity: 'error', code: 'root-not-object', path: '$', message: 'The JSON root must be an object or array of objects.' }] };
  }

  const issues = [];
  const visited = new WeakSet();
  const seen = new Set();
  let entityCount = 0;
  let typesChecked = 0;
  let propertiesChecked = 0;
  const issue = (severity, code, path, term) => {
    const key = `${code}:${path}:${term}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push({ severity, code, path, term, message: `${term} at ${path}` });
  };

  function inspect(value, path = '$', inheritedContext = { schemaVocabulary: false, prefixes: {} }) {
    if (!value || typeof value !== 'object' || visited.has(value)) return;
    visited.add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => inspect(item, `${path}[${index}]`, inheritedContext));
      return;
    }
    const state = Object.hasOwn(value, '@context') ? contextState(value['@context'], inheritedContext) : inheritedContext;
    if (Object.hasOwn(value, '@type')) {
      entityCount += 1;
      const declaredTypes = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
      for (const declared of declaredTypes) {
        const name = schemaTerm(declared, state);
        if (name && state.schemaVocabulary) {
          typesChecked += 1;
          if (!types.has(name)) issue('warning', 'unknown-type', `${path}.@type`, String(declared));
        }
      }
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === '@context') continue;
      if (!key.startsWith('@')) {
        const name = schemaTerm(key, state);
        if (name && state.schemaVocabulary) {
          propertiesChecked += 1;
          if (!properties.has(name)) issue('warning', 'unknown-property', `${path}.${key}`, key);
        }
      }
      if (child && typeof child === 'object') inspect(child, `${path}.${key}`, state);
    }
  }
  inspect(document);
  if (!issues.length && entityCount === 0) issues.push({ severity: 'info', code: 'no-typed-entity', path: '$', message: 'JSON is valid, but no object declares @type.' });
  return { jsonValid: true, vocabularyVersion: vocabulary.version, entityCount, typesChecked, propertiesChecked, issues };
}
