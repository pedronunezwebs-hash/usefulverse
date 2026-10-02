import { tools } from '../../src/catalog.mjs';
import { guides, guidesForLocale } from '../../src/guides.mjs';
import { localizedTool, locales, packs, runtimeMessages, ui } from '../../src/locales.mjs';
import { renderToolPage } from '../../src/template.mjs';

const copyFields = ['title', 'shortTitle', 'description', 'keywords', 'intro', 'body'];
const allUiKeys = new Set([
  ...Object.values(ui).flatMap((dictionary) => Object.keys(dictionary ?? {})),
  ...Object.values(runtimeMessages).flatMap((dictionary) => Object.keys(dictionary ?? {})),
  ...Object.values(packs).flatMap((pack) => [
    ...Object.keys(pack.ui ?? {}),
    ...Object.keys(pack.runtimeMessages ?? {}),
  ]),
]);
const decode = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#039;', "'");
const metadata = (html) => ({
  title: decode(html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? ''),
  description: decode(html.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? ''),
});
const faqItems = (html) => [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/gu)]
  .map(([, question, answer]) => [decode(question), decode(answer)]);
const englishFaq = new Map(tools.map((tool) => [
  tool.id,
  faqItems(renderToolPage(tool, 'coverage', 'en', tools)),
]));

console.log('UsefulVerse locale source coverage (inventory only; not linguistic approval or release readiness).');
console.log('Locale | Review status | UI keys missing | UI exact-key values | Tool copy fields distinct | SEO metadata in bounds | FAQ pages with 2+ items | Guide routes present');
console.log('--- | --- | ---: | ---: | ---: | ---: | ---: | ---:');

for (const [language, locale] of Object.entries(locales)) {
  if (language === 'en') continue;
  const pack = packs[language];
  const allowedEnglish = new Set(pack?.meta.keepEnglish ?? []);
  const uiDictionary = ui[language] ?? {};
  const runtimeDictionary = runtimeMessages[language] ?? {};
  const missingUi = [...allUiKeys].filter((key) => !(key in uiDictionary) && !(key in runtimeDictionary)).length;
  const exactUi = [...Object.entries({ ...runtimeDictionary, ...uiDictionary })]
    .filter(([key, value]) => value === key && !allowedEnglish.has(key)).length;

  let distinctCopyFields = 0;
  let validSeo = 0;
  let faqPages = 0;
  let exactEnglishFaqs = 0;
  for (const tool of tools) {
    const localTool = localizedTool(tool, language);
    distinctCopyFields += copyFields.filter((field) => localTool[field] !== tool[field]).length;
    const html = renderToolPage(localTool, 'coverage', language, tools);
    const meta = metadata(html);
    if (meta.title.length >= 15 && meta.title.length <= 65 && meta.description.length >= 25 && meta.description.length <= 155) validSeo++;
    const faqs = faqItems(html);
    if (faqs.length >= 2) faqPages++;
    const english = englishFaq.get(tool.id) ?? [];
    for (let index = 0; index < Math.min(faqs.length, english.length); index++) {
      if (faqs[index][0] === english[index][0] || faqs[index][1] === english[index][1]) exactEnglishFaqs++;
    }
  }

  const guideCount = guidesForLocale(language).length;
  const guideRoutes = guideCount === guides.length ? guides.length + 1 : 0;
  const reviewStatus = pack?.meta.translationReview?.status ?? 'existing locale';
  console.log(`${locale.code} | ${reviewStatus} | ${missingUi} | ${exactUi} | ${distinctCopyFields}/${tools.length * copyFields.length} | ${validSeo}/${tools.length} | ${faqPages}/${tools.length} (${exactEnglishFaqs} exact English fields) | ${guideRoutes}/${guides.length + 1}`);
}
