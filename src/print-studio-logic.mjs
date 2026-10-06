const esc = (value) => String(value ?? '').replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
const safeText = (value, max = 180) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/gu, ' ').trim().slice(0, max);
const colorMap = { blue: ['#eaf2ff', '#173f8a'], green: ['#ecfdf3', '#166534'], orange: ['#fff7ed', '#9a3412'], violet: ['#f5f3ff', '#5b21b6'] };

export function makePrintDesign(kind, fields = {}, options = {}) {
  const supported = ['printable-label-maker', 'poster-maker', 'certificate-maker', 'invitation-maker'];
  if (!supported.includes(kind)) throw new RangeError('Unsupported print design.');
  const paper = options.paper === 'letter' ? { width: 816, height: 1056 } : { width: 794, height: 1123 };
  const [background, accent] = colorMap[options.theme] ?? colorMap.blue;
  const line = (value, x, y, size, weight = 400) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${accent}">${esc(safeText(value))}</text>`;
  let content;
  if (kind === 'printable-label-maker') {
    const labels = String(fields.items ?? '').split(/\r?\n/u).map((item) => safeText(item, 80)).filter(Boolean).slice(0, 30);
    const cellWidth = paper.width / 3; const cellHeight = paper.height / 10;
    content = `<rect width="${paper.width}" height="${paper.height}" fill="#fff"/>${Array.from({ length: 30 }, (_, index) => { const x = index % 3 * cellWidth; const y = Math.floor(index / 3) * cellHeight; return `<rect x="${x + 4}" y="${y + 4}" width="${cellWidth - 8}" height="${cellHeight - 8}" rx="5" fill="${background}" stroke="#94a3b8" stroke-dasharray="5 4"/>${line(labels[index] ?? '', x + cellWidth / 2, y + cellHeight / 2 + 5, 14)}`; }).join('')}`;
  } else {
    const title = kind === 'poster-maker' ? safeText(fields.title) : kind === 'certificate-maker' ? safeText(fields.award) : safeText(fields.event);
    const subtitle = kind === 'poster-maker' ? safeText(fields.subtitle) : kind === 'certificate-maker' ? safeText(fields.recipient) : safeText(fields.date);
    const detail = kind === 'poster-maker' ? safeText(fields.message) : kind === 'certificate-maker' ? safeText(fields.issuer) : `${safeText(fields.time)} · ${safeText(fields.place)}`;
    const footer = kind === 'certificate-maker' ? safeText(fields.date) : kind === 'invitation-maker' ? safeText(fields.rsvp) : '';
    content = `<rect width="${paper.width}" height="${paper.height}" fill="${background}"/><rect x="32" y="32" width="${paper.width - 64}" height="${paper.height - 64}" rx="24" fill="none" stroke="${accent}" stroke-width="5"/><circle cx="${paper.width / 2}" cy="145" r="18" fill="${accent}"/>${line(title || (kind === 'poster-maker' ? 'Your poster' : kind === 'certificate-maker' ? 'Certificate of achievement' : 'You are invited'), paper.width / 2, paper.height * 0.37, 38, 700)}${line(subtitle, paper.width / 2, paper.height * 0.46, 28, 600)}${line(detail, paper.width / 2, paper.height * 0.56, 18)}${line(footer, paper.width / 2, paper.height * 0.67, 16)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${paper.width}" height="${paper.height}" viewBox="0 0 ${paper.width} ${paper.height}">${content}</svg>`;
}

export function printDesignHasContent(kind, fields = {}) {
  if (kind === 'printable-label-maker') return String(fields.items ?? '').split(/\r?\n/u).some((item) => safeText(item, 80));
  const contentFields = {
    'poster-maker': ['title', 'subtitle', 'message'],
    'certificate-maker': ['recipient', 'award', 'issuer', 'date'],
    'invitation-maker': ['event', 'date', 'time', 'place', 'rsvp'],
  }[kind] ?? [];
  return contentFields.some((field) => safeText(fields[field]));
}
