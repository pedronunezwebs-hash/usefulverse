import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { applyAutomaticPackage } from './automatic-packages.mjs';

const digest = value => /^[a-f0-9]{64}$/u.test(value ?? '');
const destination = locale => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil' })[locale.key] ?? locale.key;
const leafPath = (key, id) => key.slice(id.length + 6).split('.');
function get(object, path) { return path.reduce((value, key) => value[key], object); }
function set(object, path, value) {
  const parent = get(object, path.slice(0, -1));
  parent[path.at(-1)] = value;
}

export async function prepareAutomaticPreview({ directory, semanticPolicy, qualityPolicy, previewOnly,
  tools, candidateIds, locales, rawEnglish, copyByLocale }) {
  if (!previewOnly || tools.some(tool => !candidateIds.has(tool.id) || tool.indexable !== false))
    throw Error('Automatic translations are restricted to the isolated candidate noindex preview');
  if (!digest(semanticPolicy) || !digest(qualityPolicy)) throw Error('Current preview policies are required');
  const root = resolve(directory);
  const report = JSON.parse(await readFile(resolve(root, 'report.json'), 'utf8'));
  if (report.schemaVersion !== 1 || report.approved !== false || report.native_review !== false
      || report.semantic_policy !== semanticPolicy || report.quality_policy !== qualityPolicy || !digest(report.source_digest))
    throw Error('Invalid automatic preview report provenance');
  const copies = { ...copyByLocale };
  const summary = { candidateTools: tools.length, translatedEntries: 0, staleEntries: 0, overBudgetEntries: 0,
    translatedRoutes: 0, fallbackRoutes: 0, releaseApproved: false, byLocale: {} };
  for (const locale of locales) {
    if (locale.key === 'en') continue;
    const language = destination(locale);
    if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/u.test(language)) throw Error('Unsafe destination locale');
    copies[locale.key] = { ...copyByLocale[locale.key] };
    const counts = { translatedEntries: 0, translatedRoutes: 0, fallbackRoutes: 0 };
    for (const tool of tools) {
      const source = rawEnglish[tool.id];
      const base = copyByLocale.en?.[tool.id];
      if (!source || !base || base.copyLanguage !== 'en') throw Error(`Missing English fallback: ${tool.id}`);
      const copy = structuredClone(base);
      let applied = 0;
      const path = resolve(root, 'packages', language, `${tool.id}.json`);
      if (!path.startsWith(root + sep)) throw Error('Unsafe package path');
      let pack;
      try { pack = JSON.parse(await readFile(path, 'utf8')); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (pack) {
        if (pack.source_digest !== report.source_digest || pack.quality_policy !== qualityPolicy)
          throw Error('Package does not belong to this preview export');
        const result = applyAutomaticPackage(source, tool.id, language, pack, semanticPolicy, qualityPolicy);
        summary.staleEntries += result.stale.length;
        for (const key of result.appliedKeys) {
          const path = leafPath(key, tool.id);
          const value = get(result.copy, path);
          const max = { title: 60, description: 160 }[path.join('.')];
          if ((max && value.length > max) || (path.join('.') === 'title' && !value.includes('UsefulVerse'))) {
            summary.overBudgetEntries++; continue;
          }
          set(copy, path, value); applied++;
        }
      }
      copy.copyLanguage = locale.key;
      copy.localizationStatus = 'machine-draft';
      for (const key of ['localizationAcceptedBy', 'localizationAcceptedAt', 'reviewers', 'acceptedBy', 'acceptedAt']) delete copy[key];
      copies[locale.key][tool.id] = copy;
      counts.translatedEntries += applied;
      counts[applied ? 'translatedRoutes' : 'fallbackRoutes']++;
    }
    summary.byLocale[locale.key] = counts;
    for (const key of Object.keys(counts)) summary[key] += counts[key];
  }
  return { copyByLocale: copies, summary };
}

// Check the generated payload consumed by every candidate controller, not just the adapter.
export async function verifyAutomaticPreview({ outputDir, tools, locales, localePath, copyByLocale }) {
  let checkedRoutes = 0;
  for (const locale of locales) for (const tool of tools) {
    const route = localePath(locale.key, tool.id).replace(/^\/+|\/+$/gu, '');
    const html = await readFile(resolve(outputDir, route, 'index.html'), 'utf8');
    const payload = /<script type="application\/json" data-tool-copy>([\s\S]*?)<\/script>/u.exec(html);
    if (!/<meta name="robots" content="noindex,follow">/u.test(html) || !payload
        || !isDeepStrictEqual(JSON.parse(payload[1]), copyByLocale[locale.key][tool.id]))
      throw Error(`Automatic preview render differs from checked copy: ${locale.key}/${tool.id}`);
    checkedRoutes++;
  }
  return checkedRoutes;
}
