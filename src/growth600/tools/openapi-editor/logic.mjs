export const MAX_OPENAPI_BYTES = 300_000;
export const MAX_OPENAPI_PATHS = 500;

const METHODS = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);
const RESPONSE_KEY = /^(?:default|[1-5](?:\d\d|XX))$/iu;

function issue(code, path = '') { return { code, path }; }

function resolvePointer(document, ref) {
  if (ref === '#') return document;
  if (!ref.startsWith('#/')) return undefined;
  let value = document;
  for (const raw of ref.slice(2).split('/')) {
    if (/~(?![01])/u.test(raw)) return undefined;
    const key = raw.replaceAll('~1', '/').replaceAll('~0', '~');
    if (value === null || typeof value !== 'object' || !Object.hasOwn(value, key)) return undefined;
    value = value[key];
  }
  return value;
}

export function lintOpenApi(document) {
  const issues = [];
  const add = (code, path = '') => issues.push(issue(code, path));
  if (!document || typeof document !== 'object' || Array.isArray(document)) return { issues: [issue('rootObject')], operations: [] };
  if (typeof document.openapi !== 'string' || !/^3\.[01]\.\d+(?:[-+].*)?$/u.test(document.openapi)) add('version');
  if (!document.info || typeof document.info !== 'object' || !String(document.info.title ?? '').trim() || !String(document.info.version ?? '').trim()) add('info');
  const paths = document.paths;
  if (!paths || typeof paths !== 'object' || Array.isArray(paths) || Object.keys(paths).length === 0) add('paths');
  const pathEntries = paths && typeof paths === 'object' && !Array.isArray(paths) ? Object.entries(paths) : [];
  if (pathEntries.length > MAX_OPENAPI_PATHS) add('tooManyPaths');
  const operations = [];
  const operationIds = new Set();
  for (const [path, item] of pathEntries.slice(0, MAX_OPENAPI_PATHS)) {
    if (!path.startsWith('/')) add('invalidPath', path);
    if (!item || typeof item !== 'object' || Array.isArray(item)) { add('invalidPathItem', path); continue; }
    for (const [method, operation] of Object.entries(item)) {
      if (!METHODS.has(method.toLowerCase())) continue;
      if (!operation || typeof operation !== 'object' || Array.isArray(operation)) { add('invalidOperation', `${method.toUpperCase()} ${path}`); continue; }
      const label = `${method.toUpperCase()} ${path}`;
      const operationId = String(operation.operationId ?? '').trim();
      if (!operationId) add('operationId', label);
      else if (operationIds.has(operationId)) add('duplicateOperationId', operationId);
      else operationIds.add(operationId);
      const responses = operation.responses;
      if (!responses || typeof responses !== 'object' || Array.isArray(responses) || !Object.keys(responses).length) add('responses', label);
      else for (const [status, response] of Object.entries(responses)) {
        if (!RESPONSE_KEY.test(status) || !response || typeof response !== 'object' || Array.isArray(response) || (!response.$ref && !String(response.description ?? '').trim())) add('responseDescription', `${label} · ${status}`);
      }
      const parameters = [...(Array.isArray(item.parameters) ? item.parameters : []), ...(Array.isArray(operation.parameters) ? operation.parameters : [])];
      for (const param of parameters) {
        if (param?.$ref) continue;
        if (!param || typeof param !== 'object' || !String(param.name ?? '').trim() || !String(param.in ?? '').trim()) add('parameter', label);
      }
      const parameterKeys = new Set(parameters.map((param) => param?.$ref ? resolvePointer(document, param.$ref) : param).filter((param) => param && typeof param === 'object' && param.in === 'path' && param.required === true).map((param) => param.name));
      for (const [, name] of path.matchAll(/\{([^{}]+)\}/gu)) {
        if (!parameterKeys.has(name)) add('pathParameter', `${label} · ${name}`);
      }
      operations.push({ method: method.toUpperCase(), path, summary: String(operation.summary ?? ''), operationId, responses: responses && typeof responses === 'object' ? Object.keys(responses).filter((status) => RESPONSE_KEY.test(status)).slice(0, 8) : [] });
    }
  }
  if (pathEntries.length && !operations.length) add('noOperations');
  const seen = new WeakSet();
  const stack = [['#', document]];
  let visited = 0;
  while (stack.length && visited < 50_000) {
    const [path, value] = stack.pop();
    if (!value || typeof value !== 'object' || seen.has(value)) continue;
    seen.add(value); visited += 1;
    if (!Array.isArray(value) && Object.hasOwn(value, '$ref')) {
      const ref = value.$ref;
      if (typeof ref !== 'string' || !ref.startsWith('#')) add('remoteReference', path);
      else if (resolvePointer(document, ref) === undefined) add('unresolvedReference', ref);
    }
    for (const [key, child] of Object.entries(value)) stack.push([`${path}/${key}`, child]);
  }
  if (stack.length) add('complexity');
  return { issues, operations };
}

export function parseOpenApi(source, format = 'auto', yamlParse) {
  if (typeof source !== 'string' || !source.trim()) throw new TypeError('empty');
  if (new TextEncoder().encode(source).byteLength > MAX_OPENAPI_BYTES) throw new RangeError('tooLarge');
  const wantsYaml = format === 'yaml' || (format === 'auto' && /^\s*(?:openapi|info|paths|components)\s*:/mu.test(source));
  if (!wantsYaml) {
    try { return { document: JSON.parse(source), format: 'json' }; }
    catch (error) { if (format === 'json') throw error; }
  }
  if (typeof yamlParse !== 'function') throw new Error('yamlUnavailable');
  const document = yamlParse(source, { maxAliasCount: 20 });
  const stack = [document];
  const seen = new WeakSet();
  let visited = 0;
  while (stack.length) {
    const value = stack.pop();
    if (!value || typeof value !== 'object') continue;
    if (seen.has(value)) throw new Error('yamlAliases');
    seen.add(value);
    if (++visited > 50_000) throw new RangeError('tooComplexYaml');
    for (const child of Array.isArray(value) ? value : Object.values(value)) stack.push(child);
  }
  return { document, format: 'yaml' };
}

export function createOpenApiSummary(report) {
  return report.issues.map(({ code, path }) => `${code}${path ? `: ${path}` : ''}`).join('\n');
}
