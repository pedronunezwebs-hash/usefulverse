import * as prettier from 'prettier/standalone';
import * as babelPlugin from 'prettier/plugins/babel';
import * as estreePlugin from 'prettier/plugins/estree';
import { minify } from 'terser';

export async function processJavaScript(source, mode) {
  if (mode === 'format') {
    return prettier.format(source, { parser: 'babel', plugins: [babelPlugin, estreePlugin], printWidth: 100, semi: true });
  }
  const result = await minify(source, { ecma: 2020, compress: true, mangle: true, format: { comments: 'some' } });
  if (!result.code) throw new SyntaxError('The JavaScript could not be parsed. Check its syntax and try again.');
  return result.code;
}
