import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { growthPilotTools } from './catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'tools');

export async function bundleGrowthControllers({ tools = growthPilotTools, maxBytes = 24 * 1024 } = {}) {
  const bundles = {};
  for (const tool of tools) {
    const result = await build({
      entryPoints: [resolve(root, tool.id, 'controller.mjs')],
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      write: false,
      logLevel: 'silent',
    });
    const contents = result.outputFiles[0]?.text;
    if (!contents) throw new Error(`Bundler produced no controller for ${tool.id}.`);
    const bytes = Buffer.byteLength(contents);
    const toolBudget = ['sky-map', 'panchang-calendar'].includes(tool.id) ? 64 * 1024
      : ['chess-opening-trainer', 'chess-puzzles', 'chess-analysis-board', 'makruk'].includes(tool.id)
        ? 48 * 1024
      : tool.logicModule === './tools/pending-23/logic.mjs' ? 72 * 1024 : maxBytes;
    if (bytes > toolBudget) throw new Error(`${tool.id} controller is ${bytes} bytes; budget is ${toolBudget}.`);
    bundles[tool.id] = contents;
  }
  return bundles;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bundles = await bundleGrowthControllers();
  for (const [tool, code] of Object.entries(bundles)) console.log(`${tool}: ${Buffer.byteLength(code)} bytes`);
}
