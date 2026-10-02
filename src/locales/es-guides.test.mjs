import assert from 'node:assert/strict';
import test from 'node:test';
import { guides, guidesForLocale, guideCanonical, guidePath } from '../guides.mjs';
import { locales, localizedTool, ui } from '../locales.mjs';
import { renderGuidePage, renderGuidesIndex, renderToolPage } from '../template.mjs';
import { tools } from '../catalog.mjs';

const protectedFields = new Set(['slug', 'toolId', 'type', 'value', 'url']);

function compareLocalizedShape(source, translated, field = '') {
  assert.equal(typeof translated, typeof source, `${field || 'guide'} type`);
  if (Array.isArray(source)) {
    assert.equal(translated.length, source.length, `${field} item count`);
    source.forEach((item, index) => compareLocalizedShape(item, translated[index], `${field}[${index}]`));
    return;
  }
  if (source && typeof source === 'object') {
    assert.deepEqual(Object.keys(translated), Object.keys(source), `${field} shape`);
    for (const key of Object.keys(source)) compareLocalizedShape(source[key], translated[key], key);
    return;
  }
  if (typeof source !== 'string') {
    assert.equal(translated, source, `${field} value`);
    return;
  }
  if (protectedFields.has(field) || /^[0-9A-F]+$/u.test(source)) {
    assert.equal(translated, source, `${field} must remain unchanged`);
  } else {
    assert.ok(translated.trim(), `${field} must not be empty`);
    assert.notEqual(translated, source, `${field} still matches the English source`);
  }
}

test('Spanish guide pack translates all prose while preserving routes, formulas, tables and source URLs', () => {
  const translated = guidesForLocale('es');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'Une los grupos en el mismo orden: 24D₁₆ = 0010 0100 1101₂.');
});

test('Spanish guide chrome and metadata are localized and fit search-result limits', () => {
  const index = renderGuidesIndex(guidesForLocale('es'), 'test-version', 'es');
  assert.ok(index.includes('<html lang="es" dir="ltr"'));
  assert.ok(index.includes(`<link rel="canonical" href="${guideCanonical('', 'es')}">`));
  assert.ok(index.includes(`hreflang="es" href="https://usefulverse.com${guidePath('', 'es')}"`));
  assert.ok(index.includes('<h1>Conoce los pasos.<br><span>Y ponte manos a la obra.</span></h1>'));
  const title = index.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = index.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
  assert.ok(title.length >= 15 && title.length <= 65, `title length ${title.length}`);
  assert.ok(description.length >= 25 && description.length <= 155, `description length ${description.length}`);
  assert.equal(ui.es['Sources and further reading'], 'Fuentes y lecturas recomendadas');
  for (const guide of guidesForLocale('es')) {
    const article = renderGuidePage(guide, 'test-version', 'es');
    const articleTitle = article.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const articleDescription = article.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(articleTitle.length >= 15 && articleTitle.length <= 65, `${guide.slug} title length ${articleTitle.length}`);
    assert.ok(articleDescription.length >= 25 && articleDescription.length <= 155, `${guide.slug} description length ${articleDescription.length}`);
    assert.ok(article.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'es')}">`));
  }
});

test('Spanish guide article renders its translated copy, localized tool link and original source URL', () => {
  const guide = guidesForLocale('es')[1];
  const html = renderGuidePage(guide, 'test-version', 'es');
  assert.ok(html.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'es')}">`));
  assert.ok(html.includes('<h1>Cómo ver el recuento de palabras en Google Docs</h1>'));
  assert.ok(html.includes('Herramientas → Recuento de palabras'));
  assert.ok(html.includes(`href="${guidePath(guide.slug, 'en')}"`));
  assert.ok(html.includes('https://support.google.com/docs/answer/39003?hl=en'));
  assert.ok(html.includes('El texto no se sube y el documento de Google no se modifica.'));
});

test('Spanish tool pages link to their translated guides instead of omitting them', () => {
  const tool = tools.find(({ id }) => id === 'average-calculator');
  const html = renderToolPage(localizedTool(tool, 'es'), 'test-version', 'es', tools.map((item) => localizedTool(item, 'es')));
  assert.ok(html.includes(`href="${guidePath('how-to-calculate-a-weighted-grade', 'es')}"`));
  assert.ok(html.includes('Cómo calcular una nota ponderada (con ejemplos)'));
});

test('Guide packs preserve the supported locale registry and stable article routes', () => {
  assert.equal(locales.es.code, 'es');
  assert.equal(guidesForLocale('bn').length, guides.length);
  assert.equal(guidesForLocale('ru').length, guides.length);
  assert.equal(guidePath(guides[0].slug, 'ru'), `/ru/guides/${guides[0].slug}/`);
});
