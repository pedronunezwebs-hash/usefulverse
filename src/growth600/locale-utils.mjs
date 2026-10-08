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

const registeredGrowthExtensions = new WeakMap();

export function registerGrowthLocaleExtension(source, toolId, copiesByLocale, inheritFrom) {
  if (!source || !toolId || !copiesByLocale?.en || !inheritFrom || !source[inheritFrom]) throw new TypeError('A source locale, English extension copy, and existing copy to inherit shared UI labels are required.');
  const englishShared = source[inheritFrom];
  source[toolId] = {
    ...structuredClone(copiesByLocale.en),
    actions: { ...englishShared.actions, ...structuredClone(copiesByLocale.en.actions ?? {}) },
    messages: { ...englishShared.messages, ...structuredClone(copiesByLocale.en.messages ?? {}) },
  };
  const extensions = registeredGrowthExtensions.get(source) ?? new Map();
  extensions.set(toolId, { copiesByLocale, inheritFrom });
  registeredGrowthExtensions.set(source, extensions);
  return source;
}

export function growthLocaleStringPaths(source) {
  const extensionIds = new Set(registeredGrowthExtensions.get(source)?.keys() ?? []);
  return stringPaths(source).filter(([root]) => !extensionIds.has(root));
}

export function materializeGrowthLocale(source, values, locale) {
  if (!source || !Array.isArray(values) || !/^[a-z][a-z0-9_]*$/u.test(locale)) throw new TypeError('Source locale, indexed strings and locale key are required.');
  const extensions = registeredGrowthExtensions.get(source) ?? new Map();
  const paths = growthLocaleStringPaths(source);
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
  for (const [toolId, { copiesByLocale, inheritFrom }] of extensions) {
    const localized = copiesByLocale[locale];
    if (!localized) throw new Error(`Locale extension ${toolId} is missing for ${locale}.`);
    const shared = copy[inheritFrom];
    copy[toolId] = {
      ...copy[toolId],
      ...structuredClone(localized),
      actions: { ...shared.actions, ...structuredClone(localized.actions ?? {}) },
      messages: { ...shared.messages, ...structuredClone(localized.messages ?? {}) },
      copyLanguage: locale,
    };
  }
  return copy;
}
