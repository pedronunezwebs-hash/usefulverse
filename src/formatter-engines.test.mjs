import test from 'node:test';
import assert from 'node:assert/strict';
import { processCss } from './formatter-css-engine.mjs';
import { processJavaScript } from './formatter-javascript-engine.mjs';

test('CSS format/minify keeps quoted spaces and calc arithmetic', async () => {
  const input = '.x { content: "a  b"; width: calc(100% - 2rem); }';
  const formatted = await processCss(input, 'format');
  const compact = await processCss(input, 'minify');
  assert.match(formatted, /content: "a  b"/u);
  assert.match(compact, /content:"a  b"/u);
  assert.match(compact, /calc\(100% - 2rem\)/u);
});

test('JavaScript format/minify preserves literal data and rejects invalid syntax', async () => {
  const input = 'const x = "hello  world"; const tpl = `a  b`; // keep spaces\nconsole.log(x,tpl);';
  const formatted = await processJavaScript(input, 'format');
  const compact = await processJavaScript(input, 'minify');
  assert.match(formatted, /"hello  world"/u);
  assert.match(formatted, /`a  b`/u);
  assert.match(formatted, /\/\/ keep spaces/u);
  assert.match(compact, /hello  world/u);
  assert.match(compact, /a  b/u);
  await assert.rejects(processJavaScript('const = ;', 'format'));
  await assert.rejects(processJavaScript('const = ;', 'minify'));
});
