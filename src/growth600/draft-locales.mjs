export const norwegianDraftLocale = Object.freeze({ key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false });

// A route in the draft preview is not a claim that its copy is translated.
// Keep source English and its language declaration until checked nb exists.
export function addNorwegianDraftFallback({ previewOnly, tools, copyByLocale, extraToolLocales }) {
  if (!previewOnly || tools.some(t => t.indexable !== false) || extraToolLocales.some(l => l.key === 'nb') || copyByLocale.nb) throw Error('Norwegian source fallback is restricted to a new isolated noindex preview');
  const pack = { _home: structuredClone(copyByLocale.en?._home) };
  if (!pack._home) throw Error('English page chrome is required');
  for (const tool of tools) {
    const source = copyByLocale.en[tool.id];
    if (source?.copyLanguage !== 'en') throw Error(`English source missing: ${tool.id}`);
    const copy = structuredClone(source);
    Object.assign(copy, { localizationStatus: 'source-fallback', previewFallbackFor: 'nb', releaseApproved: false });
    for (const name of ['localizationAcceptedBy', 'localizationAcceptedAt', 'localizationReviewers', 'localizationLastReviewedAt']) delete copy[name];
    pack[tool.id] = copy;
  }
  copyByLocale.nb = pack; extraToolLocales.push(norwegianDraftLocale);
  return { locale: 'nb', routes: tools.length, sourceLanguage: 'en', translated: false, releaseApproved: false };
}

export function isDraftSourceFallback(copy, locale, { noindex, unapprovedAllowed }) {
  return noindex && unapprovedAllowed && copy?.copyLanguage === 'en' && copy.previewFallbackFor === locale.key
    && copy.localizationStatus === 'source-fallback' && copy.releaseApproved === false;
}
