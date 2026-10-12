export const EMAIL_SIGNATURE_LIMITS = Object.freeze({ maxTextLength: 120, maxWebsiteLength: 500, maxLogoBytes: 512 * 1024 });

const escapeHtml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function cleanText(value, name, { required = false } = {}) {
  const text = String(value ?? '').trim();
  if (required && !text) throw new RangeError(`${name} is required.`);
  if (text.length > EMAIL_SIGNATURE_LIMITS.maxTextLength) throw new RangeError(`${name} is too long.`);
  return text;
}

function safeHttpsUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (raw.length > EMAIL_SIGNATURE_LIMITS.maxWebsiteLength) throw new RangeError('Website is too long.');
  let url;
  try { url = new URL(/^https:\/\//iu.test(raw) ? raw : ['https:', raw].join('//')); } catch { throw new RangeError('Enter a valid HTTPS website.'); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) throw new RangeError('Website links must use HTTPS and cannot contain login details.');
  return url.href;
}

function safeLogoDataUrl(value) {
  const dataUrl = String(value ?? '');
  if (!dataUrl) return '';
  if (dataUrl.length > Math.ceil(EMAIL_SIGNATURE_LIMITS.maxLogoBytes * 4 / 3) + 128) throw new RangeError('Logo must be 512 KiB or smaller.');
  const match = dataUrl.match(/^data:image\/(png|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$/u);
  if (!match) throw new RangeError('Logo must be a PNG, JPEG, or GIF image.');
  const bytes = Math.floor(match[2].length * 3 / 4) - (match[2].endsWith('==') ? 2 : match[2].endsWith('=') ? 1 : 0);
  if (bytes > EMAIL_SIGNATURE_LIMITS.maxLogoBytes) throw new RangeError('Logo must be 512 KiB or smaller.');
  return dataUrl;
}

export function createEmailSignature({ fullName, jobTitle = '', organization = '', email = '', phone = '', website = '', location = '', accentColor = '#3157d5', logoDataUrl = '', logoAlt = '' }) {
  const person = cleanText(fullName, 'Name', { required: true });
  const role = cleanText(jobTitle, 'Job title');
  const company = cleanText(organization, 'Organization');
  const place = cleanText(location, 'Location');
  const alt = cleanText(logoAlt || person, 'Logo alternative text');
  const mail = cleanText(email, 'Email');
  if (mail && (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/u.test(mail) || mail.length > EMAIL_SIGNATURE_LIMITS.maxTextLength)) throw new RangeError('Enter a valid email address.');
  const phoneText = cleanText(phone, 'Phone');
  if (phoneText && !/^[+\d().\s-]{3,32}$/u.test(phoneText)) throw new RangeError('Enter a phone number using digits and common phone symbols only.');
  const phoneHref = phoneText ? phoneText.replace(/[^+\d]/gu, '') : '';
  const site = safeHttpsUrl(website);
  const color = String(accentColor ?? '');
  if (!/^#[\da-f]{6}$/iu.test(color)) throw new RangeError('Choose a six-digit HEX accent color.');
  const logo = safeLogoDataUrl(logoDataUrl);
  const lines = [role, company, place].filter(Boolean).map(escapeHtml);
  const contacts = [];
  if (mail) contacts.push(`<a href="mailto:${escapeHtml(mail)}" style="color:${color};text-decoration:underline">${escapeHtml(mail)}</a>`);
  if (phoneText) contacts.push(`<a href="tel:${escapeHtml(phoneHref)}" style="color:${color};text-decoration:underline">${escapeHtml(phoneText)}</a>`);
  if (site) contacts.push(`<a href="${escapeHtml(site)}" style="color:${color};text-decoration:underline">${escapeHtml(new URL(site).hostname)}</a>`);
  const logoCell = logo ? `<td style="padding:0 14px 0 0;vertical-align:top"><img src="${logo}" alt="${escapeHtml(alt)}" width="72" style="display:block;width:72px;max-width:72px;height:auto;border:0"></td>` : '';
  const textCell = `<td style="border-left:3px solid ${color};padding:2px 0 2px 14px;font-family:Arial,Helvetica,sans-serif;color:#202124;vertical-align:top"><div style="font-size:16px;line-height:1.35;font-weight:700">${escapeHtml(person)}</div>${lines.map((line) => `<div style="font-size:13px;line-height:1.5;color:#50545a">${line}</div>`).join('')}${contacts.length ? `<div style="font-size:13px;line-height:1.7;margin-top:6px">${contacts.join(' <span style="color:#9aa0a6">|</span> ')}</div>` : ''}</td>`;
  const html = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody><tr>${logoCell}${textCell}</tr></tbody></table>`;
  const plainText = [person, ...[role, company, place].filter(Boolean), ...[mail, phoneText, site].filter(Boolean)].join('\n');
  return Object.freeze({ html, plainText });
}
