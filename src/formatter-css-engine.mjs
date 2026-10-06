import * as prettier from 'prettier/standalone';
import * as postcssPlugin from 'prettier/plugins/postcss';
import { minify } from 'csso';

export async function processCss(source, mode) {
  if (mode === 'format') {
    return prettier.format(source, { parser: 'css', plugins: [postcssPlugin], printWidth: 100 });
  }
  return minify(source, { restructure: false, comments: false }).css;
}
