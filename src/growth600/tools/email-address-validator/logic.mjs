const ATEXT = "A-Za-z0-9!#$%&'*+/=?^_`{|}~-";
const DOT_ATOM = new RegExp(`^[${ATEXT}]+(?:\\.[${ATEXT}]+)*$`, 'u');
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u;

export function inspectEmailAddress(input) {
  const address = String(input ?? '').trim();
  if (!address) return Object.freeze({ valid: false, reason: 'empty' });
  const at = address.indexOf('@');
  if (at < 1 || at !== address.lastIndexOf('@') || at === address.length - 1) return Object.freeze({ valid: false, reason: 'addressShape' });
  const local = address.slice(0, at);
  const domain = address.slice(at + 1);
  if (!DOT_ATOM.test(local)) return Object.freeze({ valid: false, reason: 'localSyntax' });
  if (new TextEncoder().encode(local).length > 64) return Object.freeze({ valid: false, reason: 'localLength' });
  if (/[\s\u0000-\u001f\u007f/%:\\?#@\[\]]/u.test(domain)) return Object.freeze({ valid: false, reason: 'domainSyntax' });
  let asciiDomain;
  try { asciiDomain = new URL(`http://${domain}/`).hostname.toLowerCase(); }
  catch { return Object.freeze({ valid: false, reason: 'domainSyntax' }); }
  const labels = asciiDomain.split('.');
  if (labels.length < 2 || asciiDomain.length > 253 || labels.some((label) => !DOMAIN_LABEL.test(label))) return Object.freeze({ valid: false, reason: 'domainSyntax' });
  const normalized = `${local}@${asciiDomain}`;
  if (new TextEncoder().encode(normalized).length > 254) return Object.freeze({ valid: false, reason: 'addressLength' });
  return Object.freeze({ valid: true, address: normalized, localPart: local, asciiDomain });
}
