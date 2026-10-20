import { mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { localePath } from '../locales.mjs';
import { growthPilotTools, assertGrowthCatalogIsAdditive } from './catalog.mjs';
import { assertGrowthLocaleCoverage } from './locale-contract.mjs';
import { renderGrowthForm } from './forms.mjs';
import { renderGrowthHomePage, renderGrowthToolPage } from './render.mjs';

const sha = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);

async function walkFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walkFiles(path, files);
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function writeRoute(root, route, content) {
  const path = join(root, route.replace(/^\/+|\/+$/gu, ''), 'index.html');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

export function assertLocalController(toolId, source, maxBytes) {
  const bytes = Buffer.byteLength(source);
  if (bytes > maxBytes) throw new Error(`${toolId} controller exceeds the ${maxBytes}-byte initial runtime budget.`);
  const withoutSvgNamespace = source.replaceAll('http://www.w3.org/2000/svg', '');
  const withoutPackageNamespaces = withoutSvgNamespace
    .replaceAll(/https?:\/\/schema\.org\/?/gu, '')
    .replaceAll('http://schemas.openxmlformats.org/package/2006/content-types', '')
    .replaceAll('http://schemas.openxmlformats.org/package/2006/relationships', '')
    .replaceAll('http://schemas.openxmlformats.org/spreadsheetml/2006/main', '')
    .replaceAll('http://schemas.openxmlformats.org/officeDocument/2006/relationships', '');
  const localVocabularyFetch = /fetch\(new URL\(["']\/assets\/(?:schemaorg-v30\.1\.json|japanese-name-strokes\/stroke-counts\.json)["'],location\.origin\)/u;
  const allowedVocabularySource = source.replace(localVocabularyFetch, '');
  const localIpaDictionaryFetch = toolId === 'ipa-transcriber'
    && /fetch\(new URL\(["']\/assets\/ipa-transcriber\/cmudict-2026-10-20\.dict["'],location\.origin\)/u;
  const withoutAllowedFetch = localIpaDictionaryFetch
    ? allowedVocabularySource.replace(/fetch\(new URL\(["']\/assets\/ipa-transcriber\/cmudict-2026-10-20\.dict["'],location\.origin\)/u, '')
    : allowedVocabularySource;
  const remoteUrls = [...withoutPackageNamespaces.matchAll(/https?:\/\/[^\s"'`]+/gu)].map(([url]) => url);
  const fetchCalls = [...withoutAllowedFetch.matchAll(/\bfetch\s*\(/gu)];
  const pendingDispatcherCall = new RegExp(`\\b[$A-Z_a-z][$\\w]*\\(["']${toolId}["'],`).test(source);
  const pendingStaticReferenceBundle = pendingDispatcherCall && fetchCalls.length === 0;
  const localInputUrlParsing = fetchCalls.length === 0 && remoteUrls.some((url) => /^http:\/\/\$\{[^}]+\}\/?$/u.test(url)) && /new URL\(`http:\/\/\$\{[^}]+\}\/?`/u.test(source);
  const dnsInputOnlyUrl = toolId === 'dns-lookup'
    && remoteUrls.includes('http://${e}')
    && /new URL\(`http:\/\/\$\{[^}]+\}`\)/u.test(source);
  const rdapInputOnlyUrl = toolId === 'rdap-domain-lookup'
    && remoteUrls.filter((url) => /^https:\/\/\$\{[^}]+\}$/u.test(url)).length === 1
    && /new URL\(`https:\/\/\$\{[^}]+\}`\)/u.test(source);
  const ipLookupReferenceUrls = ['https://www.iana.org/assignments/rdap-ipv4','https://www.iana.org/assignments/rdap-ipv6'];
  const ipLookupReferencesAllowed = toolId === 'ip-geolocation-lookup'
    && ipLookupReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.filter((url) => ipLookupReferenceUrls.includes(url)).length === 2;
  const speedTestReferenceUrl = 'https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/';
  const speedTestReferencesAllowed = toolId === 'internet-speed-test'
    && remoteUrls.length === 1 && remoteUrls[0] === speedTestReferenceUrl;
  const skyMapReferenceAllowed = toolId === 'sky-map'
    && remoteUrls.length === 1 && remoteUrls[0] === 'https://github.com/cosinekitty/astronomy'
    && fetchCalls.length === 0;
  const htmlSanitizerExampleAllowed = toolId === 'html-sanitizer'
    && remoteUrls.length === 1 && remoteUrls[0] === 'https://example.invalid/'
    && fetchCalls.length === 0;
  const isWiktionaryEntryUrl = (url) => /^https:\/\/en\.wiktionary\.org\/wiki\/\$\{[^}]+\}$/u.test(url);
  const isWiktionaryHistoryUrl = (url) => /^https:\/\/en\.wiktionary\.org\/w\/index\.php\?title=\$\{[^}]+\}&action=history$/u.test(url);
  const isCommonsFileUrl = (url) => /^https:\/\/commons\.wikimedia\.org\/wiki\/File:\$\{[^}]+\}$/u.test(url);
  const wiktionaryDisplayUrls = remoteUrls.filter((url) => isWiktionaryEntryUrl(url) || isWiktionaryHistoryUrl(url) || isCommonsFileUrl(url) || url === 'https://en.wiktionary.org/wiki/Wiktionary:Copyrights' || url === 'https://upload.wikimedia.org');
  const expectedWiktionaryDisplayUrls = toolId === 'pronunciation-dictionary' ? 5 : 3;
  const wiktionaryReferenceUrls = ['dictionary','thesaurus','pronunciation-dictionary'].includes(toolId)
    && wiktionaryDisplayUrls.length === expectedWiktionaryDisplayUrls
    && wiktionaryDisplayUrls.some(isWiktionaryEntryUrl)
    && wiktionaryDisplayUrls.some(isWiktionaryHistoryUrl)
    && wiktionaryDisplayUrls.includes('https://en.wiktionary.org/wiki/Wiktionary:Copyrights')
    && (toolId !== 'pronunciation-dictionary' || (wiktionaryDisplayUrls.some(isCommonsFileUrl) && wiktionaryDisplayUrls.includes('https://upload.wikimedia.org')))
    && remoteUrls.every((url) => url === 'https://en.wiktionary.org/w/api.php' || wiktionaryDisplayUrls.includes(url));
  const weatherReferenceUrls = [
    'https://api.met.no/weatherapi/locationforecast/2.0/compact',
    'https://api.met.no/weatherapi/locationforecast/2.0/documentation',
    'https://docs.api.met.no/doc/License.html',
    'https://api.met.no/doc/TermsOfService',
  ];
  const weatherReferencesAllowed = toolId === 'weather-dashboard'
    && weatherReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === weatherReferenceUrls.length;
  const emailAuthReferenceUrls = ['https://www.rfc-editor.org/rfc/rfc7208.html','https://www.rfc-editor.org/rfc/rfc9989.html','https://www.rfc-editor.org/rfc/rfc6376.html'];
  const emailAuthReferencesAllowed = toolId === 'email-authentication-checker'
    && emailAuthReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.includes('https://cloudflare-dns.com/dns-query')
    && remoteUrls.length === 4;
  const sharedDocumentReferenceUrls = [
    'https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults',
    'https://www.labour.gov.in/static/uploads/2026/03/a4ccf4c6d97c4f1f36a6d83f8c64213d.pdf',
    'https://labour.gov.in/sites/default/files/184299.pdf',
    'https://www.incometaxindia.gov.in/Documents/Act/Income-tax-Act-2025.pdf',
    'https://www.incometaxindia.gov.in/documents/81799/11848482/memo-2026.pdf',
    'https://dea.gov.in/budget-division/475',
    'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm',
    'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/manual-e-documentacao-tecnica/manual-do-orientacao-do-fgts-digital-versao-1-40-27-02-2026.pdf',
    'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/perguntas-frequentes',
    'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm',
    'https://planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm',
    'https://www.rae.es/ortograf%C3%ADa-b%C3%A1sica/uso-de-la-tilde/las-reglas-de-acentuaci%C3%B3n-gr%C3%A1fica/la-acentuaci%C3%B3n-gr%C3%A1fica-de-las-palabras-con-secuencias-voc%C3%A1licas',
    'https://www.irs.gov/publications/p17',
    'https://gasy-fanorona.sourceforge.net/docs/fanorona_rules.html',
    'https://haveibeenpwned.com/Passwords',
    'https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf',
    'https://www.fda.gov/media/71114/download',
    'https://example.invalid/',
    'https://www.cdc.gov/high-blood-pressure/measure/',
    'https://acesso.mte.gov.br/data/files/FF8080812CD2239D012CE0B8674478C6/manual_empregador_port.pdf',
    'https://dartswdf.com/rules/',
    'https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Whist',
    'https://github.com/cosinekitty/astronomy',
    'https://github.com/ldez/cubejs',
    'https://icga.org/icga/games/Loa/',
    'https://jansuraksha.gov.in/Files/APY/ENGLISH/APY.pdf',
    'https://makruk.app/rules',
    'https://ntrs.nasa.gov/api/citations/19910020076/downloads/19910020076.pdf',
    'https://people.willamette.edu/~rloftus/Asia%20201/AS%20201%203CoinCasting.pdf',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC4937268/',
    'https://prd-web.optionseducation.org/strategies/all-strategies/long-put',
    'https://pubmed.ncbi.nlm.nih.gov/20233271/',
    'https://www.argentina.gob.ar/sites/default/files/2023/04/truco.pdf',
    'https://www.argentina.gob.ar/turismoydeportes/juegosevita/truco',
    'https://www.ato.gov.au/law/view/document?DocNum=0000081364&FullDocument=true',
    'https://www.ato.gov.au/law/view/pdf/acts/20250028.pdf',
    'https://www.brailleauthority.org/signage/index.html',
    'https://www.pagat.com/rummy/indian.html',
    'https://packolkata.imd.gov.in/panchang/en/preface',
    'https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-32a/inhalt.html',
    'https://www.bundesregierung.de/breg-de/aktuelles/beitragsgemessensgrenzen-2386514',
    'https://www.bundesgesundheitsministerium.de/beitraege',
    'https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung',
    'https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Zahlen-und-Fakten/Werte-der-Rentenversicherung/werte-der-rentenversicherung',
    'https://www.dia.govt.nz/diawebsite.nsf/wpg_url/services-casino-and-non-casino-gaming-rules-of-casino-table-games',
    'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/contribuicao-dos-segurados-facultativo-e-contribuinte-individual',
    'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal',
    'https://www.gov.scot/publications/scottish-budget-2026-2027-scottish-tax-ready-reckoners/pages/4/',
    'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past',
    'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027',
    'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    'https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay',
    'https://www.gov.wales/land-transaction-tax-rates-and-bands',
    'https://www.irs.gov/individuals/tax-withholding-estimator',
    'https://www.loc.gov/nls/services-and-resources/informational-publications/about-braille/',
    'https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi',
    'https://www.ncbi.nlm.nih.gov/books/NBK92007/',
    'https://www.nei.nih.gov/about/education-and-outreach/glaucoma-resources/national-eye-institute-statement-detection-glaucoma-and-adult-vision-screening',
    'https://www.nhs.uk/conditions/vision-loss/',
    'https://www.optionseducation.org/strategies/all-strategies/long-call',
    'https://www.pagat.com/fishing/scopa.html',
    'https://www.pdc.tv/sites/default/files/2020-08/DRA-Rules.pdf',
    'https://www.pfrda.org.in/schemes/atal-pension-yojana-apy',
    'https://www.pfrda.org.in/schemes/national-pension-system/nps-for-all-citizen-models',
    'https://www.pfrda.org.in/w/faqs/exits-for-all-citizen-model',
    'https://www.planalto.gov.br/ccivil_03/leis/l4090.htm',
    'https://www.planalto.gov.br/ccivil_03/leis/l4749.htm',
    'https://www.pmi.org/learning/library/leveraging-new-practice-standard-project-estimating-6222',
    'https://www.querencia.mt.gov.br/fotos_noticias/1334.pdf',
    'https://www.thailandchess.or.th/',
    'https://www.trucozone.com/regras-do-truco-paulista',
    'https://www.w3.org/TR/epub-34/',
    'http://purl.org/dc/elements/1.1/',
    'http://www.idpf.org/2007/opf',
    'http://www.idpf.org/2007/ops',
    'http://www.w3.org/1999/xhtml'
  ];
  const sharedStaticReferencesOnly = remoteUrls.length > 0 && remoteUrls.every((url) => sharedDocumentReferenceUrls.includes(url) || /^http:\/\/\$\{[^}]+\}\/?$/u.test(url)) && fetchCalls.length === 0;
  const emojiSearchSourceUrl = 'https://github.com/unicode-org/cldr-json/tree/91c267402229a59e3ef2774544f001bf959e8809/cldr-json/cldr-annotations-full';
  const emojiSearchFetchAllowed = toolId === 'emoji-search'
    && fetchCalls.length === 1
    && /\/assets\/emoji-search-data\/\$\{encodeURIComponent\([^}]+\)\}\.json/u.test(source)
    && /credentials:["']same-origin["']/u.test(source)
    && /cache:["']force-cache["']/u.test(source);
  const emojiSearchSourceAllowed = toolId === 'emoji-search'
    && remoteUrls.length === 1 && remoteUrls[0] === emojiSearchSourceUrl
    && emojiSearchFetchAllowed;
  const earthquakeFeedUrls = ['https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'];
  const earthquakeReferenceUrls = ['https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php','https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs','https://earthquake.usgs.gov/earthquakes/eventpage/','https://www.naturalearthdata.com/about/terms-of-use/'];
  const earthquakeMapAllowed = toolId === 'earthquake-map'
    && fetchCalls.length === 1
    && earthquakeFeedUrls.every((url) => remoteUrls.includes(url))
    && earthquakeReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === earthquakeFeedUrls.length + earthquakeReferenceUrls.length
    && /credentials:["']omit["']/u.test(source)
    && /redirect:["']error["']/u.test(source)
    && /referrerPolicy:["']no-referrer["']/u.test(source)
    && /mode:["']cors["']/u.test(source);
  const npsOfficialReferencesAllowed = toolId === 'india-nps-calculator' && fetchCalls.length === 0 && remoteUrls.length === 2 && remoteUrls.includes('https://www.pfrda.org.in/schemes/national-pension-system/nps-for-all-citizen-models') && remoteUrls.includes('https://www.pfrda.org.in/w/faqs/exits-for-all-citizen-model');
  const apyReferenceUrls = ['https://www.pfrda.org.in/schemes/atal-pension-yojana-apy','https://jansuraksha.gov.in/Files/APY/ENGLISH/APY.pdf'];
  const apyReferencesAllowed = toolId === 'india-apy-calculator' && fetchCalls.length === 0 && apyReferenceUrls.every((url) => remoteUrls.includes(url)) && remoteUrls.length === apyReferenceUrls.length;
  const scopaRulesLinkAllowed = toolId === 'scopa' && fetchCalls.length === 0 && remoteUrls.length === 1 && remoteUrls[0] === 'https://www.pagat.com/fishing/scopa.html';
  const crapsRulesLinkAllowed = toolId === 'craps-practice' && fetchCalls.length === 0 && remoteUrls.length === 1 && remoteUrls[0] === 'https://www.dia.govt.nz/diawebsite.nsf/wpg_url/services-casino-and-non-casino-gaming-rules-of-casino-table-games';
  const trucoReferenceUrls = ['https://www.argentina.gob.ar/turismoydeportes/juegosevita/truco','https://www.argentina.gob.ar/sites/default/files/2023/04/truco.pdf','https://www.querencia.mt.gov.br/fotos_noticias/1334.pdf','https://www.trucozone.com/regras-do-truco-paulista'];
  const trucoReferencesAllowed = toolId === 'truco'
    && fetchCalls.length === 0
    && remoteUrls.length === trucoReferenceUrls.length
    && trucoReferenceUrls.every((url) => remoteUrls.includes(url));
  const ukPayReferenceUrls = ['https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past','https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027','https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay'];
  const ukPayReferencesAllowed = toolId === 'uk-pay-calculator' && fetchCalls.length === 0 && remoteUrls.length === ukPayReferenceUrls.length && ukPayReferenceUrls.every((url) => remoteUrls.includes(url));
  const visualAcuityReferenceUrls = ['https://www.nei.nih.gov/about/education-and-outreach/glaucoma-resources/national-eye-institute-statement-detection-glaucoma-and-adult-vision-screening','https://www.nhs.uk/conditions/vision-loss/'];
  const visualAcuityReferencesAllowed = toolId === 'visual-acuity-check' && fetchCalls.length === 0 && remoteUrls.length === visualAcuityReferenceUrls.length && visualAcuityReferenceUrls.every((url) => remoteUrls.includes(url));
  const imageSearchReferenceUrls = ['https://commons.wikimedia.org/w/api.php','https://commons.wikimedia.org','https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia'];
  const imageSearchAllowed = toolId === 'image-search-open' && imageSearchReferenceUrls.every((url) => remoteUrls.includes(url)) && remoteUrls.length === imageSearchReferenceUrls.length && fetchCalls.length === 1 && source.includes('https://commons.wikimedia.org/w/api.php') && source.includes('filetype:bitmap') && source.includes('origin:"*"') && source.includes('credentials:"omit"') && source.includes('redirect:"error"') && source.includes('referrerPolicy:"no-referrer"') && source.includes('body?.getReader()') && source.includes('3e6') && source.includes('["thumb.wikimedia.org","upload.wikimedia.org"]');
  const brazilThirteenthReferenceUrls = ['https://www.planalto.gov.br/ccivil_03/leis/l4090.htm','https://www.planalto.gov.br/ccivil_03/leis/l4749.htm','https://acesso.mte.gov.br/data/files/FF8080812CD2239D012CE0B8674478C6/manual_empregador_port.pdf'];
  const brazilThirteenthReferencesAllowed = toolId === 'brazil-thirteenth-salary'
    && brazilThirteenthReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === brazilThirteenthReferenceUrls.length
    && fetchCalls.length === 0;
  const dartsRulesAllowed = toolId === 'darts-scoreboard'
    && remoteUrls.length === 2
    && remoteUrls.includes('https://www.pdc.tv/sites/default/files/2020-08/DRA-Rules.pdf')
    && remoteUrls.includes('https://dartswdf.com/rules/')
    && fetchCalls.length === 0;
  const pwnedPasswordReferenceUrls = ['https://haveibeenpwned.com/Passwords','https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/ContributionRate.pdf','https://www.fda.gov/media/71114/download'];
  const pwnedPasswordRangeUrl = remoteUrls.find((url) => /^https:\/\/api\.pwnedpasswords\.com\/range\/\$\{[^}]+\}$/u.test(url));
  const pwnedPasswordsLookupAllowed = toolId === 'password-breach-checker'
    && pwnedPasswordReferenceUrls.every((url) => remoteUrls.includes(url))
    && pwnedPasswordRangeUrl
    && remoteUrls.every((url) => sharedDocumentReferenceUrls.includes(url) || pwnedPasswordReferenceUrls.includes(url) || url === pwnedPasswordRangeUrl)
    && fetchCalls.length === 1
    && source.includes('"Add-Padding":"true"')
    && source.includes('mode:"cors"')
    && source.includes('credentials:"omit"')
    && source.includes('referrerPolicy:"no-referrer"')
    && source.includes('cache:"no-store"');
  const requestUrls = remoteUrls.filter((url) => !sharedDocumentReferenceUrls.includes(url) && !(toolId === 'emoji-search' && url === emojiSearchSourceUrl) && !(earthquakeMapAllowed && (earthquakeFeedUrls.includes(url) || earthquakeReferenceUrls.includes(url))) && !(trucoReferencesAllowed && trucoReferenceUrls.includes(url)) && !(ukPayReferencesAllowed && ukPayReferenceUrls.includes(url)) && !(visualAcuityReferencesAllowed && visualAcuityReferenceUrls.includes(url)) && !(crapsRulesLinkAllowed && url === 'https://www.dia.govt.nz/diawebsite.nsf/wpg_url/services-casino-and-non-casino-gaming-rules-of-casino-table-games') && !(scopaRulesLinkAllowed && url === 'https://www.pagat.com/fishing/scopa.html') && !(npsOfficialReferencesAllowed && ['https://www.pfrda.org.in/schemes/national-pension-system/nps-for-all-citizen-models','https://www.pfrda.org.in/w/faqs/exits-for-all-citizen-model'].includes(url)) && !(imageSearchAllowed && imageSearchReferenceUrls.includes(url)) && !(dnsInputOnlyUrl && url === 'http://${e}') && !(rdapInputOnlyUrl && /^https:\/\/\$\{[^}]+\}$/u.test(url)) && !(ipLookupReferencesAllowed && ipLookupReferenceUrls.includes(url)) && !(speedTestReferencesAllowed && url === speedTestReferenceUrl) && !(wiktionaryReferenceUrls && wiktionaryDisplayUrls.includes(url)) && !(weatherReferencesAllowed && weatherReferenceUrls.includes(url)) && !(emailAuthReferencesAllowed && emailAuthReferenceUrls.includes(url)) && !(brazilThirteenthReferencesAllowed && brazilThirteenthReferenceUrls.includes(url)) && !(dartsRulesAllowed && ['https://www.pdc.tv/sites/default/files/2020-08/DRA-Rules.pdf','https://dartswdf.com/rules/'].includes(url)) && !(toolId === 'uk-stamp-duty' && ['https://www.gov.uk/stamp-duty-land-tax/residential-property-rates','https://www.gov.scot/publications/scottish-budget-2026-2027-scottish-tax-ready-reckoners/pages/4/','https://www.gov.wales/land-transaction-tax-rates-and-bands'].includes(url)) && !(pwnedPasswordsLookupAllowed && (pwnedPasswordReferenceUrls.includes(url) || url === pwnedPasswordRangeUrl)));
  const emailAuthDnsAllowed = toolId === 'email-authentication-checker'
    && emailAuthReferencesAllowed
    && requestUrls.length === 1 && requestUrls[0] === 'https://cloudflare-dns.com/dns-query'
    && fetchCalls.length === 1
    && /credentials:["']omit["']/u.test(source)
    && /redirect:["']error["']/u.test(source)
    && /referrerPolicy:["']no-referrer["']/u.test(source)
    && /mode:["']cors["']/u.test(source)
    && />=17/u.test(source) && />65536/u.test(source);
  const qtcReferenceUrls = ['https://pmc.ncbi.nlm.nih.gov/articles/PMC4937268/','https://pubmed.ncbi.nlm.nih.gov/20233271/'];
  const qtcReferencesAllowed = toolId === 'qtc-calculator'
    && qtcReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === qtcReferenceUrls.length
    && fetchCalls.length === 0;
  const brailleReferenceUrls = ['https://www.brailleauthority.org/signage/index.html','https://www.loc.gov/nls/services-and-resources/informational-publications/about-braille/'];
  const brailleReferencesAllowed = toolId === 'braille-translator'
    && brailleReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === brailleReferenceUrls.length
    && fetchCalls.length === 0;
  const brazilINSSReferenceUrls = ['https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal','https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/contribuicao-dos-segurados-facultativo-e-contribuinte-individual'];
  const brazilINSSReferencesAllowed = toolId === 'brazil-inss-contribution'
    && brazilINSSReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === brazilINSSReferenceUrls.length
    && fetchCalls.length === 0;
  const makrukReferenceUrls = ['https://www.thailandchess.or.th/','https://makruk.app/rules'];
  const makrukReferencesAllowed = toolId === 'makruk'
    && makrukReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === makrukReferenceUrls.length
    && fetchCalls.length === 0;
  const iChingReferenceUrls = ['https://people.willamette.edu/~rloftus/Asia%20201/AS%20201%203CoinCasting.pdf'];
  const iChingReferencesAllowed = toolId === 'i-ching-oracle'
    && iChingReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === iChingReferenceUrls.length
    && fetchCalls.length === 0;
  const pertReferenceUrls = ['https://ntrs.nasa.gov/api/citations/19910020076/downloads/19910020076.pdf','https://www.pmi.org/learning/library/leveraging-new-practice-standard-project-estimating-6222'];
  const pertReferencesAllowed = toolId === 'project-pert-estimator'
    && pertReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === pertReferenceUrls.length
    && fetchCalls.length === 0;
  const dnsResolverAllowed = toolId === 'dns-lookup'
    && requestUrls.length === 1 && requestUrls[0] === 'https://cloudflare-dns.com/dns-query'
    && fetchCalls.length === 1;
  const rdapLookupAllowed = toolId === 'rdap-domain-lookup'
    && requestUrls.length === 1 && requestUrls[0] === 'https://data.iana.org/rdap/dns.json'
    && fetchCalls.length === 2
    && /new URL\(`domain\/\$\{encodeURIComponent\([^)]*\)\}`,[^)]+\)/u.test(source)
    && /\.protocol===?["']https:["']/u.test(source)
    && source.includes('redirect:"error"')
    && source.includes('objectClassName')
    && source.includes('protocol');
  const ipLookupAllowed = toolId === 'ip-geolocation-lookup'
    && ipLookupReferencesAllowed
    && requestUrls.length === 2
    && requestUrls.includes('https://data.iana.org/rdap/ipv4.json')
    && requestUrls.includes('https://data.iana.org/rdap/ipv6.json')
    && fetchCalls.length === 2
    && source.includes('objectClassName')
    && source.includes('new URL(`ip/${')
    && source.includes('redirect:"error"')
    && source.includes('credentials:"omit"')
    && source.includes('referrerPolicy:"no-referrer"');
  const sameOriginSpeedTestAllowed = toolId === 'internet-speed-test'
    && speedTestReferencesAllowed && requestUrls.length === 0
    && fetchCalls.length === 1
    && source.includes('location.origin')
    && source.includes('/assets/speed-test-probe.bin')
    && source.includes('/favicon.svg')
    && source.includes('mode:"same-origin"')
    && source.includes('credentials:"omit"')
    && source.includes('cache:"no-store"')
    && source.includes('redirect:"error"')
    && source.includes('referrerPolicy:"no-referrer"');
  const wiktionaryLookupAllowed = ['dictionary','thesaurus','pronunciation-dictionary'].includes(toolId)
    && requestUrls.length === 1 && requestUrls[0] === 'https://en.wiktionary.org/w/api.php'
    && wiktionaryReferenceUrls
    && fetchCalls.length === 1
    && /new URL\(["']https:\/\/en\.wiktionary\.org\/w\/api\.php["']\)/u.test(source)
    && source.includes('new URLSearchParams({action:"parse",page:')
    && source.includes('prop:"text",format:"json",origin:"*"')
    && source.includes('length>80')
    && /credentials:["']omit["']/u.test(source)
    && /redirect:["']error["']/u.test(source)
    && /referrerPolicy:["']no-referrer["']/u.test(source)
    && source.includes('body?.getReader')
    && source.includes('1e6')
    && source.includes('byteLength')
    && (toolId !== 'pronunciation-dictionary' || (source.includes('hostname==="upload.wikimedia.org"') && source.includes('pathname.startsWith("/wikipedia/commons/")')));
  const baccaratRulesLinkAllowed = toolId === 'baccarat-practice'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://www.dia.govt.nz/diawebsite.nsf/wpg_url/services-casino-and-non-casino-gaming-rules-of-casino-table-games'
    && fetchCalls.length === 0;
  const metWeatherLookupAllowed = toolId === 'weather-dashboard'
    && weatherReferencesAllowed && fetchCalls.length === 1
    && source.includes('URLSearchParams({lat:String(')
    && source.includes('lon:String(')
    && source.includes('toFixed(2)')
    && /method:["']GET["']/u.test(source)
    && /mode:["']cors["']/u.test(source)
    && /credentials:["']omit["']/u.test(source)
    && /redirect:["']error["']/u.test(source)
    && /referrerPolicy:["']origin["']/u.test(source)
    && source.includes('sessionStorage')
    && source.includes('headers.get("expires")');
  const ukStampDutyReferenceUrls = [
    'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    'https://www.gov.scot/publications/scottish-budget-2026-2027-scottish-tax-ready-reckoners/pages/4/',
    'https://www.gov.wales/land-transaction-tax-rates-and-bands',
  ];
  const ukStampDutyReferencesAllowed = toolId === 'uk-stamp-duty'
    && ukStampDutyReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === ukStampDutyReferenceUrls.length
    && fetchCalls.length === 0;
  const radioBrowserLookupAllowed = false;
  const indiaTaxReferenceUrls = [
    'https://www.labour.gov.in/static/uploads/2026/03/a4ccf4c6d97c4f1f36a6d83f8c64213d.pdf',
    'https://www.incometaxindia.gov.in/Documents/Act/Income-tax-Act-2025.pdf',
    'https://www.incometaxindia.gov.in/documents/81799/11848482/memo-2026.pdf',
    'https://dea.gov.in/budget-division/475',
  ];
  const indiaTaxReferencesAllowed = toolId === 'india-income-tax-calculator'
    && indiaTaxReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.every((url) => indiaTaxReferenceUrls.includes(url))
    && fetchCalls.length === 0;
  const australiaTaxReferenceUrls = [
    'https://www.ato.gov.au/law/view/pdf/acts/20250028.pdf',
    'https://www.ato.gov.au/law/view/document?DocNum=0000081364&FullDocument=true',
  ];
  const australiaTaxReferencesAllowed = toolId === 'australia-income-tax'
    && australiaTaxReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.every((url) => australiaTaxReferenceUrls.includes(url))
    && fetchCalls.length === 0;
  const indonesiaTaxReferenceUrls = [
    'https://jdih.kemenkeu.go.id/dok/pp-58-tahun-2023/files',
    'https://jdih.kemenkeu.go.id/dok/pmk-168-tahun-2023/files',
  ];
  const indonesiaTaxReferencesAllowed = toolId === 'indonesia-pph21'
    && indonesiaTaxReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.every((url) => indonesiaTaxReferenceUrls.includes(url))
    && fetchCalls.length === 0;
  const dnaCodeReferenceAllowed = toolId === 'dna-sequence-tool'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi'
    && fetchCalls.length === 0;
  const loaRuleReferenceAllowed = toolId === 'lines-of-action'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://icga.org/icga/games/Loa/'
    && fetchCalls.length === 0;
  const whistRuleReferenceAllowed = toolId === 'whist'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Whist'
    && fetchCalls.length === 0;
  const usPaycheckReferenceAllowed = toolId === 'us-paycheck-calculator'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://www.irs.gov/individuals/tax-withholding-estimator'
    && fetchCalls.length === 0;
  const rubiksSolverCreditAllowed = toolId === 'rubiks-cube-solver'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://github.com/ldez/cubejs'
    && fetchCalls.length === 0;
  const optionStrategyReferenceUrls = ['https://www.optionseducation.org/strategies/all-strategies/long-call','https://prd-web.optionseducation.org/strategies/all-strategies/long-put'];
  const optionStrategyReferencesAllowed = toolId === 'option-strategy-builder'
    && optionStrategyReferenceUrls.every((url) => remoteUrls.includes(url))
    && remoteUrls.length === optionStrategyReferenceUrls.length
    && fetchCalls.length === 0;
  const chemicalNameLookupAllowed = toolId === 'chemical-name-resolver'
    && remoteUrls.includes('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name')
    && remoteUrls.length === 1
    && fetchCalls.length === 1
    && source.includes('credentials:\"omit\"')
    && source.includes('referrerPolicy:\"no-referrer\"')
    && source.includes('redirect:\"error\"')
    && source.includes('AbortSignal.timeout(1e4)')
    && source.includes('256e3');
  const ipaTranscriberReferenceAllowed = toolId === 'ipa-transcriber'
    && remoteUrls.length === 1
    && remoteUrls[0] === 'https://github.com/cmusphinx/cmudict';
  const localAiChatModelAssetsAllowed = ['local-ai-chat', 'paraphrasing-tool'].includes(toolId)
    && remoteUrls.length === 2
    && remoteUrls.includes('https://huggingface.co/mlc-ai/Qwen3-0.6B-q4f16_1-MLC/resolve/8c14ce481d4c692769976ad52afea453a102df19')
    && remoteUrls.includes('https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/00fe7a40e57e5e8eb9fef87526a4bf28ad5846c0/web-llm-models/v0_2_86/base/Qwen3-0.6B-q4f16_1_cs1k-webgpu.wasm')
    && fetchCalls.length === 0;
  if (/\b(?:XMLHttpRequest|WebSocket|EventSource)\b/u.test(withoutAllowedFetch)
    || (fetchCalls.length && !chemicalNameLookupAllowed && !dnsResolverAllowed && !emailAuthDnsAllowed && !rdapLookupAllowed && !ipLookupAllowed && !sameOriginSpeedTestAllowed && !wiktionaryLookupAllowed && !baccaratRulesLinkAllowed && !crapsRulesLinkAllowed && !metWeatherLookupAllowed && !radioBrowserLookupAllowed && !emojiSearchFetchAllowed && !earthquakeMapAllowed && !imageSearchAllowed && !pwnedPasswordsLookupAllowed)
    || (requestUrls.length && !chemicalNameLookupAllowed && !pendingStaticReferenceBundle && !localInputUrlParsing && !dnsResolverAllowed && !rdapLookupAllowed && !ipLookupAllowed && !wiktionaryLookupAllowed && !baccaratRulesLinkAllowed && !crapsRulesLinkAllowed && !metWeatherLookupAllowed && !apyReferencesAllowed && !indiaTaxReferencesAllowed && !australiaTaxReferencesAllowed && !indonesiaTaxReferencesAllowed && !emailAuthDnsAllowed && !qtcReferencesAllowed && !brailleReferencesAllowed && !brazilINSSReferencesAllowed && !brazilThirteenthReferencesAllowed && !dartsRulesAllowed && !pertReferencesAllowed && !makrukReferencesAllowed && !iChingReferencesAllowed && !dnaCodeReferenceAllowed && !loaRuleReferenceAllowed && !whistRuleReferenceAllowed && !usPaycheckReferenceAllowed && !rubiksSolverCreditAllowed && !optionStrategyReferencesAllowed && !localAiChatModelAssetsAllowed && !skyMapReferenceAllowed)
    || (remoteUrls.length && !chemicalNameLookupAllowed && !ipaTranscriberReferenceAllowed && !pendingStaticReferenceBundle && !localInputUrlParsing && !dnsResolverAllowed && !rdapLookupAllowed && !ipLookupAllowed && !sameOriginSpeedTestAllowed && !wiktionaryLookupAllowed && !baccaratRulesLinkAllowed && !crapsRulesLinkAllowed && !scopaRulesLinkAllowed && !npsOfficialReferencesAllowed && !metWeatherLookupAllowed && !apyReferencesAllowed && !ukStampDutyReferencesAllowed && !radioBrowserLookupAllowed && !indiaTaxReferencesAllowed && !australiaTaxReferencesAllowed && !indonesiaTaxReferencesAllowed && !emailAuthDnsAllowed && !qtcReferencesAllowed && !brailleReferencesAllowed && !brazilINSSReferencesAllowed && !brazilThirteenthReferencesAllowed && !dartsRulesAllowed && !pertReferencesAllowed && !makrukReferencesAllowed && !iChingReferencesAllowed && !dnaCodeReferenceAllowed && !loaRuleReferenceAllowed && !whistRuleReferenceAllowed && !usPaycheckReferenceAllowed && !rubiksSolverCreditAllowed && !optionStrategyReferencesAllowed && !localAiChatModelAssetsAllowed && !skyMapReferenceAllowed && !htmlSanitizerExampleAllowed && !sharedStaticReferencesOnly && !dnsInputOnlyUrl && !rdapInputOnlyUrl && !emojiSearchSourceAllowed && !earthquakeMapAllowed && !trucoReferencesAllowed && !ukPayReferencesAllowed && !visualAcuityReferencesAllowed && !crapsRulesLinkAllowed && !scopaRulesLinkAllowed && !npsOfficialReferencesAllowed && !imageSearchAllowed && !pwnedPasswordsLookupAllowed)) {
    throw new Error(`${toolId} controller must not contact a remote service that has not been explicitly approved.`);
  }
  if (/\beval\s*\(|\bnew\s+Function\b/u.test(source)) throw new Error(`${toolId} controller contains dynamic code execution.`);
}

async function buildGrowthStaticSiteIntoDirectory({
  outputDir, origin, localeEntries, copyByLocale, controllerBundles, styles, toolStyles = {}, workerBundles = {}, extraAssets = {}, trustedWorkerDynamicCode = [], extraToolLocales = [],
  faviconSvg,
  currentTools, tools = growthPilotTools, maxFiles = 19_500,
  maxAssetBytes = 24 * 1024, maxFileBytes = 25 * 1024 * 1024,
}) {
  if (!outputDir || !Array.isArray(localeEntries) || !localeEntries.length || !styles || !faviconSvg) throw new TypeError('Build directory, locales, stylesheet and favicon are required.');
  if (await stat(outputDir).then(() => true, () => false)) throw new Error(`Refusing to overwrite an existing growth build directory: ${outputDir}`);
  assertGrowthCatalogIsAdditive(currentTools ?? [], tools);
  assertGrowthLocaleCoverage(tools, localeEntries, copyByLocale);
  for (const locale of extraToolLocales) {
    const localeCopy = copyByLocale[locale.key];
    if (!localeCopy?._home) throw new Error(`${locale.key}: extra tool locale is missing shared page copy.`);
    const availableTools = tools.filter((tool) => localeCopy[tool.id]);
    if (!availableTools.length) throw new Error(`${locale.key}: extra tool locale has no translated tool pages.`);
    for (const tool of availableTools) {
      const copy = localeCopy[tool.id];
      if (copy.copyLanguage !== locale.key || !copy.title?.trim() || !copy.description?.trim() || copy.title.length > 60 || copy.description.length > 160) {
        throw new Error(`${locale.key}/${tool.id}: extra tool locale copy is missing, mislabeled, or exceeds metadata limits.`);
      }
    }
  }
  for (const locale of localeEntries) {
    const home = copyByLocale[locale.key]._home;
    for (const key of ['title', 'description', 'intro', 'directoryLabel', 'freeLabel', 'footerFree']) {
      if (typeof home?.[key] !== 'string' || !home[key].trim()) throw new Error(`${locale.key}: missing localized home ${key}.`);
    }
    if (home.title.length > 60 || home.description.length > 160) throw new Error(`${locale.key}: home metadata exceeds its character budget.`);
    // Keep caller-owned locale data immutable so tests/build stages can safely reuse it.
  }
  for (const tool of tools) {
    if (typeof controllerBundles?.[tool.id] !== 'string' || !controllerBundles[tool.id].trim()) throw new Error(`Missing isolated browser controller for ${tool.id}.`);
    const controllerBudget = ['gpx-track-editor', 'music-transposition'].includes(tool.id)
      ? 72 * 1024
      : ['sky-map', 'panchang-calendar'].includes(tool.id) ? 64 * 1024
      : ['chess-opening-trainer', 'chess-puzzles', 'chess-analysis-board', 'makruk'].includes(tool.id)
      ? 48 * 1024
      : tool.logicModule === './tools/pending-23/logic.mjs' ? 72 * 1024 : maxAssetBytes;
    assertLocalController(tool.id, controllerBundles[tool.id], controllerBudget);
  }
  for (const [name, source] of Object.entries(workerBundles)) {
    if (!/^[a-z0-9-]+$/u.test(name) || typeof source !== 'string' || !source.trim()) throw new Error(`Invalid worker bundle: ${name}.`);
    if ((/\beval\s*\(|\bnew\s+Function\b/u.test(source)) && !trustedWorkerDynamicCode.includes(name)) throw new Error(`${name} worker contains dynamic code execution.`);
    if (Buffer.byteLength(source) > maxFileBytes) throw new Error(`${name} worker exceeds Cloudflare's per-file maximum.`);
  }
  for (const [name, contents] of Object.entries(extraAssets)) {
    if (!name || name.startsWith('/') || name.split('/').includes('..') || !(typeof contents === 'string' || Buffer.isBuffer(contents) || contents instanceof Uint8Array)) throw new Error(`Invalid static asset: ${name}.`);
    if (Buffer.from(contents).byteLength > maxFileBytes) throw new Error(`${name} exceeds Cloudflare's per-file maximum.`);
  }
  for (const [toolId, source] of Object.entries(toolStyles)) {
    if (!tools.some(({ id }) => id === toolId) || typeof source !== 'string' || !source.trim()) throw new Error(`Invalid tool stylesheet: ${toolId}.`);
    if (Buffer.byteLength(source) > maxAssetBytes) throw new Error(`${toolId} stylesheet exceeds the ${maxAssetBytes}-byte budget.`);
  }
  if (Buffer.byteLength(styles) > maxAssetBytes) throw new Error(`Growth stylesheet exceeds the ${maxAssetBytes}-byte budget.`);

  await mkdir(join(outputDir, 'assets'), { recursive: true });
  await writeFile(join(outputDir, 'favicon.svg'), faviconSvg);
  const version = sha(Buffer.concat([Buffer.from(styles), ...Object.entries(toolStyles).flatMap(([name, source]) => [Buffer.from(name), Buffer.from(source)]), ...tools.map(({ id }) => Buffer.from(controllerBundles[id])), ...Object.entries(workerBundles).flatMap(([name, source]) => [Buffer.from(name), Buffer.from(source)]), ...Object.entries(extraAssets).flatMap(([name, contents]) => [Buffer.from(name), Buffer.from(contents)])]));
  await writeFile(join(outputDir, 'assets', `growth600.${version}.css`), styles);
  const assetFiles = new Map([[`assets/growth600.${version}.css`, Buffer.byteLength(styles)]]);
  const toolStylePaths = {};
  const stylesheetPathsByContent = new Map();
  for (const [toolId, source] of Object.entries(toolStyles)) {
    const digest = sha(source);
    let path = stylesheetPathsByContent.get(digest);
    if (!path) {
      const filename = `${toolId}.${digest}.css`;
      await writeFile(join(outputDir, 'assets', filename), source);
      path = `/assets/${filename}`;
      stylesheetPathsByContent.set(digest, path);
      assetFiles.set(`assets/${filename}`, Buffer.byteLength(source));
    }
    toolStylePaths[toolId] = path;
  }
  for (const tool of tools) {
    const filename = `${tool.id}.${sha(controllerBundles[tool.id])}.js`;
    await writeFile(join(outputDir, 'assets', filename), controllerBundles[tool.id]);
    assetFiles.set(`assets/${filename}`, Buffer.byteLength(controllerBundles[tool.id]));
  }
  const workerPaths = {};
  for (const [name, source] of Object.entries(workerBundles)) {
    const filename = `${name}.${sha(source)}.mjs`;
    await writeFile(join(outputDir, 'assets', filename), source);
    workerPaths[name] = `/assets/${filename}`;
    assetFiles.set(`assets/${filename}`, Buffer.byteLength(source));
  }
  for (const [name, contents] of Object.entries(extraAssets)) {
    const path = join(outputDir, 'assets', name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
    assetFiles.set(`assets/${name}`, Buffer.from(contents).byteLength);
  }

  const canonicalUrls = [];
  for (const locale of localeEntries) {
    const localeCopy = copyByLocale[locale.key];
    const localeHomeRoute = localePath(locale.key);
    const homeHtml = renderGrowthHomePage({ tools, locale, localeEntries, copy: { ...localeCopy._home, tools: Object.fromEntries(tools.map((tool) => [tool.id, localeCopy[tool.id]])) }, origin });
    await writeRoute(outputDir, localeHomeRoute, homeHtml.replace('/assets/growth600.css', `/assets/growth600.${version}.css`));
    canonicalUrls.push(`${new URL(origin).origin}${localeHomeRoute}`);
    for (const tool of tools) {
      const copy = localeCopy[tool.id];
      let formHtml = renderGrowthForm(tool.id, copy);
      for (const [name, path] of Object.entries(workerPaths)) formHtml = formHtml.replaceAll(`__WORKER_${name.toUpperCase().replaceAll('-', '_')}__`, path);
      const pageLocales = [...localeEntries, ...extraToolLocales.filter((entry) => copyByLocale[entry.key]?.[tool.id])];
      let html = renderGrowthToolPage({ tool, locale, localeEntries: pageLocales, copy: { ...localeCopy._home, ...copy }, origin, assetVersion: version, formHtml,
        pathForLocale: (key, id = '') => {
          const extra = extraToolLocales.find((entry) => entry.key === key);
          return extra ? `${extra.prefix ?? `/${extra.key}`}${id ? `/tools/${id}/` : '/'}` : localePath(key, id);
        },
      });
      html = html.replace(`/assets/growth600.css?v=${version}`, `/assets/growth600.${version}.css`)
        .replace(`/assets/${tool.id}.js?v=${version}`, `/assets/${tool.id}.${sha(controllerBundles[tool.id])}.js`);
      if (toolStylePaths[tool.id]) html = html.replace('</head>', `  <link rel="stylesheet" href="${toolStylePaths[tool.id]}">\n</head>`);
      const route = localePath(locale.key, tool.id);
      await writeRoute(outputDir, route, html);
      canonicalUrls.push(`${new URL(origin).origin}${route}`);
    }
  }

  for (const locale of extraToolLocales) {
    const localeCopy = copyByLocale[locale.key];
    for (const tool of tools) {
      const copy = localeCopy?.[tool.id];
      if (!copy) continue;
      let formHtml = renderGrowthForm(tool.id, copy);
      for (const [name, path] of Object.entries(workerPaths)) formHtml = formHtml.replaceAll(`__WORKER_${name.toUpperCase().replaceAll('-', '_')}__`, path);
      const pageLocales = [...localeEntries, ...extraToolLocales.filter((entry) => copyByLocale[entry.key]?.[tool.id])];
      let html = renderGrowthToolPage({ tool, locale, localeEntries: pageLocales, copy: { ...localeCopy._home, ...copy }, origin, assetVersion: version, formHtml,
        pathForLocale: (key, id = '') => {
          const extra = extraToolLocales.find((entry) => entry.key === key);
          return extra ? `${extra.prefix ?? `/${extra.key}`}${id ? `/tools/${id}/` : '/'}` : localePath(key, id);
        },
      });
      html = html.replace(`/assets/growth600.css?v=${version}`, `/assets/growth600.${version}.css`)
        .replace(`/assets/${tool.id}.js?v=${version}`, `/assets/${tool.id}.${sha(controllerBundles[tool.id])}.js`);
      if (toolStylePaths[tool.id]) html = html.replace('</head>', `  <link rel="stylesheet" href="${toolStylePaths[tool.id]}">\n</head>`);
      const route = `${locale.prefix ?? `/${locale.key}`}/tools/${tool.id}/`;
      await writeRoute(outputDir, route, html);
      canonicalUrls.push(`${new URL(origin).origin}${route}`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(join(outputDir, 'sitemap.xml'), sitemap);
  await writeFile(join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin)}\n`);
  const english = copyByLocale.en;
  const llms = `# UsefulVerse tools\n\n${english._home.intro}\n\n${tools.map((tool) => `- [${english[tool.id].name}](${new URL(localePath('en', tool.id), origin)}): ${english[tool.id].description}`).join('\n')}\n\n- [Sitemap](${new URL('/sitemap.xml', origin)})\n`;
  await writeFile(join(outputDir, 'llms.txt'), llms);
  for (const locale of localeEntries) {
    const translated = copyByLocale[locale.key];
    const route = localePath(locale.key).replace(/^\/+|\/+$/gu, '');
    await writeFile(join(outputDir, route, 'llms.txt'), `# UsefulVerse — ${locale.name}\n\n${translated._home.intro}\n\n${tools.map((tool) => `- [${translated[tool.id].name}](${new URL(localePath(locale.key, tool.id), origin)}): ${translated[tool.id].description}`).join('\n')}\n\n- [Sitemap](${new URL('/sitemap.xml', origin)})\n`);
  }
  await writeFile(join(outputDir, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`);

  const files = await walkFiles(outputDir);
  if (files.length > maxFiles) throw new Error(`Growth Pages project would contain ${files.length} files; safety cap is ${maxFiles}.`);
  const sizes = await Promise.all(files.map(async (path) => ({ path, bytes: (await stat(path)).size })));
  const tooLarge = sizes.find(({ bytes }) => bytes > maxFileBytes);
  if (tooLarge) throw new Error(`Published asset exceeds Cloudflare's per-file maximum: ${tooLarge.path} (${tooLarge.bytes} bytes).`);
  const actualUrls = (await readFile(join(outputDir, 'sitemap.xml'), 'utf8')).match(/<loc>/gu)?.length ?? 0;
  if (actualUrls !== canonicalUrls.length) throw new Error(`Sitemap has ${actualUrls} URLs; expected ${canonicalUrls.length}.`);
  return { files: files.length, pages: canonicalUrls.length, sitemapUrls: actualUrls, totalBytes: sizes.reduce((sum, file) => sum + file.bytes, 0), origin: new URL(origin).origin, version, assetFiles: [...assetFiles] };
}

/**
 * Build in an isolated sibling directory and publish the completed tree with one rename.
 * A failed budget/validation check must never leave a partial deploy directory behind.
 */
export async function buildGrowthStaticSite(options) {
  const outputDir = resolve(options?.outputDir ?? '');
  if (!options?.outputDir) throw new TypeError('A build output directory is required.');
  if (await stat(outputDir).then(() => true, () => false)) throw new Error(`Refusing to overwrite an existing growth build directory: ${outputDir}`);

  const parent = dirname(outputDir);
  await mkdir(parent, { recursive: true });
  const stagingRoot = await mkdtemp(join(parent, '.growth600-build-'));
  const stagingOutput = join(stagingRoot, 'site');
  try {
    const result = await buildGrowthStaticSiteIntoDirectory({ ...options, outputDir: stagingOutput });
    await rename(stagingOutput, outputDir);
    return result;
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
}
