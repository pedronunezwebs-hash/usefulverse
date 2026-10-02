export function localizedGuideGaps(locales, packs, guides) {
  const expectedSlugs = guides.map(({ slug }) => slug);
  const gaps = [];

  for (const language of Object.keys(locales)) {
    if (language === 'en') continue;
    const translated = packs[language]?.guides;
    if (!Array.isArray(translated)) {
      gaps.push(`${language}: no translated guide pack`);
      continue;
    }

    const actualSlugs = translated.map(({ slug }) => slug);
    if (actualSlugs.length !== expectedSlugs.length) {
      gaps.push(`${language}: ${actualSlugs.length}/${expectedSlugs.length} guides`);
      continue;
    }
    if (actualSlugs.some((slug, index) => slug !== expectedSlugs[index])) {
      gaps.push(`${language}: guide routes do not match the canonical set`);
    }
  }

  return gaps;
}

export function localeApprovalGaps(reviewStatus, requiredLocales) {
  return requiredLocales.flatMap((language) => {
    const review = reviewStatus?.[language];
    if (review?.status === 'approved' && review.reviewer && review.reviewedAt) return [];
    if (review?.status === 'machine-accepted' && review.acceptedBy && review.acceptedAt) return [];
    return [`${language}: translation has neither linguistic approval nor explicit owner acceptance`];
  });
}
