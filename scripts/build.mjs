import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as bundle, transform } from 'esbuild';
import { tools, categories } from '../src/catalog.mjs';
import { renderGuidePage, renderGuidesIndex, renderHome, renderNotFoundPage, renderToolPage } from '../src/template.mjs';
import { guidePath, guides, guidesForLocale } from '../src/guides.mjs';
import { localeHomePath, localePath, locales, localizedTool, numberWordsLocaleCodes, packs, pdfLocaleEntries, pdfOnlyLocaleKeys, pdfOnlyLocales, pdfOnlyPacks, pdfToolIds, ui } from '../src/locales.mjs';
import { localeBundleSource } from '../src/locales/bundle.mjs';
import { numberWordsRuntimeSource } from '../src/locales/number-words-runtime.mjs';
import { localizedGuideGaps } from '../src/locales/release-gate.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : join(root, 'dist');
const criticalCss = (await readFile(join(root, 'src', 'critical.css'), 'utf8')).trim();

async function copyMinifiedScript(sourceName) {
  const sourcePath = join(root, 'src', sourceName);
  const outputPath = join(dist, 'assets', sourceName);
  const source = await readFile(sourcePath, 'utf8');
  const { code } = await transform(source, { loader: 'js', minify: true, target: ['es2022'] });
  await writeFile(outputPath, code);
}

async function deferFullStyles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await deferFullStyles(path);
      continue;
    }
    if (entry.name !== 'index.html' && entry.name !== '404.html') continue;
    const html = await readFile(path, 'utf8');
    const stylesheet = html.match(/<link rel="stylesheet" href="([^"]*\/assets\/styles\.css\?v=[^"]+)">/u);
    if (!stylesheet) throw new Error(`Cannot find the versioned global stylesheet in ${path}`);
    const href = stylesheet[1];
    const replacement = `<link rel="preload" href="${href}" as="style">\n    <style data-critical-styles>${criticalCss}</style>\n    <link rel="stylesheet" href="${href}" media="print" data-deferred-styles>\n    <noscript><link rel="stylesheet" href="${href}"></noscript>`;
    await writeFile(path, html.replace(stylesheet[0], replacement));
  }
}

const guidesByLocale = Object.fromEntries(Object.keys(locales).map((language) => [language, { guides: guidesForLocale(language) }]));
const guideGaps = localizedGuideGaps(locales, guidesByLocale, guides);
if (guideGaps.length) {
  throw new Error(`Refusing to replace build output while guide localization is incomplete:\n${guideGaps.map((gap) => `- ${gap}`).join('\n')}`);
}
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await bundle({
  entryPoints: [join(root, 'src', 'styles.css')],
  outfile: join(dist, 'assets', 'styles.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'kanban-board.css')],
  outfile: join(dist, 'assets', 'kanban-board.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'reading-speed.css')],
  outfile: join(dist, 'assets', 'reading-speed.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', '2048-game.css')],
  outfile: join(dist, 'assets', '2048-game.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sudoku.css')],
  outfile: join(dist, 'assets', 'sudoku.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'tic-tac-toe.css')],
  outfile: join(dist, 'assets', 'tic-tac-toe.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'chess-game.css')],
  outfile: join(dist, 'assets', 'chess-game.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'solitaire.css')],
  outfile: join(dist, 'assets', 'solitaire.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'minesweeper.css')],
  outfile: join(dist, 'assets', 'minesweeper.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'nonogram.css')],
  outfile: join(dist, 'assets', 'nonogram.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sliding-puzzle.css')],
  outfile: join(dist, 'assets', 'sliding-puzzle.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'drum-machine.css')],
  outfile: join(dist, 'assets', 'drum-machine.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'online-sequencer.css')],
  outfile: join(dist, 'assets', 'online-sequencer.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'css-design-tools.css')],
  outfile: join(dist, 'assets', 'css-design-tools.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'web-dev-tools.css')],
  outfile: join(dist, 'assets', 'web-dev-tools.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'board-games.css')],
  outfile: join(dist, 'assets', 'board-games.css'),
  bundle: false,
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'app.js')],
  outfile: join(dist, 'assets', 'app.js'),
  bundle: false,
  format: 'esm',
  target: ['es2022'],
  minify: true,
});
for (const sourceName of ['advanced-tools.js', 'advanced-logic.mjs', 'expanded-tools.js', 'expanded-logic.mjs', 'new-tools.js', 'new-tool-logic.mjs', 'timer-logic.mjs', 'media-tools.js']) {
  await copyMinifiedScript(sourceName);
}
await bundle({
  entryPoints: [join(root, 'src', 'plan-tools.js')],
  outfile: join(dist, 'assets', 'plan-tools.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'tool-suite-tools.js')],
  outfile: join(dist, 'assets', 'tool-suite-tools.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'opportunity-runtime.js')],
  outfile: join(dist, 'assets', 'opportunity-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'local-planners-runtime.js')],
  outfile: join(dist, 'assets', 'local-planners-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'local-study-runtime.js')],
  outfile: join(dist, 'assets', 'local-study-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'spelling-practice-runtime.js')],
  outfile: join(dist, 'assets', 'spelling-practice-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'hangul-practice-runtime.js')],
  outfile: join(dist, 'assets', 'hangul-practice-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', '2048-game-runtime.js')],
  outfile: join(dist, 'assets', '2048-game-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sudoku-runtime.js')],
  outfile: join(dist, 'assets', 'sudoku-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'tic-tac-toe-runtime.js')],
  outfile: join(dist, 'assets', 'tic-tac-toe-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'chess-game-runtime.js')],
  outfile: join(dist, 'assets', 'chess-game-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'solitaire-runtime.js')],
  outfile: join(dist, 'assets', 'solitaire-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'minesweeper-runtime.js')],
  outfile: join(dist, 'assets', 'minesweeper-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'nonogram-runtime.js')],
  outfile: join(dist, 'assets', 'nonogram-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sliding-puzzle-runtime.js')],
  outfile: join(dist, 'assets', 'sliding-puzzle-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'drum-machine-runtime.js')],
  outfile: join(dist, 'assets', 'drum-machine-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'online-sequencer-runtime.js')],
  outfile: join(dist, 'assets', 'online-sequencer-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'css-design-tools.js')],
  outfile: join(dist, 'assets', 'css-design-tools.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'web-dev-tools.js')],
  outfile: join(dist, 'assets', 'web-dev-tools.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'board-games-runtime.js')],
  outfile: join(dist, 'assets', 'board-games-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'web-dev-logic.mjs')],
  outfile: join(dist, 'assets', 'web-dev-logic.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'css-design-logic.mjs')],
  outfile: join(dist, 'assets', 'css-design-logic.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'online-sequencer-logic.mjs')],
  outfile: join(dist, 'assets', 'online-sequencer-logic.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'tic-tac-toe-logic.mjs')],
  outfile: join(dist, 'assets', 'tic-tac-toe-logic.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'time-tracker-runtime.js')],
  outfile: join(dist, 'assets', 'time-tracker-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'weekly-meal-planner-runtime.js')],
  outfile: join(dist, 'assets', 'weekly-meal-planner-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'reading-log-runtime.js')],
  outfile: join(dist, 'assets', 'reading-log-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'chart-runtime.js')],
  outfile: join(dist, 'assets', 'chart-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sqlite-playground-runtime.js')],
  outfile: join(dist, 'assets', 'sqlite-playground-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
for (const name of ['code-formatter-runtime', 'formatter-html-engine', 'formatter-css-engine', 'formatter-javascript-engine']) {
  const extension = name === 'code-formatter-runtime' ? '.js' : '.mjs';
  await bundle({
    entryPoints: [join(root, 'src', `${name}${extension}`)],
    outfile: join(dist, 'assets', `${name}.js`),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2022'],
    minify: true,
  });
}
await bundle({
  entryPoints: [join(root, 'src', 'task-list-runtime.js')],
  outfile: join(dist, 'assets', 'task-list-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'kanban-board-runtime.js')],
  outfile: join(dist, 'assets', 'kanban-board-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'reading-speed-runtime.js')],
  outfile: join(dist, 'assets', 'reading-speed-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'habit-tracker-runtime.js')],
  outfile: join(dist, 'assets', 'habit-tracker-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'chess-clock-runtime.js')],
  outfile: join(dist, 'assets', 'chess-clock-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'ear-training-runtime.js')],
  outfile: join(dist, 'assets', 'ear-training-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'bpm-detector-runtime.js')],
  outfile: join(dist, 'assets', 'bpm-detector-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'music-scale-runtime.js')],
  outfile: join(dist, 'assets', 'music-scale-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'seating-chart-runtime.js')],
  outfile: join(dist, 'assets', 'seating-chart-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'gantt-chart-runtime.js')],
  outfile: join(dist, 'assets', 'gantt-chart-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sprite-sheet-runtime.js')],
  outfile: join(dist, 'assets', 'sprite-sheet-runtime.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'sqlite-playground-worker.mjs')],
  outfile: join(dist, 'assets', 'sqlite-playground-worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await cp(join(root, 'node_modules', '@sqlite.org', 'sqlite-wasm', 'dist', 'sqlite3.wasm'), join(dist, 'assets', 'sqlite3.wasm'));
const vendor = join(dist, 'assets', 'vendor');
await mkdir(vendor, { recursive: true });
await cp(join(root, 'node_modules', 'mathjax', 'tex-svg.js'), join(vendor, 'mathjax-tex-svg.js'));
await cp(join(root, 'node_modules', 'mathjax', 'LICENSE'), join(vendor, 'LICENSE-mathjax.txt'));
await cp(join(root, 'node_modules', 'pdf-lib', 'dist', 'pdf-lib.min.js'), join(vendor, 'pdf-lib.min.js'));
await bundle({
  entryPoints: [join(root, 'src', 'tiff-decoder.mjs')],
  outfile: join(dist, 'assets', 'tiff-decoder.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'office-package-worker.mjs')],
  outfile: join(vendor, 'office-package-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await cp(join(root, 'node_modules', 'jsqr', 'dist', 'jsQR.js'), join(vendor, 'jsQR.js'));
await cp(join(root, 'node_modules', 'heic2any', 'dist', 'heic2any.min.js'), join(vendor, 'heic2any.min.js'));
await cp(join(root, 'node_modules', 'marked', 'lib', 'marked.umd.js'), join(vendor, 'marked.umd.js'));
await cp(join(root, 'node_modules', 'dompurify', 'dist', 'purify.min.js'), join(vendor, 'purify.min.js'));
await cp(join(root, 'node_modules', 'turndown', 'lib', 'turndown.browser.umd.js'), join(vendor, 'turndown.browser.umd.js'));
await cp(join(root, 'node_modules', 'js-yaml', 'dist', 'js-yaml.mjs'), join(vendor, 'js-yaml.mjs'));
await cp(join(root, 'node_modules', 'jsbarcode', 'dist', 'JsBarcode.all.min.js'), join(vendor, 'JsBarcode.all.min.js'));
await cp(join(root, 'node_modules', '@neslinesli93', 'qpdf-wasm', 'dist', 'qpdf.wasm'), join(vendor, 'qpdf.wasm'));
await bundle({
  entryPoints: [join(root, 'src', 'pdf-compressor-worker.mjs')],
  outfile: join(vendor, 'pdf-compressor-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  external: ['fs', 'path'],
});
await bundle({
  entryPoints: [join(root, 'src', 'video-compression.mjs')],
  outfile: join(vendor, 'video-compression.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'audio-processing.mjs')],
  outfile: join(vendor, 'audio-processing.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'media-converter.mjs')],
  outfile: join(vendor, 'media-converter.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'media-transcription-worker.mjs')],
  outfile: join(dist, 'assets', 'media-transcription-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'portrait-background-worker.mjs')],
  outfile: join(dist, 'assets', 'portrait-background-worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'tool-suite-ocr.mjs')],
  outfile: join(dist, 'assets', 'tool-suite-ocr.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'pdf-qpdf-worker.mjs')],
  outfile: join(vendor, 'pdf-qpdf-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  external: ['fs', 'path'],
});
await bundle({
  entryPoints: [join(root, 'src', 'pdf-crop-worker.mjs')],
  outfile: join(vendor, 'pdf-crop-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await bundle({
  entryPoints: [join(root, 'src', 'pdfa-worker.mjs')],
  outfile: join(vendor, 'pdfa-worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
});
await cp(join(root, 'public', 'ocr-languages-4.0.0'), join(dist, 'assets', 'ocr-languages-4.0.0'), { recursive: true });
const modnetRevision = 'fa2fa546052fba4c08921230a26cc69a333fca12';
await cp(join(root, 'public', 'models'), join(dist, 'assets', `models-${modnetRevision}`), { recursive: true });
const tesseract = join(vendor, 'tesseract-7.0.0');
await mkdir(tesseract, { recursive: true });
await cp(join(root, 'node_modules', 'tesseract.js', 'dist', 'worker.min.js'), join(tesseract, 'worker.min.js'));
for (const core of ['tesseract-core-lstm.wasm.js', 'tesseract-core-lstm.wasm', 'tesseract-core-simd-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm', 'tesseract-core-relaxedsimd-lstm.wasm.js', 'tesseract-core-relaxedsimd-lstm.wasm']) {
  await cp(join(root, 'node_modules', 'tesseract.js-core', core), join(tesseract, core));
}
const onnxRuntime = join(vendor, 'onnx');
await mkdir(onnxRuntime, { recursive: true });
await cp(join(root, 'node_modules', 'onnxruntime-web', 'dist', 'ort-wasm-simd-threaded.mjs'), join(onnxRuntime, 'ort-wasm-simd-threaded.mjs'));
await cp(join(root, 'node_modules', 'onnxruntime-web', 'dist', 'ort-wasm-simd-threaded.wasm'), join(onnxRuntime, 'ort-wasm-simd-threaded.wasm'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.min.mjs'), join(vendor, 'pdf.min.mjs'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs'), join(vendor, 'pdf.worker.min.mjs'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'cmaps'), join(vendor, 'cmaps'), { recursive: true });
await cp(join(root, 'node_modules', 'pdfjs-dist', 'standard_fonts'), join(vendor, 'standard_fonts'), { recursive: true });
await cp(join(root, 'node_modules', 'pdf-lib', 'LICENSE.md'), join(vendor, 'LICENSE-pdf-lib.md'));
await cp(join(root, 'node_modules', 'tesseract.js', 'LICENSE.md'), join(vendor, 'LICENSE-tesseract.js.md'));
await cp(join(root, 'node_modules', 'tesseract.js-core', 'LICENSE'), join(vendor, 'LICENSE-tesseract-core'));
await cp(join(root, 'node_modules', 'pdfjs-dist', 'LICENSE'), join(vendor, 'LICENSE-pdfjs-dist'));
await cp(join(root, 'node_modules', 'pdfkit', 'LICENSE'), join(vendor, 'LICENSE-pdfkit'));
await cp(join(root, 'node_modules', 'jsqr', 'LICENSE'), join(vendor, 'LICENSE-jsqr'));
await cp(join(root, 'node_modules', 'heic2any', 'LICENSE.md'), join(vendor, 'LICENSE-heic2any.md'));
await cp(join(root, 'node_modules', 'marked', 'LICENSE'), join(vendor, 'LICENSE-marked'));
await cp(join(root, 'node_modules', 'dompurify', 'LICENSE-MPL'), join(vendor, 'LICENSE-dompurify-MPL'));
await cp(join(root, 'node_modules', 'turndown', 'LICENSE'), join(vendor, 'LICENSE-turndown'));
await cp(join(root, 'node_modules', 'js-yaml', 'LICENSE'), join(vendor, 'LICENSE-js-yaml'));
await cp(join(root, 'node_modules', 'jsbarcode', 'MIT-LICENSE.txt'), join(vendor, 'LICENSE-jsbarcode.txt'));
await cp(join(root, 'node_modules', 'utif', 'LICENSE'), join(vendor, 'LICENSE-utif'));
await cp(join(root, 'node_modules', 'pako', 'LICENSE'), join(vendor, 'LICENSE-pako'));
await cp(join(root, 'node_modules', 'fflate', 'LICENSE'), join(vendor, 'LICENSE-fflate'));
await cp(join(root, 'node_modules', 'mediabunny', 'LICENSE'), join(vendor, 'LICENSE-mediabunny'));
await cp(join(root, 'node_modules', '@mediabunny', 'mp3-encoder', 'LICENSE'), join(vendor, 'LICENSE-mediabunny-mp3-encoder'));
await cp(join(root, 'node_modules', '@huggingface', 'transformers', 'LICENSE'), join(vendor, 'LICENSE-transformers-js'));
await cp(join(root, 'node_modules', 'to-words', 'LICENSE'), join(vendor, 'LICENSE-to-words'));
await cp(join(root, 'public', 'licenses', 'LICENSE-onnxruntime.txt'), join(vendor, 'LICENSE-onnxruntime-web.txt'));
await cp(join(root, 'node_modules', '@neslinesli93', 'qpdf-wasm', 'README.md'), join(vendor, 'NOTICE-qpdf-wasm.md'));
await cp(join(root, 'public', 'licenses', 'LICENSE-qpdf.txt'), join(vendor, 'LICENSE-qpdf.txt'));
await cp(join(root, 'public', 'licenses', 'LICENSE-qpdf-wasm-ISC.txt'), join(vendor, 'LICENSE-qpdf-wasm-ISC.txt'));
await cp(join(root, 'public', 'favicon.svg'), join(dist, 'favicon.svg'));
await mkdir(join(dist, 'third-party-licenses'), { recursive: true });
await cp(join(root, 'public', 'licenses', 'chess.js.txt'), join(dist, 'third-party-licenses', 'chess.js.txt'));
await cp(join(root, 'public', 'timer-notifications.js'), join(dist, 'timer-notifications.js'));
await cp(join(root, 'public', '_headers'), join(dist, '_headers'));
await cp(join(root, 'public', 'BingSiteAuth.xml'), join(dist, 'BingSiteAuth.xml'));
await cp(join(root, 'public', 'yandex_f441658073fe7135.html'), join(dist, 'yandex_f441658073fe7135.html'));
await cp(join(root, 'public', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'));
const indexNowKeyFile = '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt';
await cp(join(root, 'public', indexNowKeyFile), join(dist, indexNowKeyFile));

for (const language of Object.keys(numberWordsLocaleCodes)) {
  await writeFile(join(dist, 'assets', `number-words-${language}.js`), await numberWordsRuntimeSource(language));
}

const assetHash = createHash('sha256')
  .update(await readFile(join(dist, 'assets', 'styles.css')))
  .update(criticalCss)
  .update(await readFile(join(dist, 'assets', 'app.js')))
  .update(await readFile(join(dist, 'assets', 'advanced-tools.js')))
  .update(await readFile(join(dist, 'assets', 'advanced-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'expanded-tools.js')))
  .update(await readFile(join(dist, 'assets', 'expanded-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'new-tools.js')))
  .update(await readFile(join(dist, 'assets', 'new-tool-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'timer-logic.mjs')))
  .update(await readFile(join(dist, 'assets', 'media-tools.js')))
  .update(await readFile(join(dist, 'assets', 'media-transcription-worker.mjs')))
  .update(await readFile(join(dist, 'assets', 'tool-suite-tools.js')))
  .update(await readFile(join(dist, 'assets', 'tool-suite-ocr.js')))
  .update(await readFile(join(dist, 'assets', 'sqlite-playground-worker.js')))
  .update(await readFile(join(dist, 'assets', 'sqlite3.wasm')))
  .update(await readFile(join(dist, 'assets', 'portrait-background-worker.js')))
  .update(await Promise.all(Object.keys(numberWordsLocaleCodes).map((language) => readFile(join(dist, 'assets', `number-words-${language}.js`)))).then((files) => Buffer.concat(files)))
  .update(await readFile(join(vendor, 'media-converter.mjs')))
  .update(await readFile(join(root, 'package-lock.json')))
.update(await readFile(join(root, 'src', 'locales.mjs')));
assetHash.update(await readFile(join(root, 'public', 'timer-notifications.js')));
assetHash.update(await readFile(join(dist, 'assets', 'kanban-board.css')));
assetHash.update(await readFile(join(dist, 'assets', 'reading-speed.css')));
assetHash.update(await readFile(join(dist, 'assets', '2048-game.css')));
assetHash.update(await readFile(join(dist, 'assets', 'sudoku.css')));
assetHash.update(await readFile(join(dist, 'assets', 'tic-tac-toe.css')));
assetHash.update(await readFile(join(dist, 'assets', 'chess-game.css')));
assetHash.update(await readFile(join(dist, 'assets', 'solitaire.css')));
assetHash.update(await readFile(join(dist, 'assets', 'minesweeper.css')));
assetHash.update(await readFile(join(dist, 'assets', 'nonogram.css')));
assetHash.update(await readFile(join(dist, 'assets', 'sliding-puzzle.css')));
assetHash.update(await readFile(join(dist, 'assets', 'drum-machine.css')));
assetHash.update(await readFile(join(dist, 'assets', 'online-sequencer.css')));
assetHash.update(await readFile(join(dist, 'assets', 'css-design-tools.css')));
assetHash.update(await readFile(join(dist, 'assets', 'web-dev-tools.css')));
assetHash.update(await readFile(join(dist, 'assets', 'board-games.css')));
assetHash.update(await readFile(join(dist, 'assets', 'habit-tracker-runtime.css')));
// Any browser-loaded script uses this version token in its URL. Include every
// lazy runtime in the hash so deploying a changed module cannot keep serving a
// stale copy from the browser cache.
for (const file of [
  'plan-tools.js',
  'opportunity-runtime.js',
  'local-study-runtime.js',
  'spelling-practice-runtime.js',
  'hangul-practice-runtime.js',
  '2048-game-runtime.js',
  'sudoku-runtime.js',
  'tic-tac-toe-runtime.js',
  'chess-game-runtime.js',
  'solitaire-runtime.js',
  'minesweeper-runtime.js',
  'nonogram-runtime.js',
  'sliding-puzzle-runtime.js',
  'drum-machine-runtime.js',
  'online-sequencer-runtime.js',
  'css-design-tools.js',
  'css-design-logic.mjs',
  'web-dev-tools.js',
  'web-dev-logic.mjs',
  'board-games-runtime.js',
  'online-sequencer-logic.mjs',
  'tic-tac-toe-logic.mjs',
  'time-tracker-runtime.js',
  'weekly-meal-planner-runtime.js',
  'reading-log-runtime.js',
  'chart-runtime.js',
  'sqlite-playground-runtime.js',
  'code-formatter-runtime.js',
  'formatter-html-engine.js',
  'formatter-css-engine.js',
  'formatter-javascript-engine.js',
  'task-list-runtime.js',
  'kanban-board-runtime.js',
  'reading-speed-runtime.js',
  'habit-tracker-runtime.js',
  'chess-clock-runtime.js',
  'ear-training-runtime.js',
  'bpm-detector-runtime.js',
  'music-scale-runtime.js',
  'seating-chart-runtime.js',
  'gantt-chart-runtime.js',
  'sprite-sheet-runtime.js',
]) {
  assetHash.update(await readFile(join(dist, 'assets', file)));
}
for (const file of (await readdir(vendor, { recursive: true })).sort()) {
  const path = join(vendor, file);
  if ((await stat(path)).isFile()) assetHash.update(await readFile(path));
}
for (const folder of ['ocr-languages-4.0.0', `models-${modnetRevision}`]) {
  const directory = join(dist, 'assets', folder);
  for (const file of (await readdir(directory, { recursive: true })).sort()) {
    const path = join(directory, file);
    if ((await stat(path)).isFile()) assetHash.update(await readFile(path));
  }
}
const localeFiles = (await readdir(join(root, 'src', 'locales'), { recursive: true })).filter((file) => /\.m?js$/u.test(file) && !file.endsWith('.test.mjs')).sort();
for (const file of localeFiles) assetHash.update(await readFile(join(root, 'src', 'locales', file)));
const assetVersion = assetHash
  .digest('hex')
  .slice(0, 12);
await rename(join(vendor, 'cmaps'), join(vendor, `cmaps-${assetVersion}`));
await rename(join(vendor, 'standard_fonts'), join(vendor, `standard_fonts-${assetVersion}`));

const languages = Object.keys(locales);
const pages = [];
for (const language of languages) {
  const localizedTools = tools.map((tool) => localizedTool(tool, language));
  const localizedCategories = [ui[language]?.All ?? categories[0], ...new Set(localizedTools.map((tool) => tool.category))];
  const homePath = localePath(language);
  const homeFile = join(dist, homePath.replace(/^\//u, ''), 'index.html');
  await mkdir(join(dist, homePath.replace(/^\//u, '')), { recursive: true });
  await writeFile(homeFile, renderHome(localizedTools, localizedCategories, assetVersion, language));
  pages.push({ language, path: homePath });
  if (language !== 'en') {
    await writeFile(join(dist, 'assets', `locale-${language}.js`), await localeBundleSource(language));
  }
  for (const tool of localizedTools) {
    const toolPath = localePath(language, tool.id);
    const directory = join(dist, toolPath.replace(/^\//u, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderToolPage(tool, assetVersion, language, localizedTools));
    pages.push({ language, path: toolPath });
  }
}

// The additional 12 languages intentionally receive only genuine PDF routes;
// they do not get thin home pages or untranslated non-PDF tool URLs.
for (const language of pdfOnlyLocaleKeys) {
  const localizedTools = pdfToolIds.map((toolId) => localizedTool(tools.find((tool) => tool.id === toolId), language));
  if (language !== 'en') {
    await writeFile(join(dist, 'assets', `locale-${language}.js`), await localeBundleSource(language));
  }
  for (const tool of localizedTools) {
    const toolPath = localePath(language, tool.id);
    const directory = join(dist, toolPath.replace(/^\//u, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderToolPage(tool, assetVersion, language, localizedTools));
    pages.push({ language, path: toolPath });
  }
}

for (const language of languages) {
  const localizedGuides = guidesForLocale(language);
  if (!localizedGuides || localizedGuides.length !== guides.length) throw new Error(`Missing complete guide translations for ${language}`);
  const indexRoute = guidePath('', language);
  const indexDirectory = join(dist, indexRoute.replace(/^\//u, ''));
  await mkdir(indexDirectory, { recursive: true });
  await writeFile(join(indexDirectory, 'index.html'), renderGuidesIndex(localizedGuides, assetVersion, language));
  pages.push({ language, path: indexRoute });
  for (const guide of localizedGuides) {
    const route = guidePath(guide.slug, language);
    const directory = join(dist, route.replace(/^\//u, ''));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), renderGuidePage(guide, assetVersion, language));
    pages.push({ language, path: route });
  }
}

await deferFullStyles(dist);

// Every rendered page has reciprocal HTML hreflang tags. Repeating all locale
// alternates inside every sitemap URL made the XML grow quadratically; keep the
// sitemap to its canonical URL inventory so future localized tools stay below
// Cloudflare Pages' single-file limit.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ path }) => `  <url><loc>https://usefulverse.com${path}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://usefulverse.com/sitemap.xml\n`);
await writeFile(join(dist, 'llms.txt'), `# UsefulVerse\n\n> Fast, private browser tools for text, data, SEO and everyday tasks.\n\nUsefulVerse is a static website of small online tools. Browser-first tools process user input locally and do not require an account or upload.\n\n## Tools\n\n${tools.map((tool) => `- [${tool.title}](https://usefulverse.com/tools/${tool.id}/): ${tool.description}`).join('\n')}\n\n## Guides\n\n- [UsefulVerse Guides](https://usefulverse.com${guidePath()})\n${guides.map((guide) => `- [${guide.title}](https://usefulverse.com${guidePath(guide.slug)}): ${guide.description}`).join('\n')}\n\n## Site\n\n- [Home](https://usefulverse.com/)\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`);
await writeFile(join(dist, '404.html'), renderNotFoundPage());
for (const language of languages.filter((key) => key !== 'en')) {
  const localizedTools = tools.map((tool) => localizedTool(tool, language));
  const homeUrl = `https://usefulverse.com${localePath(language)}`;
  const homeLabel = packs[language]?.meta.homeLabel ?? { es: 'Inicio', fr: 'Accueil', pt: 'Página inicial', de: 'Startseite' }[language] ?? 'Home';
  const localLlms = `# UsefulVerse — ${locales[language].name}\n\n> ${locales[language].homeDescription}\n\n${localizedTools.map((tool) => `- [${tool.title}](https://usefulverse.com${localePath(language, tool.id)}): ${tool.description}`).join('\n')}\n\n- [${homeLabel}](${homeUrl})\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`;
  const localeDirectory = localePath(language).replace(/^\//u, '').replace(/\/$/u, '');
  const localizedGuides = guidesForLocale(language);
  const guideListings = localizedGuides.length ? `\n## Guides\n\n- [${packs[language]?.ui['UsefulVerse Guides'] ?? 'UsefulVerse Guides'}](https://usefulverse.com${guidePath('', language)})\n${localizedGuides.map((guide) => `- [${guide.title}](https://usefulverse.com${guidePath(guide.slug, language)}): ${guide.description}`).join('\n')}` : '';
  await writeFile(join(dist, localeDirectory, 'llms.txt'), localLlms.replace(/\n- \[Sitemap\][\s\S]*$/u, `${guideListings}\n\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`));
}
for (const language of pdfOnlyLocaleKeys) {
  const localizedTools = pdfToolIds.map((toolId) => localizedTool(tools.find((tool) => tool.id === toolId), language));
  const homeUrl = `https://usefulverse.com${localeHomePath(language)}`;
  const localLlms = `# UsefulVerse — ${pdfOnlyLocales[language].name}\n\n> ${pdfOnlyLocales[language].homeDescription}\n\n${localizedTools.map((tool) => `- [${tool.title}](https://usefulverse.com${localePath(language, tool.id)}): ${tool.description}`).join('\n')}\n\n- [${pdfOnlyPacks[language].meta.homeLabel}](${homeUrl})\n- [Sitemap](https://usefulverse.com/sitemap.xml)\n`;
  const localeDirectory = pdfOnlyLocales[language].prefix.replace(/^\//u, '');
  await mkdir(join(dist, localeDirectory), { recursive: true });
  await writeFile(join(dist, localeDirectory, 'llms.txt'), localLlms);
}
const pageBreakdown = `${tools.length} tools × ${languages.length} languages, ${languages.length} localized home pages, and ${guides.length + 1} guide routes × ${languages.length} languages${pdfOnlyLocaleKeys.length ? `, plus ${pdfToolIds.length} PDF tools × ${pdfOnlyLocaleKeys.length} PDF-only languages` : ''}`;
console.log(`Built ${pages.length} pages (${pageBreakdown}) in ${dist}`);
