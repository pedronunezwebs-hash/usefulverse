export const REQUIRED_GROWTH_COPY = Object.freeze(['name', 'title', 'description', 'intro', 'howQuestion', 'howAnswer', 'privacyQuestion', 'privacyAnswer']);

export function assertGrowthLocaleCoverage(tools, localeEntries, copyByLocale, { titleMax = 60, descriptionMax = 160 } = {}) {
  const errors = [];
  for (const locale of localeEntries) {
    const languageCopy = copyByLocale?.[locale.key];
    if (!languageCopy) { errors.push(`${locale.key}: locale copy is missing`); continue; }
    for (const tool of tools) {
      const copy = languageCopy[tool.id];
      if (!copy) { errors.push(`${locale.key}/${tool.id}: translation is missing`); continue; }
      for (const key of REQUIRED_GROWTH_COPY) {
        if (typeof copy[key] !== 'string' || !copy[key].trim()) errors.push(`${locale.key}/${tool.id}: ${key} is missing`);
      }
      if (typeof copy.title === 'string' && copy.title.length > titleMax) errors.push(`${locale.key}/${tool.id}: title is ${copy.title.length} characters (max ${titleMax})`);
      if (typeof copy.description === 'string' && copy.description.length > descriptionMax) errors.push(`${locale.key}/${tool.id}: description is ${copy.description.length} characters (max ${descriptionMax})`);
      if (copy.title?.includes('UsefulVerse') === false) errors.push(`${locale.key}/${tool.id}: title must include the brand suffix`);
      if (copy.copyLanguage && copy.copyLanguage !== locale.key) errors.push(`${locale.key}/${tool.id}: copy language does not match its route`);
    }
  }
  if (errors.length) throw new Error(`Growth locale release gate failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  return true;
}
