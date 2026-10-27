import { createHash } from 'node:crypto';
import { extractToolCopyUnits } from './extract-tool-copy-units.mjs';

// Build adapter only: no network call, no production activation, no human sign-off.
export function applyAutomaticPackage(sourceCopy, toolId, locale, pack, expectedPolicy, expectedQualityPolicy) {
  if (pack?.schemaVersion !== 1 || pack.toolId !== toolId || pack.locale !== locale
      || !expectedPolicy || pack.semantic_policy !== expectedPolicy
      || (pack.quality_policy && pack.quality_policy !== expectedQualityPolicy)
      || pack.release_approved !== false || pack.native_review !== false) throw Error('Invalid automatic package provenance');
  const copy = structuredClone(sourceCopy);
  let applied = 0;
  const appliedKeys = [];
  const stale = [];
  for (const unit of extractToolCopyUnits(sourceCopy, toolId).units) {
    const entry = pack.entries[unit.key];
    if (!entry) continue;
    const hash = createHash('sha256').update(unit.source).digest('hex');
    if (entry.source_hash !== hash || entry.context !== unit.context || typeof entry.translation !== 'string' || !entry.translation.trim()) {
      stale.push(unit.key); continue;
    }
    const path = unit.key.slice(toolId.length + 6).split('.'); // <tool>.copy.<path>
    let parent = copy;
    for (const part of path.slice(0, -1)) parent = parent[part];
    parent[path.at(-1)] = entry.translation;
    applied++;
    appliedKeys.push(unit.key);
  }
  return { copy, applied, appliedKeys, stale, releaseApproved: false };
}
