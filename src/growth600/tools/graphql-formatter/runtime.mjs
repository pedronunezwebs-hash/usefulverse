import * as prettier from 'prettier/standalone';
import * as graphql from 'prettier/plugins/graphql';

export function formatGraphQL(source) {
  return prettier.format(source, { parser: 'graphql', plugins: [graphql], printWidth: 80, tabWidth: 2, useTabs: false });
}
