import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { seo } from '../src/seo.mjs';
import { localePath, locales, localizedTool, numberWordsLocaleCodes, packs, pdfLocaleEntries, pdfOnlyLocaleKeys, pdfOnlyLocales, pdfOnlyPacks, pdfToolIds, ui } from '../src/locales.mjs';
import { longtailBodies, longtailFaqs } from '../src/locales/longtail.mjs';
import { relatedToolIds } from '../src/template.mjs';
import { guideCanonical, guidePath, guides, guidesForLocale } from '../src/guides.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = process.env.USEFULVERSE_DIST ? resolve(process.env.USEFULVERSE_DIST) : join(root, 'dist');
const languages = Object.keys(locales);
const localizedFiles = languages.filter((language) => language !== 'en').flatMap((language) => [
  `assets/locale-${language}.js`,
  `${localePath(language).replace(/^\//u, '').replace(/\/$/u, '')}/llms.txt`,
]);
for (const language of pdfOnlyLocaleKeys) localizedFiles.push(
  `assets/locale-${language}.js`,
  `${pdfOnlyLocales[language].prefix.replace(/^\//u, '')}/llms.txt`,
);
for (const language of Object.keys(numberWordsLocaleCodes)) localizedFiles.push(`assets/number-words-${language}.js`);
const required = ['index.html', '404.html', 'assets/styles.css', 'assets/app.js', 'assets/chart-runtime.js', 'assets/sqlite-playground-runtime.js', 'assets/code-formatter-runtime.js', 'assets/formatter-html-engine.js', 'assets/formatter-css-engine.js', 'assets/formatter-javascript-engine.js', 'assets/chess-clock-runtime.js', 'assets/ear-training-runtime.js', 'assets/bpm-detector-runtime.js', 'assets/music-scale-runtime.js', 'assets/seating-chart-runtime.js', 'assets/gantt-chart-runtime.js', 'assets/sprite-sheet-runtime.js', 'assets/kanban-board-runtime.js', 'assets/kanban-board.css', 'assets/reading-speed-runtime.js', 'assets/habit-tracker-runtime.js', 'assets/habit-tracker-runtime.css', 'assets/reading-speed.css', 'assets/timer-logic.mjs', 'assets/tic-tac-toe-runtime.js', 'assets/tic-tac-toe-logic.mjs', 'assets/tic-tac-toe.css', 'assets/chess-game-runtime.js', 'assets/chess-game.css', 'assets/solitaire-runtime.js', 'assets/solitaire.css', 'assets/minesweeper-runtime.js', 'assets/minesweeper.css', 'assets/nonogram-runtime.js', 'assets/nonogram.css', 'assets/sliding-puzzle-runtime.js', 'assets/sliding-puzzle.css', 'assets/drum-machine-runtime.js', 'assets/drum-machine.css', 'assets/online-sequencer-runtime.js', 'assets/online-sequencer-logic.mjs', 'assets/online-sequencer.css', 'assets/board-games-runtime.js', 'assets/board-games.css', 'assets/measurement-tools-runtime.js', 'assets/measurement-tools.css', 'assets/print-studio-runtime.js', 'assets/print-studio.css', 'third-party-licenses/chess.js.txt', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt', 'timer-notifications.js', ...localizedFiles, 'BingSiteAuth.xml', 'yandex_f441658073fe7135.html', 'naverbbd67ca2bfab12f8138c42ad5d27c664.html', '4fe0d351af80cfb3bc08a274c1875a4dc73650fd479d11fe4a414e82b5f41e98.txt'];
required.push('assets/audio-analysis-runtime.js', 'assets/audio-analysis-logic.mjs', 'assets/audio-analysis.css');
required.push('assets/fretboard-trainer-runtime.js', 'assets/fretboard-trainer.css', 'assets/font-tester-runtime.js');
function assertLanguagePicker(html, currentLanguage, availableLocales, toolId, context, routeForLocale = (key) => localePath(key, toolId)) {
  const currentLocale = availableLocales.find(({ key }) => key === currentLanguage);
  const languageLabel = ui[currentLanguage]?.Language ?? 'Language';
  if (!currentLocale) throw new Error(`Current language ${currentLanguage} is missing from picker on ${context}`);
  if (!html.includes(`class="language-picker__trigger" type="button" aria-expanded="false" aria-controls="language-picker-options" aria-label="${languageLabel}: ${currentLocale.name}"`)) throw new Error(`Missing localized language-picker button on ${context}`);
  const options = [...html.matchAll(/<a class="language-picker__option"[^>]*>([\s\S]*?)<\/a>/gu)];
  if (options.length !== availableLocales.length) throw new Error(`Expected ${availableLocales.length} language options on ${context}, found ${options.length}`);
  for (const locale of availableLocales) {
    const href = routeForLocale(locale.key);
    const isCurrent = locale.key === currentLanguage;
    const openingTag = `<a class="language-picker__option" href="${href}" hreflang="${locale.code}" lang="${locale.code}" dir="auto"${isCurrent ? ' aria-current="page"' : ''}>`;
    const match = options.find(([markup]) => markup.startsWith(openingTag));
    if (!match || !match[1].includes(`<span>${locale.name}</span>`)) throw new Error(`Missing native-language picker entry for ${locale.key} on ${context}`);
  }
  if (options.filter(([markup]) => markup.includes('aria-current="page"')).length !== 1) throw new Error(`Language picker must mark exactly one current locale on ${context}`);
}
const notFound = await readFile(join(dist, '404.html'), 'utf8');
if (!notFound.includes('<meta name="robots" content="noindex,follow">') || /<link rel="canonical"/u.test(notFound)) throw new Error('404 page must be noindex and must not claim a canonical URL');
for (const language of languages) if (!notFound.includes(`href="${localePath(language)}"`)) throw new Error(`404 page is missing its ${language} home link`);
for (const file of required) await access(join(dist, file));
await access(join(dist, 'assets', 'time-tracker-runtime.js'));
await access(join(dist, 'assets', 'weekly-meal-planner-runtime.js'));
await access(join(dist, 'assets', 'reading-log-runtime.js'));
await access(join(dist, 'assets', 'css-design-tools.js'));
await access(join(dist, 'assets', 'css-design-logic.mjs'));
await access(join(dist, 'assets', 'css-design-tools.css'));
await access(join(dist, 'assets', 'web-dev-tools.js'));
await access(join(dist, 'assets', 'web-dev-logic.mjs'));
await access(join(dist, 'assets', 'web-dev-tools.css'));
await access(join(dist, 'assets', 'local-planners-runtime.js'));
const deferredAssetBudgets = new Map([
  ['assets/app.js', 72 * 1024], ['assets/styles.css', 54 * 1024],
  ['assets/new-tools.js', 32 * 1024], ['assets/expanded-tools.js', 40 * 1024],
  ['assets/advanced-tools.js', 52 * 1024], ['assets/media-tools.js', 16 * 1024],
  ['assets/plan-tools.js', 55 * 1024], ['assets/tool-suite-tools.js', 150 * 1024],
  // This runtime is deferred until a tool opens; keep it below 132 KiB while it hosts the expanding local-tool catalog.
  ['assets/opportunity-runtime.js', 132 * 1024], ['assets/new-tool-logic.mjs', 16 * 1024], ['assets/timer-logic.mjs', 16 * 1024],
  ['assets/time-tracker-runtime.js', 8 * 1024],
  ['assets/weekly-meal-planner-runtime.js', 12 * 1024],
  ['assets/reading-log-runtime.js', 12 * 1024],
  ['assets/local-planners-runtime.js', 12 * 1024],
  ['assets/local-study-runtime.js', 12 * 1024],
  ['assets/spelling-practice-runtime.js', 8 * 1024],
  ['assets/hangul-practice-runtime.js', 8 * 1024],
  ['assets/2048-game-runtime.js', 8 * 1024],
  ['assets/2048-game.css', 2 * 1024],
  ['assets/sudoku-runtime.js', 12 * 1024],
  ['assets/sudoku.css', 3 * 1024],
  ['assets/tic-tac-toe-runtime.js', 8 * 1024],
  ['assets/tic-tac-toe-logic.mjs', 4 * 1024],
  ['assets/tic-tac-toe.css', 2 * 1024],
  ['assets/chess-game-runtime.js', 90 * 1024],
  ['assets/chess-game.css', 3 * 1024],
  ['assets/solitaire-runtime.js', 16 * 1024],
  ['assets/solitaire.css', 4 * 1024],
  ['assets/minesweeper-runtime.js', 12 * 1024],
  ['assets/minesweeper.css', 4 * 1024],
  ['assets/nonogram-runtime.js', 10 * 1024],
  ['assets/nonogram.css', 3 * 1024],
  ['assets/sliding-puzzle-runtime.js', 8 * 1024],
  ['assets/sliding-puzzle.css', 2 * 1024],
  ['assets/drum-machine-runtime.js', 12 * 1024],
  ['assets/drum-machine.css', 3 * 1024],
  ['assets/online-sequencer-runtime.js', 12 * 1024],
  ['assets/online-sequencer-logic.mjs', 4 * 1024],
  ['assets/online-sequencer.css', 3 * 1024],
  ['assets/audio-analysis-runtime.js', 12 * 1024], ['assets/audio-analysis-logic.mjs', 8 * 1024], ['assets/audio-analysis.css', 3 * 1024],
  ['assets/fretboard-trainer-runtime.js', 6 * 1024], ['assets/fretboard-trainer.css', 2 * 1024],
  ['assets/font-tester-runtime.js', 5 * 1024],
  ['assets/css-design-tools.js', 8 * 1024],
  ['assets/css-design-logic.mjs', 4 * 1024],
  ['assets/css-design-tools.css', 4 * 1024],
  ['assets/web-dev-tools.js', 12 * 1024],
  ['assets/web-dev-logic.mjs', 8 * 1024],
  ['assets/web-dev-tools.css', 4 * 1024],
  ['assets/board-games-runtime.js', 12 * 1024], ['assets/board-games.css', 4 * 1024],
  ['assets/measurement-tools-runtime.js', 8 * 1024], ['assets/measurement-tools.css', 3 * 1024],
  ['assets/print-studio-runtime.js', 8 * 1024], ['assets/print-studio.css', 4 * 1024],
  ['assets/chart-runtime.js', 8 * 1024],
  ['assets/sqlite-playground-runtime.js', 8 * 1024],
  ['assets/code-formatter-runtime.js', 8 * 1024],
  ['assets/formatter-html-engine.js', 3 * 1024 * 1024],
  ['assets/formatter-css-engine.js', 3 * 1024 * 1024],
  ['assets/formatter-javascript-engine.js', 3 * 1024 * 1024],
  ['assets/task-list-runtime.js', 8 * 1024],
  ['assets/kanban-board-runtime.js', 12 * 1024],
  ['assets/kanban-board.css', 3 * 1024],
  ['assets/reading-speed-runtime.js', 12 * 1024],
  ['assets/habit-tracker-runtime.js', 10 * 1024],
  ['assets/habit-tracker-runtime.css', 4 * 1024],
  ['assets/reading-speed.css', 3 * 1024],
  ['assets/chess-clock-runtime.js', 8 * 1024],
  ['assets/ear-training-runtime.js', 8 * 1024],
  ['assets/bpm-detector-runtime.js', 8 * 1024],
  ['assets/music-scale-runtime.js', 8 * 1024],
  ['assets/seating-chart-runtime.js', 10 * 1024],
  ['assets/gantt-chart-runtime.js', 10 * 1024],
  ['assets/sprite-sheet-runtime.js', 12 * 1024],
  ['assets/expanded-logic.mjs', 16 * 1024], ['assets/advanced-logic.mjs', 16 * 1024],
]);
for (const [file, budget] of deferredAssetBudgets) {
  const bytes = (await stat(join(dist, file))).size;
  if (bytes > budget) throw new Error(`Shared or deferred asset exceeded its ${budget}-byte budget: ${file} is ${bytes} bytes.`);
}
for (const file of await readdir(join(dist, 'assets'))) {
  if (!/^locale-[\w-]+\.js$/u.test(file)) continue;
  const bytes = (await stat(join(dist, 'assets', file))).size;
  if (bytes > 320 * 1024) throw new Error(`Locale bundle exceeded its 327680-byte budget: ${file} is ${bytes} bytes.`);
}
const headers = await readFile(join(dist, '_headers'), 'utf8');
const globalHeaderBlock = headers.split(/\n\s*\n/u).find((block) => block.startsWith('/*')) ?? '';
if (!globalHeaderBlock.includes('Permissions-Policy: camera=(self), geolocation=()') || /Permissions-Policy: [^\n]*microphone=\(\)/u.test(globalHeaderBlock) || !headers.includes('/tools/voice-recorder/*\n  Permissions-Policy: microphone=(self)') || !headers.includes('/tools/guitar-tuner/*\n  Permissions-Policy: microphone=(self)')) {
  throw new Error('Do not globally deny microphone access: Cloudflare Pages merges matching Permissions-Policy headers. Keep microphone prompts user-initiated in the recorder and guitar tuner routes.');
}
const timerPage = await readFile(join(dist, localePath('en', 'online-timer').replace(/^\//u, '') + 'index.html'), 'utf8');
for (const feature of ['data-timer-mode="pomodoro"', 'id="long-break-minutes"', 'id="long-break-every"', 'id="timer-auto-start"', 'id="timer-sound"', 'id="timer-audio-status"', 'data-action="timer-test-sound"', 'data-action="timer-enable-notifications"', 'data-action="timer-skip"', 'data-action="timer-clear-data"']) {
  if (!timerPage.includes(feature)) throw new Error(`Online timer is missing its required control: ${feature}`);
}
const minesweeperPage = await readFile(join(dist, localePath('en', 'minesweeper').replace(/^\//u, '') + 'index.html'), 'utf8');
for (const feature of ['data-minesweeper-difficulty', 'data-minesweeper-new', 'data-minesweeper-flag-mode', 'data-minesweeper-mines-left', 'data-minesweeper-time', 'data-minesweeper-board']) {
  if (!minesweeperPage.includes(feature)) throw new Error(`Minesweeper is missing its required control: ${feature}`);
}
const nonogramPage = await readFile(join(dist, localePath('en', 'nonogram').replace(/^\//u, '') + 'index.html'), 'utf8');
for (const feature of ['data-nonogram-new', 'data-nonogram-check', 'data-nonogram-clear', 'data-nonogram-board']) {
  if (!nonogramPage.includes(feature)) throw new Error(`Nonogram is missing its required control: ${feature}`);
}
const slidingPage = await readFile(join(dist, localePath('en', 'sliding-puzzle').replace(/^\//u, '') + 'index.html'), 'utf8');
for (const feature of ['data-sliding-size', 'data-sliding-new', 'data-sliding-moves', 'data-sliding-board']) {
  if (!slidingPage.includes(feature)) throw new Error(`Sliding puzzle is missing its required control: ${feature}`);
}
for (const language of languages) {
  const drumPath = join(dist, localePath(language, 'drum-machine').replace(/^\//u, '') + 'index.html');
  const drumPage = await readFile(drumPath, 'utf8');
  for (const feature of ['data-drum-tempo', 'data-drum-play', 'data-drum-clear', 'data-drum-board', 'data-planner-messages=', '/assets/drum-machine.css?v=']) {
    if (!drumPage.includes(feature)) throw new Error(`Drum machine is missing ${feature} in ${language}`);
  }
}
for (const language of languages) {
  const sequencePath = join(dist, localePath(language, 'online-sequencer').replace(/^\//u, '') + 'index.html');
  const sequencePage = await readFile(sequencePath, 'utf8');
  for (const feature of ['data-sequencer-tempo', 'data-sequencer-play', 'data-sequencer-clear', 'data-sequencer-board', 'data-sequencer-midi', 'data-planner-messages=', '/assets/online-sequencer.css?v=']) {
    if (!sequencePage.includes(feature)) throw new Error(`Online sequencer is missing ${feature} in ${language}`);
  }
  for (const label of ['MIDI download started.', 'Tempo', 'Note {note}, step {number}']) {
    const translated = packs[language]?.runtime?.[label];
    if (translated && !sequencePage.includes(translated)) throw new Error(`Online sequencer is missing localized message "${label}" in ${language}`);
  }
}
for (const language of languages) {
  const fretboardPath = join(dist, localePath(language, 'fretboard-trainer').replace(/^\//u, '') + 'index.html');
  const fretboardPage = await readFile(fretboardPath, 'utf8');
  for (const feature of ['data-fretboard-trainer', 'data-fretboard-prompt', 'data-fretboard-answers', 'data-fretboard-next', 'data-fretboard-reset', 'data-planner-messages=', '/assets/fretboard-trainer.css?v=']) {
    if (!fretboardPage.includes(feature)) throw new Error(`Fretboard trainer is missing ${feature} in ${language}`);
  }
}
const naverVerification = await readFile(join(dist, 'naverbbd67ca2bfab12f8138c42ad5d27c664.html'), 'utf8');
if (naverVerification !== 'naver-site-verification: naverbbd67ca2bfab12f8138c42ad5d27c664.html\n') throw new Error('Naver verification file content does not match the downloaded file');
const pages = [];
const titlesByLanguage = new Map([...languages, ...pdfOnlyLocaleKeys].map((language) => [language, new Set()]));
for (const language of languages) {
  const homePath = join(dist, localePath(language).replace(/^\//u, ''), 'index.html');
  pages.push({ path: homePath, language, tool: null });
  const home = await readFile(homePath, 'utf8');
  const direction = packs[language]?.meta.direction ?? 'ltr';
  if (!home.includes(`<html lang="${locales[language].code}" dir="${direction}" data-asset-version="`) || !home.includes('id="tool-grid"')) throw new Error(`Incomplete ${language} home page or wrong text direction`);
  assertLanguagePicker(home, language, languages.map((key) => ({ key, ...locales[key] })), '', `${language} home`);
  if (!home.includes(`rel="canonical" href="https://usefulverse.com${localePath(language)}"`)) throw new Error(`Missing canonical on ${language} home`);
  for (const alternate of languages) if (!home.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${localePath(alternate)}"`)) throw new Error(`Missing ${alternate} alternate on ${language} home`);
  const localizedHomeMarker = packs[language]?.meta.homeMarker ?? { es: 'Herramientas', fr: 'Outils', pt: 'Ferramentas', de: 'Tool-Sammlung' }[language];
  if (localizedHomeMarker && !home.includes(localizedHomeMarker)) throw new Error(`Home copy is not localized for ${language}`);
  for (const tool of tools.map((item) => localizedTool(item, language))) {
    const path = join(dist, localePath(language, tool.id).replace(/^\//u, ''), 'index.html');
    pages.push({ path, language, tool });
    await access(path);
    const html = await readFile(path, 'utf8');
    const canonical = `https://usefulverse.com${localePath(language, tool.id)}`;
    if (!html.includes(`<html lang="${locales[language].code}" dir="${direction}" data-asset-version="`)) throw new Error(`Wrong html lang or text direction for ${language}/${tool.id}`);
    const availableLocales = pdfToolIds.includes(tool.id) ? pdfLocaleEntries : languages.map((key) => ({ key, ...locales[key] }));
    assertLanguagePicker(html, language, availableLocales, tool.id, `${language}/${tool.id}`);
    if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error(`Missing canonical for ${language}/${tool.id}`);
    const alternateLanguages = availableLocales;
    for (const alternate of alternateLanguages) if (!html.includes(`hreflang="${alternate.code}" href="https://usefulverse.com${localePath(alternate.key, tool.id)}"`)) throw new Error(`Missing ${alternate.key} alternate for ${language}/${tool.id}`);
    if (!html.includes(`data-tool="${tool.id}"`)) throw new Error(`Missing tool runtime for ${language}/${tool.id}`);
    if (!html.includes('data-tool-follow-up') || !html.includes('data-tool-follow-up-links') || !html.includes('data-tool-follow-up-dismiss')) throw new Error(`Missing dismissible contextual next-step links for ${language}/${tool.id}`);
    const relatedHeading = packs[language]?.ui['More useful tools'] ?? { en: 'More useful tools', es: 'Más herramientas útiles', fr: 'Plus d’outils utiles', pt: 'Mais ferramentas úteis', de: 'Weitere nützliche Tools' }[language];
    if (!html.includes(relatedHeading)) throw new Error(`Missing localized related-tools heading for ${language}/${tool.id}`);
    if (!html.includes('"@type":"WebApplication"') || !html.includes('property="og:title"')) throw new Error(`Missing SEO schema or social metadata for ${language}/${tool.id}`);
    if (!html.includes('"@type":"FAQPage"') || !html.includes('class="tool-faq"')) throw new Error(`Missing FAQ content for ${language}/${tool.id}`);
    if (tool.id === 'number-to-words-converter' && numberWordsLocaleCodes[language]) {
      const version = html.match(/data-asset-version="([a-f0-9]{12})"/u)?.[1];
      if (!version || !html.includes(`<script defer src="/assets/number-words-${language}.js?v=${version}"></script>`)) throw new Error(`Missing local number-to-words runtime for ${language}`);
    }
    if (tool.id === 'reading-speed-test') {
      for (const control of ['data-reading-speed', 'data-reading-text', 'maxlength="50000"', 'data-reading-start', 'data-reading-pause', 'data-reading-resume', 'data-reading-finish', 'data-reading-reset', 'data-reading-result', 'data-reading-rating']) {
        if (!html.includes(control)) throw new Error(`Reading speed page is missing ${control} in ${language}`);
      }
      if (!html.includes('/assets/reading-speed.css?v=') || !html.includes('data-reading-messages=')) throw new Error(`Reading speed page is missing localized or page-specific assets in ${language}`);
    }
    if (language === 'en' && seo[tool.id]?.faq?.length && !html.includes(seo[tool.id].faq[0].question)) throw new Error(`English FAQ mismatch for ${tool.id}`);
    const expectedBody = longtailBodies[tool.id]?.[language];
    if (expectedBody && !html.includes(expectedBody.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'))) throw new Error(`Missing localized long-tail explanation for ${language}/${tool.id}`);
    const expectedFaq = longtailFaqs[tool.id]?.[language];
    if (expectedFaq) for (const { question, answer } of expectedFaq) {
      if (!html.includes(question) || !html.includes(answer)) throw new Error(`Missing localized long-tail FAQ for ${language}/${tool.id}: ${question}`);
    }
    const expectedRelated = relatedToolIds[tool.id];
    if (expectedRelated) for (const relatedId of expectedRelated) {
      if (!html.includes(`href="${localePath(language, relatedId)}"`)) throw new Error(`Missing contextual ${relatedId} link on ${language}/${tool.id}`);
    }
  }
}
for (const language of pdfOnlyLocaleKeys) {
  const locale = pdfOnlyLocales[language];
  const pack = pdfOnlyPacks[language];
  for (const toolId of pdfToolIds) {
    const path = join(dist, localePath(language, toolId).replace(/^\//u, ''), 'index.html');
    await access(path);
    const html = await readFile(path, 'utf8');
    pages.push({ path, language, tool: localizedTool(tools.find((item) => item.id === toolId), language) });
    assertLanguagePicker(html, language, pdfLocaleEntries, toolId, `${language}/${toolId}`);
    if (!html.includes(`<html lang="${locale.code}" dir="${pack.meta.direction ?? 'ltr'}" data-asset-version="`)) throw new Error(`Wrong html lang or text direction for ${language}/${toolId}`);
    if (!html.includes(`rel="canonical" href="https://usefulverse.com${localePath(language, toolId)}"`)) throw new Error(`Missing canonical for ${language}/${toolId}`);
    if (!html.includes(`href="${localePath(language, 'pdf-tools')}" aria-label="${ui[language]['UsefulVerse home']}"`)) throw new Error(`PDF-only header points to a non-existent or untranslated home for ${language}/${toolId}`);
    for (const alternate of pdfLocaleEntries) if (!html.includes(`hreflang="${alternate.code}" href="https://usefulverse.com${localePath(alternate.key, toolId)}"`)) throw new Error(`Missing ${alternate.key} PDF alternate for ${language}/${toolId}`);
    const translated = pack.copy[toolId];
    if (!translated || !html.includes(translated[0]) || !html.includes(translated[4]) || !html.includes(translated[5])) throw new Error(`Localized page copy/FAQ is incomplete for ${language}/${toolId}`);
    const nonPdfPath = join(dist, localePath(language, 'word-counter').replace(/^\//u, ''), 'index.html');
    try {
      await access(nonPdfPath);
      throw new Error(`Unexpected non-PDF route was generated for PDF-only locale ${language}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}
for (const language of languages) {
  const localizedGuides = guidesForLocale(language);
  if (!localizedGuides || localizedGuides.length !== guides.length) throw new Error(`Expected ${guides.length} localized guides for ${language}`);
  const indexRoute = guidePath('', language);
  const indexPath = join(dist, indexRoute.replace(/^\//u, ''), 'index.html');
  await access(indexPath);
  pages.push({ path: indexPath, language, tool: null, guide: null });
  const indexHtml = await readFile(indexPath, 'utf8');
  if (!indexHtml.includes(`<link rel="canonical" href="${guideCanonical('', language)}">`) || !indexHtml.includes('"@type":"CollectionPage"')) throw new Error(`Guide index is missing its canonical or collection schema in ${language}`);
  assertLanguagePicker(indexHtml, language, languages.map((key) => ({ key, ...locales[key] })), '', `${language} guides index`, (key) => guidePath('', key));
  for (const alternate of languages) if (!indexHtml.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${guidePath('', alternate)}"`)) throw new Error(`Guide index is missing the ${alternate} alternate for ${language}`);
  for (const guide of localizedGuides) {
    const route = guidePath(guide.slug, language);
    const path = join(dist, route.replace(/^\//u, ''), 'index.html');
    await access(path);
    const html = await readFile(path, 'utf8');
    pages.push({ path, language, tool: null, guide });
    if (!html.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, language)}">`)) throw new Error(`Missing canonical for ${language}/${guide.slug}`);
    if (!html.includes(`<html lang="${locales[language].code}" dir="${packs[language]?.meta.direction ?? 'ltr'}" data-asset-version="`) || !html.includes('"@type":"Article"')) throw new Error(`Guide ${language}/${guide.slug} is missing its language or article schema`);
    assertLanguagePicker(html, language, languages.map((key) => ({ key, ...locales[key] })), '', `${language}/${guide.slug}`, (key) => guidePath(guide.slug, key));
    for (const alternate of languages) if (!html.includes(`hreflang="${locales[alternate].code}" href="https://usefulverse.com${guidePath(guide.slug, alternate)}"`)) throw new Error(`Guide ${language}/${guide.slug} is missing the ${alternate} alternate`);
    if (!html.includes(`href="${localePath(language, guide.toolId)}"`)) throw new Error(`Guide ${language}/${guide.slug} is missing its localized related-tool CTA`);
    const sourceHeading = ui[language]?.['Sources and further reading'] ?? 'Sources and further reading';
    if (!html.includes(sourceHeading) || !guide.sources?.every(({ url }) => html.includes(`href="${url}"`))) throw new Error(`Guide ${language}/${guide.slug} is missing its source links`);
  }
}
const home = await readFile(join(dist, 'index.html'), 'utf8');
if (!home.includes('href="/guides/">Guides</a>')) throw new Error('English home page is missing the guides navigation link');
const assetVersion = home.match(/\/assets\/app\.js\?v=([a-f0-9]{12})/u)?.[1];
if (!assetVersion || !home.includes(`/assets/styles.css?v=${assetVersion}`)) throw new Error('Hashed asset URLs are missing');
for (const toolId of ['pdf-protect-unlock', 'pdf-repair', 'pdf-crop', 'pdf-redact', 'pdf-to-pdfa', 'pdf-page-editor', 'pdf-ocr', 'pdf-document-converter', 'html-to-pdf', 'pdf-to-markdown', 'pdf-form-filler', 'pdf-compare', 'zip-archive-tool', 'media-converter', 'scientific-calculator', 'loan-calculator', 'compound-interest-calculator', 'invoice-generator', 'resume-builder', 'portrait-background-remover']) {
  const page = await readFile(join(dist, localePath('en', toolId).replace(/^\//u, ''), 'index.html'), 'utf8');
  if (!page.includes(`data-tool="${toolId}"`) || !page.includes(`v=${assetVersion}`)) throw new Error(`Suite tool ${toolId} is missing its versioned runtime or page markup`);
}
for (const asset of ['assets/tool-suite-tools.js', 'assets/tool-suite-ocr.js', 'assets/portrait-background-worker.js', 'assets/vendor/pdf-qpdf-worker.mjs', 'assets/vendor/pdf-crop-worker.mjs', 'assets/vendor/pdfa-worker.mjs', 'assets/vendor/LICENSE-pdfkit', 'assets/vendor/qpdf.wasm', 'assets/vendor/tesseract-7.0.0/worker.min.js', 'assets/vendor/tesseract-7.0.0/tesseract-core-lstm.wasm', 'assets/vendor/tesseract-7.0.0/tesseract-core-simd-lstm.wasm', 'assets/vendor/tesseract-7.0.0/tesseract-core-relaxedsimd-lstm.wasm.js', 'assets/vendor/tesseract-7.0.0/tesseract-core-relaxedsimd-lstm.wasm', 'assets/ocr-languages-4.0.0/eng.traineddata.gz', 'assets/models-fa2fa546052fba4c08921230a26cc69a333fca12/Xenova/modnet/onnx/model_quantized.onnx']) await access(join(dist, asset));
for (const file of await readdir(dist, { recursive: true })) {
  const path = join(dist, file);
  if ((await stat(path)).isFile() && (await stat(path)).size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages asset exceeds 25 MiB: ${file}`);
}
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const sitemapCount = [...sitemap.matchAll(/<loc>https:\/\/usefulverse\.com\//gu)].length;
if (sitemapCount !== pages.length) throw new Error(`Sitemap expected ${pages.length} URLs, found ${sitemapCount}`);
if (sitemap.includes('xhtml:link') || sitemap.includes('hreflang=')) throw new Error('Sitemap must stay compact; localized alternates belong in reciprocal HTML head tags');
for (const language of languages) {
  const paths = [localePath(language), ...tools.map((tool) => localePath(language, tool.id)), guidePath('', language), ...guides.map((guide) => guidePath(guide.slug, language))];
  const count = paths.filter((path) => sitemap.includes(`<loc>https://usefulverse.com${path}</loc>`)).length;
  const expected = tools.length + guides.length + 2;
  if (count !== expected) throw new Error(`Sitemap has ${count} URLs for ${language}; expected ${expected}`);
}
for (const language of pdfOnlyLocaleKeys) {
  const paths = pdfToolIds.map((toolId) => localePath(language, toolId));
  const count = paths.filter((path) => sitemap.includes(`<loc>https://usefulverse.com${path}</loc>`)).length;
  if (count !== pdfToolIds.length) throw new Error(`Sitemap has ${count} PDF URLs for ${language}; expected ${pdfToolIds.length}`);
  if (sitemap.includes(`<loc>https://usefulverse.com${localePath(language)}</loc>`)) throw new Error(`Sitemap must not invent a general-language home page for ${language}`);
}
for (const language of languages) for (const guide of guidesForLocale(language)) {
  const route = guidePath(guide.slug, language);
  if (!sitemap.includes(`<loc>https://usefulverse.com${route}</loc>`)) throw new Error(`Sitemap is missing guide ${route}`);
  const toolPage = await readFile(join(dist, localePath(language, guide.toolId).replace(/^\//u, ''), 'index.html'), 'utf8');
  if (!toolPage.includes(`href="${route}"`)) throw new Error(`Related ${language} tool page is missing guide ${guide.slug}`);
}
for (const { path, language } of pages) {
  const html = await readFile(path, 'utf8');
  const unescape = (value) => value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&');
  const title = unescape(html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '');
  const description = unescape(html.match(/<meta name="description" content="([^"]+)"/u)?.[1] ?? '');
  if (title.length < 15 || title.length > 65) throw new Error(`Title length is invalid in ${path}: ${title.length}`);
  if (description.length < 25 || description.length > 155) throw new Error(`Description length is invalid in ${path}: ${description.length}`);
  const titles = titlesByLanguage.get(language);
  if (titles.has(title)) throw new Error(`Duplicate title in ${language}: ${title}`);
  titles.add(title);
}

// Language packs are strict: no visible text or aria-label/placeholder/title may still equal an English UI string.
const decodeEntities = (value) => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'");
const visibleStrings = (html) => html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/giu).flatMap((part) => {
  if (/^<(?:script|style)\b/iu.test(part)) return [];
  const values = part.startsWith('<') ? [...part.matchAll(/\b(?:aria-label|placeholder|title)="([^"]*)"/gu)].map((match) => match[1]) : [part];
  return values.map((value) => decodeEntities(value).trim()).filter((value) => /\p{L}/u.test(value));
});
const englishStrings = new Set();
for (const { path, language } of pages) if (language === 'en') for (const value of visibleStrings(await readFile(path, 'utf8'))) englishStrings.add(value);
// Equations, code samples, color literals, and numeric placeholders are intentionally language-neutral.
const universalStrings = new Set(['usefulverse', 'UsefulVerse', 'useful', 'verse', 'JSON Web Token', 'Base64', 'JSON', 'CSV', 'UUID', 'SHA-256', 'UTC', 'HEX', 'RGB', 'HSL', 'JPG', 'JPEG', 'PNG', 'WebP', 'PDF', 'M4A (AAC)', 'OGG (Opus)', 'Bahasa Indonesia', '<note><to>Alex</to></note>', '256 px', '384 px', '512 px', '0 min', 'd/dx', '#4D6BFF, rgb(77,107,255) or hsl(231,100%,67%)', 'sin(30) + sqrt(16)',
  'grade₁ × weight₁ + grade₂ × weight₂ + …', '(target grade − current grade × (1 − final weight)) ÷ final weight',
  'English', 'Español', 'Français', 'Português', 'Deutsch', '日本語', '한국어', 'Indonesian', 'हिन्दी', 'العربية', '中文', 'বাংলা', 'Русский', 'اردو', 'Türkçe', 'Tiếng Việt',
  ...guides.flatMap((guide) => guide.sources?.map(({ label }) => label) ?? []),
  ...Object.values(locales).flatMap(({ name, code }) => [name, code.toUpperCase(), `${code.toUpperCase()} — ${name}`]),
  ...Object.values(pdfOnlyLocales).flatMap(({ name, code }) => [name, code.toUpperCase(), `${code.toUpperCase()} — ${name}`]),
  'Standard', 'Standard — 150 dpi', 'Text', 'A4', 'US Letter', 'DRAFT', 'OCR', 'DOC', 'MD', 'JPG', 'PNG']);
const isUniversal = (value) => universalStrings.has(value) || [...value.replace(/\s/gu, '')].length <= 3 || !/\p{Ll}{2}/u.test(value) || /^[^\p{L}]*(?:https?:|\\b|\{"|name,age)/u.test(value);
const translationIssues = [];
for (const [language, pack] of Object.entries(packs)) {
  const keepEnglish = new Set(pack.meta.keepEnglish ?? []);
  const leftovers = new Map();
  for (const { path } of pages.filter((page) => page.language === language)) {
    for (const value of visibleStrings(await readFile(path, 'utf8'))) if (englishStrings.has(value) && !isUniversal(value) && !keepEnglish.has(value)) leftovers.set(value, path.slice(dist.length));
  }
  if (leftovers.size) translationIssues.push(`Untranslated English strings in ${language} (${leftovers.size}):\n${[...leftovers].map(([value, path]) => `  ${JSON.stringify(value)} (${path})`).join('\n')}`);
}
for (const language of pdfOnlyLocaleKeys) {
  const keepEnglish = new Set(pdfOnlyPacks[language].meta.keepEnglish ?? []);
  const leftovers = new Map();
  for (const { path, language: pageLanguage } of pages.filter((page) => page.language === language)) {
    for (const value of visibleStrings(await readFile(path, 'utf8'))) {
      if (englishStrings.has(value) && !isUniversal(value) && !keepEnglish.has(value)) leftovers.set(value, path.slice(dist.length));
    }
  }
  if (leftovers.size) translationIssues.push(`Untranslated English strings in PDF-only ${language} (${leftovers.size}):\n${[...leftovers].map(([value, path]) => `  ${JSON.stringify(value)} (${path})`).join('\n')}`);
}
if (translationIssues.length) throw new Error(translationIssues.join('\n\n'));
console.log(`Build check passed: ${pages.filter(({ tool }) => tool).length} localized tool pages + ${languages.length} home pages; ${sitemapCount} URLs in sitemap.`);
