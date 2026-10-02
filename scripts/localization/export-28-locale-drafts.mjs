import { mkdir, writeFile } from 'node:fs/promises';
import { tools } from '../../src/catalog.mjs';
import { guides } from '../../src/guides.mjs';
import { locales, pdfOnlyLocaleDataAll, runtimeMessages, ui } from '../../src/locales.mjs';
import { pdfOnlyUiLocales } from '../../src/locales/pdf-only-ui.mjs';
import { pageKeys, templateKeys } from '../../src/locales/template-keys.mjs';
import { seo } from '../../src/seo.mjs';

const outputDirectory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
await mkdir(outputDirectory, { recursive: true });

const pdfOnlyToolIds = new Set(['pdf-tools', 'pdf-protect-unlock', 'pdf-repair', 'pdf-crop', 'pdf-redact', 'pdf-to-pdfa', 'image-to-pdf', 'pdf-to-image', 'pdf-page-editor', 'pdf-ocr', 'pdf-document-converter', 'html-to-pdf', 'pdf-to-markdown', 'pdf-form-filler', 'pdf-compare']);
const pdfUiOnlyEnglishKeys = [
  'Important limits and output', 'all or 1-3,5', 'Rotate 90°', 'pages ready to edit',
  'Area selected. Choose the replacement and apply it.', 'added', 'removed', 'text changed',
  'Original', 'Updated', '(no extractable text)', 'No text differences were found on matching pages.',
  'Page counts', 'supported form fields found.', 'PDF', 'Files tool',
];
const guideUiKeys = [
  'Practical Guides for Everyday Tools | UsefulVerse',
  'Guides',
  'Clear, sourced walkthroughs for grades, Google Docs, Excel and number conversions, with free tools to finish the task.',
  'UsefulVerse Guides', 'UsefulVerse guides', 'UsefulVerse guide', 'Read the guide', 'All guides',
  'Know the steps.', 'Then get it done.',
  'Short, practical walkthroughs that explain the details a tool cannot guess for you. Each guide links to a free browser tool when it helps.',
  'Sources and further reading', 'Try the free tool', 'Open the tool',
  'Runs in your browser. Your input is not uploaded.', 'Browse all UsefulVerse guides',
];

function unitFactory(language) {
  const units = {};
  return {
    units,
    translate(id, text) {
      if (typeof text !== 'string' || !text.trim()) throw new Error(`Empty translation source for ${language}/${id}`);
      units[id] = text;
      return { $translate: id };
    },
  };
}

function translateGuide(guide, index, translate) {
  const prefix = `guide.${index}`;
  return {
    ...guide,
    title: translate(`${prefix}.title`, guide.title),
    description: translate(`${prefix}.description`, guide.description),
    toolCta: translate(`${prefix}.toolCta`, guide.toolCta),
    intro: translate(`${prefix}.intro`, guide.intro),
    sections: guide.sections.map((section, sectionIndex) => ({
      ...section,
      heading: translate(`${prefix}.section.${sectionIndex}.heading`, section.heading),
      blocks: section.blocks.map((block, blockIndex) => {
        const blockPrefix = `${prefix}.section.${sectionIndex}.block.${blockIndex}`;
        const translated = { ...block };
        for (const key of ['caption', 'title', 'text', 'label']) {
          if (typeof block[key] === 'string') translated[key] = translate(`${blockPrefix}.${key}`, block[key]);
        }
        if (Array.isArray(block.items)) translated.items = block.items.map((item, itemIndex) => translate(`${blockPrefix}.item.${itemIndex}`, item));
        if (Array.isArray(block.headers)) translated.headers = block.headers.map((header, headerIndex) => translate(`${blockPrefix}.header.${headerIndex}`, header));
        if (Array.isArray(block.rows)) translated.rows = block.rows.map((row, rowIndex) => row.map((cell, cellIndex) => translate(`${blockPrefix}.row.${rowIndex}.${cellIndex}`, cell)));
        // Formula values are executable/meaning-bearing notation, so keep them byte-for-byte.
        return translated;
      }),
    })),
  };
}

const targets = {};
for (const language of Object.keys(pdfOnlyLocaleDataAll)) {
  const original = pdfOnlyLocaleDataAll[language];
  const existingPack = { copy: original.copy, seo: original.seo ?? {}, faq: original.faq ?? {} };
  const { units, translate } = unitFactory(language);
  const localeCode = original.meta.code;
  // The in-tree expanded packs may contain machine-generated Argos text. Never
  // treat it as approved input; retain only the original PDF-only translations
  // and regenerate all remaining UI strings from the English source keys.
  const existingUi = { ...(original.ui ?? {}), ...(pdfOnlyUiLocales[language] ?? {}) };
  const existingRuntime = { ...(original.runtimeMessages ?? {}), ...(pdfOnlyUiLocales[language] ?? {}) };

  const uiKeys = new Set([
    ...Object.keys(ui.es),
    ...Object.keys(runtimeMessages.es),
    ...pdfUiOnlyEnglishKeys,
    ...guideUiKeys,
  ]);
  for (const key of Object.keys(existingUi)) {
    if (!/^About .+\.$/u.test(key) && !/.+ made simple\.$/u.test(key) && !/.+ workspace$/u.test(key)) uiKeys.add(key);
  }

  const translatedUi = {};
  for (const key of uiKeys) {
    const existing = existingUi[key];
    translatedUi[key] = existing && existing !== key ? existing : translate(`ui.${Object.keys(translatedUi).length}`, key);
  }

  const runtimeKeys = new Set([...uiKeys, ...Object.keys(runtimeMessages.es), ...Object.keys(existingRuntime)]);
  const translatedRuntime = {};
  for (const key of runtimeKeys) {
    const existing = existingRuntime[key];
    translatedRuntime[key] = existing && existing !== key
      ? existing
      : translatedUi[key] ?? translate(`runtime.${Object.keys(translatedRuntime).length}`, key);
  }

  const translatedMeta = {
    ...original.meta,
    homeTitle: translate('meta.homeTitle', locales.en.homeTitle),
    homeDescription: translate('meta.homeDescription', locales.en.homeDescription),
    homeLabel: translate('meta.homeLabel', 'All tools'),
    homeMarker: translate('meta.homeMarker', 'All tools'),
    direction: 'ltr',
    keepEnglish: [...new Set([...(original.meta.keepEnglish ?? []), 'UsefulVerse', 'Code 128', 'PDF/A-1b', 'veraPDF', 'sRGB', 'MB', 'dpi'])],
  };

  const translatedPage = Object.fromEntries(Object.entries(pageKeys).map(([key, definition]) => [key, translate(`page.${key}`, definition.en)]));
  const translatedTemplates = {};
  for (const [key, definition] of Object.entries(templateKeys)) {
    if (definition.plural) {
      const pluralRules = new Intl.PluralRules(localeCode);
      const categories = pluralRules.resolvedOptions().pluralCategories;
      translatedTemplates[key] = Object.fromEntries(categories.map((category) => {
        const count = [...Array.from({ length: 201 }, (_, value) => value), 1_000, 10_000, 1_000_000, 1_000_000_000].find((value) => pluralRules.select(value) === category)
          ?? (category === 'other' ? 2 : undefined);
        if (count === undefined) throw new Error(`No plural sample for ${language}/${key}/${category}`);
        const englishForm = definition.en[category] ?? definition.en.other ?? definition.en.one;
        const phrase = englishForm.replaceAll('{count}', String(count));
        return [category, { ...translate(`template.${key}.${category}`, phrase), $count: count }];
      }));
    } else {
      translatedTemplates[key] = translate(`template.${key}`, definition.en);
    }
  }

  const translatedCopy = { ...existingPack.copy };
  const translatedSeo = { ...existingPack.seo };
  const translatedFaq = { ...existingPack.faq };
  for (const tool of tools) {
    if (!pdfOnlyToolIds.has(tool.id)) {
      const copyValues = [tool.title, tool.shortTitle, tool.description, tool.keywords, tool.intro, tool.body];
      translatedCopy[tool.id] = copyValues.map((value, field) => translate(`tool.${tool.id}.${field}`, value));
    }
    const toolSeo = seo[tool.id] ?? { title: tool.shortTitle, description: tool.description, faq: [] };
    translatedSeo[tool.id] = {
      title: translate(`seo.${tool.id}.title`, toolSeo.title),
      description: translate(`seo.${tool.id}.description`, toolSeo.description),
    };
    const sourceFaq = toolSeo.faq?.length ? toolSeo.faq : [
      { question: `How do I use ${tool.shortTitle}?`, answer: tool.intro },
      { question: 'Is my data sent to a server?', answer: 'No. Processing happens in your browser and your data is not uploaded.' },
    ];
    translatedFaq[tool.id] = sourceFaq.map((item, faqIndex) => ({
      question: translate(`faq.${tool.id}.${faqIndex}.question`, item.question),
      answer: translate(`faq.${tool.id}.${faqIndex}.answer`, item.answer),
    }));
  }

  const translatedGuides = guides.map((guide, index) => translateGuide(guide, index, translate));
  targets[language] = {
    meta: translatedMeta,
    page: translatedPage,
    templates: translatedTemplates,
    ui: translatedUi,
    runtimeMessages: translatedRuntime,
    copy: translatedCopy,
    seo: translatedSeo,
    faq: translatedFaq,
    guides: translatedGuides,
  };
  console.log(`${language} (${localeCode}): ${Object.keys(units).length} source strings, ${Object.keys(existingPack.copy).length} existing tool translations retained.`);
  targets[language] = { units, pack: targets[language] };
}

const output = `${outputDirectory}/draft-input.json`;
await writeFile(output, `${JSON.stringify({ version: 1, targets }, null, 2)}\n`);
console.log(`Wrote offline translation input to ${output}`);
