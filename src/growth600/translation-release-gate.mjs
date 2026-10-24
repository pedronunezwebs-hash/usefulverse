const validDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export function getTranslationPackReleaseIssues(requiredToolIds, packs, localeKeys) {
  const issues = [];
  for (const toolId of requiredToolIds) {
    const pack = packs.get(toolId);
    if (!pack || typeof pack !== 'object') {
      issues.push(`${toolId}: missing translation pack`);
      continue;
    }
    for (const localeKey of localeKeys) {
      const copy = pack[localeKey];
      if (!copy || typeof copy !== 'object') {
        issues.push(`${toolId}/${localeKey}: missing locale copy`);
        continue;
      }
      if (localeKey === 'en') {
        if (copy.localizationStatus !== 'source-english') {
          issues.push(`${toolId}/en: canonical source must be marked source-english`);
        }
        continue;
      }
      if (copy.localizationStatus !== 'human-reviewed'
        || !Array.isArray(copy.localizationReviewers)
        || copy.localizationReviewers.length === 0
        || copy.localizationReviewers.some((reviewer) => typeof reviewer !== 'string' || !reviewer.trim())
        || !validDate(copy.localizationLastReviewedAt)) {
        issues.push(`${toolId}/${localeKey}: requires human review, reviewer names, and a valid review date`);
      }
    }
  }
  return issues;
}
