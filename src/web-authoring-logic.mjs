const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const color = (value) => /^#[\da-f]{6}$/iu.test(value) ? value : null;
const bounded = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;

export function parseFormFields(source) {
  if (typeof source !== 'string' || source.length > 12000) return { error: 'size', fields: [] };
  const lines = source.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 1 || lines.length > 60) return { error: 'count', fields: [] };
  const fields = []; const names = new Set();
  for (const line of lines) {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length > 3) return { error: 'line', fields: [] };
    const [labelRaw, typeRaw = 'text', requiredRaw = 'optional'] = parts;
    const label = labelRaw?.slice(0, 100);
    const type = typeRaw.toLowerCase();
    if (!label || labelRaw.length > 100 || !['text', 'email', 'number', 'date', 'textarea'].includes(type) || !['required', 'optional'].includes(requiredRaw.toLowerCase())) return { error: 'line', fields: [] };
    let name = label.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '').slice(0, 48) || `field-${fields.length + 1}`;
    const base = name; let suffix = 2; while (names.has(name)) name = `${base}-${suffix++}`; names.add(name);
    fields.push({ label, name, type, required: requiredRaw.toLowerCase() === 'required' });
  }
  return { error: null, fields };
}

export function buildHtmlForm(source, submitText = 'Submit') {
  const parsed = parseFormFields(source);
  if (parsed.error || typeof submitText !== 'string' || !submitText.trim() || submitText.length > 100) return { error: parsed.error ?? 'line', html: '' };
  const controls = parsed.fields.map(({ label, name, type, required }) => {
    const input = type === 'textarea' ? `<textarea id="${escape(name)}" name="${escape(name)}"${required ? ' required' : ''}></textarea>` : `<input id="${escape(name)}" name="${escape(name)}" type="${type}"${required ? ' required' : ''}>`;
    return `  <div>\n    <label for="${escape(name)}">${escape(label)}</label>\n    ${input}\n  </div>`;
  }).join('\n');
  return { error: null, html: `<form method="post">\n${controls}\n  <button type="submit">${escape(submitText.trim())}</button>\n</form>` };
}

export function buildEmailHtml({ brand = 'Your brand', heading = 'A short heading', body = 'Write your message here.', buttonLabel = 'Learn more', url = 'https://example.com', accent = '#3157d5', footer = 'You are receiving this message because you chose to hear from us.', language = 'en' } = {}) {
  const values = [brand, heading, body, buttonLabel, footer];
  if (values.some((value) => typeof value !== 'string' || !value.trim() || value.length > 2400)) return { error: 'text', html: '' };
  const lang = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/iu.test(language) ? language : 'en';
  let parsed; try { parsed = new URL(url); } catch { return { error: 'url', html: '' }; }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.href.length > 2048) return { error: 'url', html: '' };
  const safeAccent = color(accent); if (!safeAccent) return { error: 'color', html: '' };
  const html = `<!doctype html>\n<html lang="${escape(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(heading.trim())}</title></head>\n<body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#1f2937">\n<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6"><tr><td align="center" style="padding:24px 12px">\n<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px"><tr><td style="padding:32px">\n<p style="margin:0 0 24px;color:#64748b">${escape(brand.trim())}</p><h1 style="margin:0 0 16px;font-size:26px">${escape(heading.trim())}</h1><p style="margin:0 0 24px;line-height:1.6;white-space:pre-wrap">${escape(body.trim())}</p>\n<a href="${escape(parsed.href)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:${safeAccent};color:#fff;text-decoration:none">${escape(buttonLabel.trim())}</a>\n<p style="margin:32px 0 0;color:#64748b;font-size:13px">${escape(footer.trim())}</p></td></tr></table></td></tr></table></body></html>`;
  return { error: null, html };
}

export function buildSvgDocument({ width = 640, height = 400, background = '#ffffff', items = [] } = {}) {
  const w = Math.round(bounded(width, 64, 2000, 640)); const h = Math.round(bounded(height, 64, 2000, 400));
  if (!color(background) || !Array.isArray(items) || items.length > 80) return '';
  const shapes = [];
  for (const item of items) {
    const fill = color(item.fill); if (!fill || !['rect', 'circle', 'text'].includes(item.type)) return '';
    const x = bounded(item.x, 0, w, 0); const y = bounded(item.y, 0, h, 0); const size = bounded(item.size, 4, Math.min(w, h), 48);
    if (item.type === 'rect') shapes.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`);
    else if (item.type === 'circle') shapes.push(`<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${fill}"/>`);
    else {
      if (typeof item.text !== 'string' || !item.text.trim() || item.text.length > 120) return '';
      shapes.push(`<text x="${x}" y="${y + size}" font-size="${size}" fill="${fill}">${escape(item.text)}</text>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${background}"/>${shapes.join('')}</svg>`;
}

export function buildPatternSvg({ motif = 'dots', size = 240, foreground = '#3157d5', background = '#ffffff', spacing = 24 } = {}) {
  const tile = Math.round(bounded(size, 80, 512, 240)); const gap = Math.round(bounded(spacing, 8, 96, 24));
  const fg = color(foreground); const bg = color(background); if (!fg || !bg) return '';
  const motifs = {
    dots: `<circle cx="${gap / 2}" cy="${gap / 2}" r="${Math.max(1, gap / 10)}" fill="${fg}"/>`,
    grid: `<path d="M ${gap} 0 H 0 V ${gap}" fill="none" stroke="${fg}" stroke-width="1.5"/>`,
    diagonal: `<path d="M -${gap / 2} ${gap / 2} L ${gap / 2} -${gap / 2} M 0 ${gap} L ${gap} 0 M ${gap / 2} ${gap * 1.5} L ${gap * 1.5} ${gap / 2}" fill="none" stroke="${fg}" stroke-width="2"/>`,
    cross: `<path d="M ${gap / 2 - 4} ${gap / 2} H ${gap / 2 + 4} M ${gap / 2} ${gap / 2 - 4} V ${gap / 2 + 4}" fill="none" stroke="${fg}" stroke-width="1.5"/>`,
  };
  if (!motifs[motif]) return '';
  const pattern = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}"><defs><pattern id="tile" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">${motifs[motif]}</pattern></defs><rect width="100%" height="100%" fill="${bg}"/><rect width="100%" height="100%" fill="url(#tile)"/></svg>`;
  return pattern;
}
