import { zipSync, strToU8 } from 'fflate';
import { buildStaticWebsite } from '../pending-23/logic.mjs';

const root = document.querySelector('[data-tool="static-website-builder"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const escapeHtml = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const makeFiles = (site) => {
    const sections = site.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join('\n');
    const html = `<!doctype html>\n<html lang="${escapeHtml(site.siteLanguage)}" dir="${escapeHtml(site.direction)}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="description" content="${escapeHtml(site.intro)}">\n<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'">\n<title>${escapeHtml(site.siteTitle)}</title>\n<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<header class="hero"><div class="wrap"><p class="eyebrow">${escapeHtml(site.siteTitle)}</p><h1>${escapeHtml(site.headline)}</h1><p class="lead">${escapeHtml(site.intro)}</p><a class="cta" href="${escapeHtml(site.ctaUrl)}" referrerpolicy="no-referrer">${escapeHtml(site.ctaLabel)}</a></div></header>\n<main class="wrap content">${sections}\n</main>\n<footer class="wrap footer"><p>${escapeHtml(site.siteTitle)}</p></footer>\n</body>\n</html>\n`;
    const css = `:root{color-scheme:light;--accent:${site.accentColor};--ink:#172033;--muted:#536176;--surface:#fff;--wash:#f3f5fa;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--surface);color:var(--ink);line-height:1.6}.wrap{width:min(100% - 2rem,68rem);margin-inline:auto}.hero{padding:clamp(3rem,9vw,7rem) 0;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 12%,white),var(--wash))}.eyebrow{font-weight:700;color:var(--accent)}h1{max-width:15ch;margin:.2em 0;font-size:clamp(2.25rem,7vw,4.5rem);line-height:1.05}.lead{max-width:60ch;color:var(--muted);font-size:1.15rem}.cta{display:inline-block;margin-top:1rem;padding:.8rem 1.2rem;border-radius:.65rem;background:var(--accent);color:#fff;text-decoration:none;font-weight:700}.content{padding-block:2rem}.content section{padding:1.5rem 0;border-bottom:1px solid #dce1ea}.content section p{max-width:70ch;color:var(--muted);white-space:pre-wrap}.footer{padding-block:2rem;color:var(--muted);font-size:.9rem}@media(prefers-reduced-motion:no-preference){.cta{transition:filter .15s ease}.cta:hover{filter:brightness(.9)}}`;
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${site.accentColor}"/><text x="32" y="43" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="700" fill="#fff">U</text></svg>`;
    return { html, css, icon };
  };
  const clear = () => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); };
  const render = (site) => {
    content.replaceChildren();
    const files = makeFiles(site);
    const preview = document.createElement('article'); preview.className = 'pending-site-preview'; preview.setAttribute('aria-label', copy.fields.preview); preview.lang = site.siteLanguage; preview.dir = site.direction;
    const hero = document.createElement('header'); hero.className = 'pending-site-preview__hero'; hero.style.setProperty('--preview-accent', site.accentColor);
    const brand = document.createElement('p'); brand.textContent = site.siteTitle;
    const heading = document.createElement('h3'); heading.textContent = site.headline;
    const intro = document.createElement('p'); intro.textContent = site.intro;
    const cta = document.createElement('a'); cta.textContent = site.ctaLabel; cta.href = site.ctaUrl; cta.rel = 'noopener noreferrer'; cta.referrerPolicy = 'no-referrer';
    hero.append(brand, heading, intro, cta); preview.append(hero);
    for (const section of site.sections) { const card = document.createElement('section'); const title = document.createElement('h4'); title.textContent = section.title; const body = document.createElement('p'); body.textContent = section.body; card.append(title, body); preview.append(card); }
    content.append(preview);
    const info = document.createElement('p'); info.className = 'hint'; info.textContent = copy.fields.downloadInfo; content.append(info);
    const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--secondary'; button.textContent = copy.fields.downloadSite;
    button.addEventListener('click', () => {
      const archive = zipSync({ 'index.html': strToU8(files.html), 'styles.css': strToU8(files.css), 'assets/favicon.svg': strToU8(files.icon) }, { level: 6 });
      const url = URL.createObjectURL(new Blob([archive], { type: 'application/zip' })); const link = document.createElement('a'); link.href = url; link.download = 'static-website.zip'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    content.append(button); result.hidden = false; status.classList.remove('status--error'); status.textContent = copy.messages.complete;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clear();
    const input = Object.fromEntries([...form.querySelectorAll('[data-input]')].map((control) => [control.dataset.input, control.value]));
    try { render(buildStaticWebsite(input)); }
    catch { status.textContent = copy.messages.error; status.classList.add('status--error'); }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
  for (const control of form.querySelectorAll('[data-input]')) control.addEventListener('input', clear);
}
