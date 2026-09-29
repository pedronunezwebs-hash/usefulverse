# UsefulVerse

Browser-first collection of fast, private, static tools for everyday work.

## Principles

- Processing happens in the browser whenever possible.
- No account, upload or paid API is required.
- Each useful tool gets its own stable, indexable URL.
- The current catalog contains 33 browser-only tools across writing, data, developer, SEO, design, privacy, text and everyday tasks.
- The public build is static and deployable to Cloudflare Pages.
- CSS and JavaScript URLs are content-versioned during the build so CDN caches cannot serve an old runtime after a deploy.
- HTML uses short browser and edge cache lifetimes; versioned assets remain immutable for repeat visits.

## Local development

```bash
npm run check
npm run serve
```

Open `http://localhost:4173` after starting the server.

## Languages and localized URLs

English remains the default at `/`. Spanish is published at `/es/`, French at
`/fr/`, Brazilian Portuguese at `/pt-br/`, and German at `/de/`; each of the 33
tools has a matching URL under each language prefix. The build creates all five
versions as static HTML (170 URLs total), adds reciprocal `hreflang` and canonical
tags,
and lists every version with language alternates in `sitemap.xml`. It does not
call a translation service at build time or in the visitor's browser.

When adding a tool, add its translated title, description, keywords, intro and
explanation for Spanish and French in `src/locales.mjs`, and Brazilian
Portuguese in `src/locales/pt-br.mjs`, and German in `src/locales/de.mjs`. Add
translations for any new labels and runtime messages there as well.
`npm run check` verifies that every locale has
a generated page and valid canonical/hreflang entries.

## GitHub + Cloudflare Pages

`usefulverse.com` is already served by the Cloudflare Pages project `usefulverse`.
That project uses Direct Upload, so keep publishing to it rather than creating a
second Pages project or trying to switch it to Git integration. The versioned
workflow at `.github/workflows/deploy-cloudflare.yml` keeps the existing project and
domain while making GitHub the source of truth:

- Pull requests run `npm ci`, the tests and the production build checks; they do not
  publish to the live site.
- A push to `main` runs the same checks, then uploads `dist/` to the existing Pages
  project. Your computer does not need to stay on or run a local server.
- `.node-version` keeps the build on Node.js 24 LTS, and `package-lock.json` makes clean
  installs reproducible.

### One-time repository setup

1. Create an empty GitHub repository named `usefulverse` (do not initialize it with
   another README, license or `.gitignore`).
2. In that repository, add Actions secrets named `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`. Use a dedicated Cloudflare token with only the
   `Account > Cloudflare Pages > Edit` permission for the account that owns the site;
   do not reuse the broader local agent token. Never put either value in this repo.
3. Push this project to `main`. GitHub will run the tests and build, then deploy to
   the existing Cloudflare Pages project. No DNS change is part of the workflow.

Cloudflare serves the generated static files; this site does not need a Worker,
Pages Function, database, scheduled task or paid API. Cloudflare currently lists
static asset requests as free and unlimited. GitHub Actions on a private repository
uses the account's included minutes; usage beyond that allowance may be billed if
spending is enabled. The workflow has no timer and runs only for pull requests to
`main` and pushes to `main`. See [Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/)
and [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
for the current terms.

For a local production-equivalent check before proposing a change:

```bash
npm ci
npm test
npm run check
```

## Monetization readiness

Ads are intentionally not included in the build yet. Before activation, add the
owner's real legal identity and contact address to the privacy/legal pages, obtain
the approved publisher ID, create the correct `ads.txt` entry, configure consent
for regulated regions, and then add only tested ad placements. Never commit an
AdSense publisher ID or a third-party ad script before the site is approved.

## SEO operations

For every SEO review, check search-engine coverage separately for Google Search Console,
Bing Webmaster Tools, Yandex Webmaster, and Brave Search. Include other regional engines
when the site's target languages and markets justify them. Use each engine's own verified
data source when available; never infer impressions, clicks, rankings, or indexing from
crawl permission alone. Brave has no standard owner dashboard for submitting a sitemap,
so check crawl access and observed results without claiming guaranteed indexing.

Do not introduce paid SEO APIs or infrastructure without the owner's approval. Yandex
Webmaster API access requires a registered/approved OAuth client and access token. The
manual CLI below is not scheduled and makes no requests unless the owner explicitly asks
to run a command. Keep the token only in the ignored local `.env.yandex` file; never put it
in site code, `public/`, `dist/`, or a chat message. The file must have mode `600`.

The CLI can check the verified property and detected sitemaps, add the sitemap, inspect
the daily recrawl quota and request/review a page recrawl. It cannot edit the actual XML:
`npm run build` regenerates `dist/sitemap.xml`; publishing that build makes the changed
file available, and Yandex discovers it from `robots.txt`. A recrawl request is only a
request, not a promise of indexing.

After Yandex issues API access and Pedro has saved the token locally in `.env.yandex`, use
only on explicit request:

```bash
npm run seo:yandex -- status
npm run seo:yandex -- sitemaps
npm run seo:yandex -- add-sitemap
npm run seo:yandex -- quota
npm run seo:yandex -- recrawl https://usefulverse.com/tools/percentage-calculator/
npm run seo:yandex -- queue
npm run seo:yandex -- task <task-uuid>
```

Yandex's current API onboarding documentation describes registering a client application
and receiving a `client_id`; its API terms also mention a partner agreement/approval. The
OAuth guide lists the `webmaster:hostinfo` and `webmaster:verify` permissions. Confirm the
account's current eligibility in Yandex before relying on API access. The local CLI never
creates OAuth apps, issues tokens, runs in the background, or changes anything on Yandex
unless one of its explicit commands is invoked.

For free indexing notifications, use `npm run seo:indexnow -- <changed-URL...>` after
publishing new, updated, or removed pages. Use `npm run seo:indexnow -- --sitemap` only
for an initial submission or a substantial sitemap change, after `npm run check`. The
command validates that URLs belong to UsefulVerse and sends one IndexNow request to
Yandex; participating IndexNow engines share the notification. A `200` means received,
and a first `202` means key verification may still be pending. Neither status guarantees
that a page will be indexed.
