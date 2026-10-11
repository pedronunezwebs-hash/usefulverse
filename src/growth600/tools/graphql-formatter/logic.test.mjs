import test from 'node:test';
import assert from 'node:assert/strict';
import { formatGraphQL, MAX_GRAPHQL_BYTES } from './logic.mjs';

test('formats GraphQL operations and keeps operation/variable names', () => {
  const result = formatGraphQL('query FindUser($id:ID!){user(id:$id){id name}}');
  assert.match(result.formatted, /query FindUser\(\$id: ID!\)/u);
  assert.match(result.formatted, /user\(id: \$id\)/u);
  assert.deepEqual(result.definitions, [{ kind: 'OperationDefinition', name: 'FindUser' }]);
});

test('parses and formats SDL without executing or validating against a remote schema', () => {
  const result = formatGraphQL('type User{id:ID! name:String!}\nenum Role{ADMIN USER}');
  assert.match(result.formatted, /type User \{/u);
  assert.deepEqual(result.definitions.map(({ kind, name }) => [kind, name]), [['ObjectTypeDefinition', 'User'], ['EnumTypeDefinition', 'Role']]);
});

test('rejects empty, malformed, excessive and over-tokenized documents', () => {
  assert.throws(() => formatGraphQL('  '), /Enter a GraphQL document/u);
  assert.throws(() => formatGraphQL('query { user(id: ) { id } }'), /Syntax Error/u);
  assert.throws(() => formatGraphQL('x'.repeat(MAX_GRAPHQL_BYTES + 1)), /512 KiB/u);
  assert.throws(() => formatGraphQL(`query { ${'field '.repeat(50_100)} }`), /50000 tokens/u);
});
