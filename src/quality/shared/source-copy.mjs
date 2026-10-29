// Keep translated prose separate from stable routes and example control IDs.
// Legacy prototype documents remain readable while their PRs are integrated.
export function qualitySourceCopy(document) {
  const copy = document.sourceCopy, data = document.nonTranslatableCopy;
  if (!copy || !data) throw Error('Missing quality source document');
  const stable = value => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value ?? '')) throw Error('Invalid stable quality ID');
    return value;
  };
  if (copy.examples.length !== data.examples.length) throw Error('Example copy/data mismatch');
  if (data.related && copy.related.length !== data.related.length) throw Error('Related copy/data mismatch');
  return {
    ...copy,
    examples: copy.examples.map(({id: _id, ...example}, i) => ({ id: stable(data.examples[i].id), ...example })),
    related: copy.related.map((related, i) => {
      const route = data.related?.[i] ?? related;
      if (route.host && route.host !== 'tools.usefulverse.com') throw Error('Unknown related host');
      const {id: _id, host: _host, ...prose} = related;
      return { id: stable(route.id), ...prose, ...(route.host ? { host: route.host } : {}) };
    }),
  };
}
