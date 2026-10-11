import { parse, print } from 'graphql';

export const MAX_GRAPHQL_BYTES = 512 * 1024;
export const MAX_GRAPHQL_TOKENS = 50_000;

export function formatGraphQL(source) {
  if (typeof source !== 'string' || !source.trim()) throw new TypeError('Enter a GraphQL document.');
  const bytes = new TextEncoder().encode(source).byteLength;
  if (bytes > MAX_GRAPHQL_BYTES) throw new RangeError('The document exceeds the 512 KiB limit.');
  const document = parse(source, { maxTokens: MAX_GRAPHQL_TOKENS });
  if (!document.definitions.length) throw new TypeError('The document has no definitions.');
  const definitions = document.definitions.map((definition) => ({
    kind: definition.kind,
    name: definition.name?.value ?? '',
  }));
  return Object.freeze({ formatted: print(document), definitions: Object.freeze(definitions) });
}
