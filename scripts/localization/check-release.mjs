import { expandedFullLocaleKeys, packs } from '../../src/locales.mjs';
import { guidesForLocale } from '../../src/guides.mjs';
import { expandedLocaleTranslationReview } from '../../src/locales/expanded-locale-review.mjs';
import { localeApprovalGaps } from '../../src/locales/release-gate.mjs';

const gaps = localeApprovalGaps(expandedLocaleTranslationReview, expandedFullLocaleKeys);
if (gaps.length) {
  console.error('Release blocked: expanded locales still need complete linguistic review.');
  for (const gap of gaps) console.error(`- ${gap}`);
  console.error('Do not deploy candidate translations as finished localized pages.');
  process.exitCode = 1;
} else {
  console.log(`Release locale review passed for ${expandedFullLocaleKeys.length} expanded locales.`);
}

for (const language of expandedFullLocaleKeys) {
  if (!packs[language] || guidesForLocale(language).length !== 4) {
    console.error(`Release blocked: ${language} is missing one or more localized guide routes.`);
    process.exitCode = 1;
  }
}
