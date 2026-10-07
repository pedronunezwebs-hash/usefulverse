function stringPaths(value, path = [], output = []) {
  if (typeof value === 'string') {
    if (path.at(-1) !== 'copyLanguage') output.push(path);
    return output;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) stringPaths(child, [...path, key], output);
  }
  return output;
}

function setAtPath(target, path, value) {
  let parent = target;
  for (const part of path.slice(0, -1)) parent = parent[part];
  parent[path.at(-1)] = value;
}

function tokens(value) {
  return [...value.matchAll(/\{([a-z][a-zA-Z0-9]*)\}/gu)].map((match) => match[1]).sort();
}

export function materializeGrowthLocale(source, values, locale) {
  if (!source || !Array.isArray(values) || !/^[a-z][a-z0-9_]*$/u.test(locale)) throw new TypeError('Source locale, indexed strings and locale key are required.');
  const paths = stringPaths(source);
  if (paths.length !== values.length) throw new Error(`Locale ${locale} has ${values.length} strings; source requires ${paths.length}.`);
  const copy = structuredClone(source);
  for (let index = 0; index < paths.length; index += 1) {
    const translated = values[index];
    if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Locale ${locale} has an empty value at string ${index + 1}.`);
    const original = paths[index].reduce((parent, key) => parent[key], source);
    if (JSON.stringify(tokens(original)) !== JSON.stringify(tokens(translated))) throw new Error(`Locale ${locale} changed interpolation tokens at string ${index + 1}.`);
    setAtPath(copy, paths[index], translated.trim());
  }
  for (const entry of Object.values(copy)) {
    if (entry && typeof entry === 'object' && 'copyLanguage' in entry) entry.copyLanguage = locale;
  }
  return copy;
}

export { stringPaths as growthLocaleStringPaths };
