export const GRAPHQL_FORMATTER_MAX_CHARACTERS = 100_000;

export function validateGraphQLSource(source) {
  if (typeof source !== 'string' || !source.trim()) throw new TypeError('empty');
  if (source.length > GRAPHQL_FORMATTER_MAX_CHARACTERS) throw new RangeError('tooLong');
  return source;
}

export async function formatGraphQLSource(source, formatter) {
  validateGraphQLSource(source);
  if (typeof formatter !== 'function') throw new TypeError('formatterUnavailable');
  const formatted = await formatter(source);
  if (typeof formatted !== 'string' || !formatted.trim()) throw new TypeError('formatFailed');
  return formatted;
}
