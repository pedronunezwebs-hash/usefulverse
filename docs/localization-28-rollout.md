# Full-site rollout: 28 locales

## Objective and acceptance

Make every currently published UsefulVerse route available as genuinely localized,
usable static content in all 28 existing locales. Do not publish English fallback copy
under a localized URL or expose a locale in the picker before its route is complete.

Acceptance for completion:

- All 88 tool pages, all 28 home pages, and the guides index plus four guides exist in
  each locale: 2,632 localized URLs total.
- UI/runtime labels, tool names, instructions, FAQs, SEO title/description, guide copy,
  navigation and error messages are populated for all 28 locales. The owner accepts basic
  machine translation for the 12 added locales; this does not claim native proofreading.
- RTL direction is correct for Arabic and Urdu; Chinese Traditional is genuinely
  localized for zh-TW rather than merely relabeled Simplified Chinese.
- Every route has correct canonical, reciprocal hreflang alternates and sitemap entry.
- Build checks reject missing translations, English fallback strings, missing routes,
  duplicate titles and sitemap/hreflang mismatches.
- Site remains static and browser-first: no translation API, server function, paid
  service or runtime translation dependency is introduced.
- Tests/build pass, deployed pages are checked, and changed URLs are submitted through
  the repository's documented SEO workflow where credentials and scope allow.

## Verified baseline (2026-10-01)

- 16 locales cover the whole site; 12 additional locales currently cover only 15 PDF
  routes each.
- 88 tools; 4 guides plus the guides index; current sitemap contains 1,609 URLs.
- The 12 PDF-only locale packs each have 223 UI strings and 15 tool copy records; a
  full-site locale pack currently has roughly 1,081–1,090 UI strings.
- The required full-site target is 28 × (88 tools + 1 home + 5 guide routes) = 2,632.
- No local Argos/Transformers translation runtime was installed before this task.

## Phases and status

1. **Inventory and translation method.** The offline Argos,
   MADLAD-400, and Qwen3-1.7B passes were evaluated and rejected because representative
   translations contained mistranslations, truncations, marker damage, or gibberish. The
   approved model downloads were verified and run locally, then rejected. After the owner
   declined Azure subscription creation and additional model downloads, the owner requested
   fast, understandable translations and accepted Google Translate output. Static drafts
   were generated in bounded chunks, placeholders/URLs checked, zh-TW regenerated with
   the correct target, and remaining uncovered strings repaired.
2. **Locale data — implemented.** All 12 added locale dictionaries, tool copy, SEO,
   FAQs, guides and shared labels are populated. Strict route, placeholder and metadata
   checks remain the release criteria; no claim of native review is made.
3. **Routing and SEO.** Promote all 28 locales to full-site locales; generate all homes,
   tools and guides; update picker, reciprocal hreflang/canonicals, robots/llms files and
   sitemap together.
4. **Quality loop.** Test representative tools and guides in all locales, RTL behavior,
   long labels, Unicode input, forms/errors and real browser layouts; fix findings and
   rerun all tests/build.
5. **Publish.** Review exact diff and CI, merge through the repository's approved GitHub
   flow, confirm Cloudflare Pages deployment and public route/sitemap responses; perform
   supported sitemap/indexing submissions without claiming guaranteed indexing.

## Decisions and guardrails

- Interpret “all URLs” as every existing URL family, including home and guide URLs, not
  just the 88 tools.
- Translation is static build content. The owner accepts practical machine translation
  for the 12 added locales. Placeholders, routes, metadata bounds and release checks still
  must pass; the content is not represented as natively proofread.
- No live third-party translation API, paid API, server-side conversion/translation, or
  claim of guaranteed indexing is in scope.
- Do not deploy a partial 28-locale selector or sitemap that presents untranslated pages
  as localized.

## Session log

- 2026-10-01: Confirmed clean isolated branch `codex/all-tools-28-locales` at
  `origin/main` commit `dec6885`; no source edits yet. Confirmed 16 full-site + 12 PDF-only
  locales, 88 tools, 5 guide routes, 1,609 current URLs, and no Argos/Transformers Python
  package already installed. Official Argos project lists the relevant target languages
  with downloadable offline models; suitability and representative output remain untested.
  Index contains generic zh, not zh-TW. No public pages, sitemap or search-engine state
  were changed; do not mistake this inventory/plan for a completed rollout.
- 2026-10-01: HEAD-checked all 12 English→target Argos model packages in the official
  package index: 950,703,221 bytes total (907 MiB), before translation runtime/dependencies.
  User explicitly approved downloading and generating local drafts. Argos 1.11 and its
  dependencies installed successfully in `/tmp/usefulverse-local-translation-20261001`;
  the website, Git-tracked dependencies, Pages build and live services remain untouched.
- 2026-10-01: Re-ran the site's existing baseline suite before source work: 245 tests pass;
  build confirms 1,609 current routes. This is baseline evidence only, not completion of the
  28-locale rollout.
- 2026-10-02: Rejected the Argos output after tests and sample review exposed mistranslations.
  With the user's separate approval, downloaded the 1.65 GB `jbochi/madlad400-3b-mt`
  quantized model to the task-scoped temporary directory; SHA-256 verified as
  `ea6e5531a3e95213c7f0635988d119e078a655c09306e47851e15d4c0c3f9c37`. Candle's Metal
  runner is being compiled locally. An initial 773-row pilot was stopped after finding
  Argos-generated values had been mistakenly retained as existing copy; the source export
  now builds translations from canonical English and preserves only the original PDF copy.
  The corrected first pass contains 26,258 unique prompt rows for the 12 expanded locales.
  A second 1,643-row batch covers four guide pages/UI for 11 existing full-site locales and
  translated source labels for the 12 expanded locales. No translation pack, sitemap,
  deployment, or search-engine submission has been published.
- 2026-10-02: Replaced the original decoding ceiling with a length-aware cap and explicit
  completion flag so unfinished output can be retried instead of silently installed.
  Enabled Candle's incremental decoder cache, clearing it between batches; a 29-row sample
  matched the previous output exactly and completed faster. The full 26,258-row first pass
  completed locally. Automated completion/marker validation did not make it publishable;
  a 96-row retry strategy still had truncations, marker corruption, and repeated text.
- 2026-10-02: With separate user approval, downloaded Qwen3-1.7B Q5_K_M (1,471,805,856
  bytes) to the task-scoped temporary directory; SHA-256 matches the Hugging Face Xet
  digest `4287aca1b231f27dbd20012c4bf9693c89b6c849dc02b7027096da54564d4037`. The model
  is Apache-2.0 and supports the target language families, but a 48-string pilot showed
  severe mistranslations and repetition in Bulgarian, Catalan, Greek, Malay, Polish,
  Swedish, Ukrainian and Swahili. This candidate is rejected for site copy. All 12
  expanded locale packs remain unreviewed/unpublished candidate translations; URL routing,
  sitemap, deployment and search-engine state remain unchanged.
- 2026-10-02: Revalidated this worktree after the user declined another translation-model
  download. `npm test` fails locale acceptance checks (including English leftovers,
  placeholder mismatches, SEO length failures and missing localized feature copy). The
  expanded packs also contain visibly corrupted guide drafts in spot checks; those are
  not approved translations. `npm run check` exposed that the 15 existing non-English
  locales lack guide packs. Added a source-level route-coverage gate before `build.mjs`
  removes/replaces `dist`, plus focused tests; the gate now reports all missing base
  locales and refuses to build. The partial preview output from the first check was
  preserved under `/tmp`, and the local `dist` was restored from `origin/main` at
  `dec6885` (1,609 baseline pages). No commit, push, production deployment, sitemap
  change or search-engine submission was made.
- 2026-10-02: Added `npm run locale:report` to summarize source-level gaps without treating
  string presence as translation approval. The report runs across all 28 locales: it
  found 15 non-English locales with no guide routes and 12 candidate packs with 5/5 guide
  route records but known corrupted prose. For the 12 candidates, only 50–87 of 88 SEO
  title/description pairs meet current length limits; the full suite remains the release
  gate for English leftovers, placeholders, FAQ quality and other checks. No copy was
  machine-translated or promoted in this step.
- 2026-10-02: Authored and integrated the four Spanish guide translations from the English
  source, with explicit coverage for every prose string and unchanged routes, formulas,
  table values and source URLs. Added tests for structure, translation completeness,
  article rendering, canonical/hreflang and metadata lengths; all four pass. The report
  now shows Spanish at 5/5 guide routes, leaving 14 of the other non-English locales
  without guide translations. Added matching Brazilian Portuguese translations for the
  shared guide-interface labels; its articles are still missing. The 12 generated guide
  drafts remain unapproved; no model was downloaded, and no sitemap, build output, commit,
  push or deployment was changed.
- 2026-10-02: Authored and integrated complete Brazilian Portuguese and French translations
  of the four guides and guide index from the canonical English source. Added tests for
  every translatable field, protected formulas/table data/routes/source URLs, localized
  rendering, canonical/hreflang and SEO metadata lengths; the focused ES/PT-BR/FR and
  release-gate tests pass (16/16). The inventory now reports 5/5 routes for ES, FR and
  PT-BR; 12 original full-site locales still have no approved guide pack, while the other
  12 added-locale guide records remain unreviewed machine drafts. No model was downloaded,
  and no sitemap, build output, commit, push or deployment was changed.
- 2026-10-02: Authored and integrated complete German translations of the four guides and
  guide index. Tests verify all prose, protected routes/formulas/table values/source URLs,
  rendered metadata and canonical/hreflang; the focused German guide tests pass. The
  inventory now shows approved authored guide content for ES, FR, PT-BR and DE. Eleven
  original full-site locales still lack guide translations, and the 12 added-locale guide
  records remain unreviewed drafts. No model, build, sitemap or deployment was changed.
- 2026-10-02: Authored and integrated complete Japanese and Korean translations of the
  guide index and four articles. Tests cover all prose fields, source routes and formulas,
  localized SEO lengths, rendered copy, canonical/hreflang and original source links. The
  focused ES/FR/PT-BR/DE/JA/KO guide suite passes (20/20). Nine original full-site locales
  still lack guide translations; all 12 expanded-locale guide drafts remain unreviewed.
  No model was downloaded, and no build, sitemap, commit, push or deployment was changed.
- 2026-10-02: Authored and integrated complete Indonesian and Hindi guide translations.
  Tests cover every translatable prose field, preserved formulas/tables/routes/source URLs,
  rendered copy, canonical/hreflang and title/description bounds. The focused
  ES/FR/PT-BR/DE/JA/KO/ID/HI suite passes (26/26). Seven original full-site locales still
  have no guide pack; the 12 added-locale guide records remain unreviewed drafts. No model,
  build output, sitemap or deployment was changed.
- 2026-10-02: Authored all four Arabic guides and the guide index, with RTL metadata checks.
  Isolated inline arithmetic and formula code as LTR content and added tests for equations
  and binary table cells inside RTL pages. The focused suite for eight non-English locales
  plus release-gate tests passes (32/32). Six original full-site locales still lack guides;
  the 12 expanded-locale guide records are not approved. No sitemap or deployment changed.
- 2026-10-02: Authored and integrated the Simplified Chinese guide index and four articles.
  All guide prose, route/formula/source preservation, rendered copy and SEO metadata tests
  pass across nine authored locales (33/33 focused tests). Five full-site locales still
  lack guide packs: Bengali, Russian, Urdu, Turkish and Vietnamese. The 12 expanded-locale
  drafts still need full linguistic review; no sitemap or deployment changed.
- 2026-10-02: Added dedicated structural/rendering/SEO tests for Bengali and completed
  authored translations for Russian, Urdu, Turkish and Vietnamese. Urdu output is checked
  for RTL plus isolated LTR formulas. Fifteen non-English base locales now have guide
  packs; the 12 additional locales are still unreviewed drafts. The 28-locale site build
  rendered 2,632 pages to a disposable `/tmp` directory; the production/workspace `dist`
  was untouched. `check-build` now reaches SEO metadata validation but fails on out-of-range
  titles/descriptions, including 184 tool pages across the extra locales and English.
  `node --test` reports 357 passing and 34 failing tests; failures expose untranslated
  English UI/runtime strings, incomplete metadata and missing camera-copy localization in
  the expanded packs. Locale inventory also reports missing shared UI keys in every locale.
  No sitemap, deployment, commit or push was changed. No additional translation model was
  downloaded, in line with the user's instruction.
- 2026-10-02: Added an explicit release gate for the 12 expanded locales. Their status is
  recorded as `draft` until each has a complete linguistic review with reviewer/date;
  GitHub Actions now blocks publication while any are drafts. The coverage report exposes
  that state, and release-gate unit tests cover missing/incomplete approvals. This is a
  safety barrier, not completion of localization; no deployment, push, or sitemap update
  was performed.
- 2026-10-02: Corrected clear machine-translation artifacts in selected Swedish, Bulgarian
  and Catalan strings and updated a stale Turkish guide assertion. Verification now passes
  396/396 tests and the isolated build produces all 2,632 pages and sitemap URLs. The
  release check fails as intended only for the 12 unapproved expanded locales; no commit,
  push, production deploy, or search-engine submission was made.
- 2026-10-02: Per the owner's request for speed, used Google Translate in bounded chunks
  for all 12 added locales without creating a paid subscription. The owner explicitly
  accepted the resulting level of translation. Fixed uncovered labels, FAQ/guide strings
  and search-title length issues. `npm test` passes 400/400; the release gate passes for
  all 12 locales and the build generates 2,632 localized pages. Deployment and search
  console submissions remain separate steps.
