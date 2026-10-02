import { readFile, writeFile } from 'node:fs/promises';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const input = JSON.parse(await readFile(`${directory}/draft-input.json`, 'utf8'));
const protectedPattern = /\{[A-Za-z][A-Za-z0-9_]*\}|https?:\/\/[^\s<>]+|`[^`]*`|<\/?[A-Za-z][^>]*>|PDF\/A(?:-1b)?|PDF|PNG|JPEG|JPG|WebP|SVG|GIF|TIFF|TIF|HEIC|AVIF|DOCX|DOC|XLSX|XLS|PPTX|PPT|ODT|ODS|ODP|RTF|CSV|JSON|YAML|HTML|CSS|SQL|Markdown|MP3|MP4|M4A|WAV|OGG|Opus|WebM|UUID|SHA-256|Base64|QR|SEO|URL|WPM|GPA|Open Graph|Google Docs|Microsoft Word|PowerPoint|Excel|UsefulVerse|Code 128|veraPDF|sRGB|US Letter|A4|MB|MiB|dpi|(?<!\w)\d+(?:[.,]\d+)*(?:%|°)?/giu;

const rows = [];
for (const [language, target] of Object.entries(input.targets)) {
  const bySource = new Map();
  for (const [unitId, source] of Object.entries(target.units)) {
    const grouped = bySource.get(source) ?? [];
    grouped.push(unitId);
    bySource.set(source, grouped);
  }
  let index = 0;
  for (const [source, unitIds] of bySource) {
    const protectedSpans = [];
    const parts = [];
    let cursor = 0;
    for (const match of source.matchAll(protectedPattern)) {
      if (match.index > cursor) parts.push({ type: 'text', value: source.slice(cursor, match.index) });
      const marker = `<ph${protectedSpans.length}>`;
      protectedSpans.push([marker, match[0]]);
      parts.push({ type: 'protected', marker, value: match[0] });
      cursor = match.index + match[0].length;
    }
    if (cursor < source.length) parts.push({ type: 'text', value: source.slice(cursor) });
    if (!parts.length) parts.push({ type: 'text', value: source });
    const masked = parts.map((part) => part.type === 'protected' ? part.marker : part.value).join('');
    rows.push({
      language,
      id: `${language}-${index++}`,
      unitIds,
      source,
      protected: protectedSpans,
      parts,
      prompt: `<2${language === 'zh_tw' ? 'zh' : language}> ${masked}`,
    });
  }
  console.log(`${language}: ${bySource.size} unique source strings`);
}

await writeFile(`${directory}/madlad-input.jsonl`, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
console.log(`Wrote ${rows.length} offline prompts to ${directory}/madlad-input.jsonl`);
