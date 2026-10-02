import { mkdir, writeFile } from 'node:fs/promises';
import { guides } from '../../src/guides.mjs';
import { expandedFullLocaleKeys, packs, ui } from '../../src/locales.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const legacyLanguages = ['ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi'];
const sourceUi = [
  'Practical Guides for Everyday Tools | UsefulVerse', 'Guides',
  'Clear, sourced walkthroughs for grades, Google Docs, Excel and number conversions, with free tools to finish the task.',
  'UsefulVerse Guides', 'UsefulVerse guides', 'UsefulVerse guide', 'Read the guide', 'All guides',
  'Know the steps.', 'Then get it done.',
  'Short, practical walkthroughs that explain the details a tool cannot guess for you. Each guide links to a free browser tool when it helps.',
  'Sources and further reading', 'Try the free tool', 'Open the tool',
  'Runs in your browser. Your input is not uploaded.', 'Browse all UsefulVerse guides',
];
const tokenPattern = /\{[A-Za-z][A-Za-z0-9_]*\}|https?:\/\/[^\s<>]+|`[^`]*`|<\/?[A-Za-z][^>]*>|PDF\/A(?:-1b)?|PDF|PNG|JPEG|JPG|WebP|SVG|GIF|TIFF|TIF|HEIC|AVIF|DOCX|DOC|XLSX|XLS|PPTX|PPT|ODT|ODS|ODP|RTF|CSV|JSON|YAML|HTML|CSS|SQL|Markdown|MP3|MP4|M4A|WAV|OGG|Opus|WebM|UUID|SHA-256|Base64|QR|SEO|URL|WPM|GPA|Open Graph|Google Docs|Microsoft Word|PowerPoint|Excel|UsefulVerse|Code 128|veraPDF|sRGB|US Letter|A4|MB|MiB|dpi|(?<!\w)\d+(?:[.,]\d+)*(?:%|°)?/giu;

function translateGuide(guide, add) {
  const result = {
    ...guide,
    title: add(guide.title),
    description: add(guide.description),
    toolCta: add(guide.toolCta),
    intro: add(guide.intro),
    sections: guide.sections.map((section) => ({
      ...section,
      heading: add(section.heading),
      blocks: section.blocks.map((block) => {
        const next = { ...block };
        for (const key of ['caption', 'title', 'text', 'label']) if (typeof block[key] === 'string') next[key] = add(block[key]);
        if (Array.isArray(block.items)) next.items = block.items.map(add);
        if (Array.isArray(block.headers)) next.headers = block.headers.map(add);
        if (Array.isArray(block.rows)) next.rows = block.rows.map((row) => row.map(add));
        return next;
      }),
    })),
    sources: guide.sources?.map((source) => ({ ...source, label: add(source.label) })),
  };
  return result;
}

const targets = {};
const rows = [];
for (const language of [...legacyLanguages, ...expandedFullLocaleKeys]) {
  const sourceUnits = new Map();
  const add = (text) => {
    if (typeof text !== 'string' || !text.trim()) throw new Error(`Empty guide/UI source string in ${language}`);
    if (!sourceUnits.has(text)) sourceUnits.set(text, []);
    return { $translate: text };
  };
  const localizedGuides = [];
  const sourceLabels = [];
  if (legacyLanguages.includes(language)) {
    for (const value of sourceUi) add(value);
    localizedGuides.push(...guides.map((guide) => translateGuide(guide, add)));
  } else {
    sourceLabels.push(...guides.map((guide) => guide.sources?.map((source) => add(source.label)) ?? []));
  }
  let rowIndex = 0;
  for (const [source, refs] of sourceUnits) {
    const parts = [];
    const protectedSpans = [];
    let cursor = 0;
    for (const match of source.matchAll(tokenPattern)) {
      if (match.index > cursor) parts.push({ type: 'text', value: source.slice(cursor, match.index) });
      const marker = `<ph${protectedSpans.length}>`;
      protectedSpans.push([marker, match[0]]);
      parts.push({ type: 'protected', marker, value: match[0] });
      cursor = match.index + match[0].length;
    }
    if (cursor < source.length) parts.push({ type: 'text', value: source.slice(cursor) });
    if (!parts.length) parts.push({ type: 'text', value: source });
    const masked = parts.map((part) => part.type === 'protected' ? part.marker : part.value).join('');
    const id = `${language}-${rowIndex++}`;
    rows.push({ language, id, source, unitIds: [id], protected: protectedSpans, parts, prompt: `<2${language}> ${masked}` });
  }
  targets[language] = legacyLanguages.includes(language)
    ? { ui: Object.fromEntries(sourceUi.map((text) => [text, { $translate: text }])), guides: localizedGuides }
    : { sourceLabels };
  console.log(`${language}: ${sourceUnits.size} unique guide/UI strings; existing pack has ${Object.keys(packs[language]?.ui ?? ui[language] ?? {}).length} UI strings.`);
}

await mkdir(directory, { recursive: true });
await writeFile(`${directory}/guide-draft-input.json`, `${JSON.stringify({ targets }, null, 2)}\n`);
await writeFile(`${directory}/guide-madlad-input.jsonl`, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
console.log(`Wrote ${rows.length} source rows for ${legacyLanguages.length} existing guide locales and ${expandedFullLocaleKeys.length} source-label supplements to ${directory}.`);
