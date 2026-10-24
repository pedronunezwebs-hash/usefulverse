const finite = (value, label, min, max) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be from ${min} to ${max}.`);
  return number;
};

const safe = (value, max = 300) => String(value ?? '').trim().slice(0, max);
const escapeXml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function generateLocalVectorImage(input) {
  const prompt = safe(input.prompt, 240);
  if (!prompt) throw new RangeError('Describe the illustration first.');
  const style = ['orbital', 'garden', 'sunset', 'grid'].includes(input.style) ? input.style : 'orbital';
  const colors = {
    warm: ['#f4a261', '#e76f51', '#264653', '#e9c46a'],
    cool: ['#caf0f8', '#48cae4', '#4361ee', '#3a0ca3'],
    forest: ['#d8f3dc', '#95d5b2', '#40916c', '#1b4332'],
    mono: ['#f8f9fa', '#ced4da', '#6c757d', '#212529'],
  };
  const palette = colors[input.palette] ? input.palette : 'warm';
  let seed = 2166136261;
  for (const char of `${prompt}|${style}|${palette}`) seed = Math.imul(seed ^ char.codePointAt(0), 16777619) >>> 0;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const c = colors[palette];
  const shapes = Array.from({ length: 22 }, (_, index) => {
    const x = Math.round(24 + random() * 592); const y = Math.round(24 + random() * 352);
    const size = Math.round(12 + random() * 70); const color = c[index % c.length];
    if (style === 'garden') return `<path d="M${x} ${y + size} Q${x - size} ${y} ${x} ${y - size} Q${x + size} ${y} ${x} ${y + size}Z" fill="${color}" opacity=".82"/>`;
    if (style === 'sunset') return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity=".72"/>`;
    if (style === 'grid') return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${Math.round(size / 5)}" fill="${color}" opacity=".78"/>`;
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="${color}" stroke-width="${Math.round(2 + random() * 6)}" opacity=".8"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${escapeXml(prompt)}"><rect width="640" height="400" fill="${c[0]}"/><g>${shapes}</g><rect x="14" y="14" width="612" height="372" rx="22" fill="none" stroke="${c[3]}" stroke-width="3"/></svg>`;
  return Object.freeze({ svg, style, palette, seed: `${seed.toString(16).padStart(8, '0')}`, note: 'Reproducible geometric vector artwork; prompt words are used as the seed, not interpreted by an AI model.' });
}

export function organizePlantObservation(input) {
  const fields = [
    ['setting', safe(input.setting, 160)], ['arrangement', safe(input.arrangement, 80)],
    ['leaf', safe(input.leaf, 160)], ['flower', safe(input.flower, 160)],
    ['stem', safe(input.stem, 160)], ['season', safe(input.season, 80)],
    ['candidate', safe(input.candidate, 160)], ['photoNote', safe(input.photoNote, 240)],
  ];
  if (fields.every(([, value]) => !value)) throw new RangeError('Add at least one observation.');
  return Object.freeze({ observations: Object.fromEntries(fields), recordedClues: fields.filter(([, value]) => value).length });
}

function readDer(bytes, offset = 0) {
  if (offset >= bytes.length) throw new RangeError('Certificate DER ended unexpectedly.');
  const tag = bytes[offset++]; let length = bytes[offset++];
  if (length & 0x80) { const count = length & 0x7f; if (!count || count > 4 || offset + count > bytes.length) throw new RangeError('Certificate has an invalid DER length.'); length = 0; for (let i = 0; i < count; i++) length = length * 256 + bytes[offset++]; }
  const end = offset + length; if (end > bytes.length) throw new RangeError('Certificate DER field is truncated.');
  return { tag, start: offset, end, next: end, raw: bytes.slice(offset, end) };
}
function children(bytes, field) { const result = []; for (let offset = field.start; offset < field.end;) { const item = readDer(bytes, offset); result.push(item); offset = item.next; } return result; }
function oid(bytes, field) { const a = [...field.raw]; if (!a.length) return ''; const parts = [Math.floor(a[0] / 40), a[0] % 40]; let value = 0; for (const b of a.slice(1)) { value = value * 128 + (b & 127); if (!(b & 128)) { parts.push(value); value = 0; } } return parts.join('.'); }
function derText(bytes, field) { return new TextDecoder().decode(bytes.slice(field.start, field.end)); }
function certDate(text, utc) {
  const match = utc ? /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/u.exec(text) : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/u.exec(text);
  if (!match) throw new RangeError('Certificate uses an unsupported validity date format.');
  let year = Number(match[1]); let index = 2;
  if (utc) { year = year >= 50 ? 1900 + year : 2000 + year; } else index = 2;
  const month = Number(match[index++]); const day = Number(match[index++]); const hour = Number(match[index++]); const minute = Number(match[index++]); const second = Number(match[index] || 0);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) throw new RangeError('Certificate contains an invalid validity time.');
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second) throw new RangeError('Certificate contains an invalid calendar date.');
  return date;
}
function matchesHost(pattern, hostname) {
  const p = pattern.toLowerCase().replace(/\.$/u, ''); const h = hostname.toLowerCase().replace(/\.$/u, '');
  if (!p.includes('*')) return p === h;
  return /^\*\.[a-z0-9.-]+$/u.test(p) && h.split('.').length === p.slice(2).split('.').length + 1 && h.endsWith(`.${p.slice(2)}`);
}

export async function inspectTlsCertificate(input) {
  const pem = safe(input.certificate, 60000); const hostname = safe(input.hostname, 253).toLowerCase().replace(/\.$/u, '');
  if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(hostname)) throw new RangeError('Enter a DNS hostname without a scheme or path.');
  const matches = [...pem.matchAll(/-----BEGIN CERTIFICATE-----([\s\S]+?)-----END CERTIFICATE-----/gu)];
  if (matches.length !== 1) throw new RangeError('Paste one PEM certificate, including its BEGIN and END lines.');
  const match = matches[0];
  const encoded = match[1].replace(/\s/gu, ''); if (encoded.length > 50000 || !/^[A-Za-z0-9+/]+={0,2}$/u.test(encoded)) throw new RangeError('The PEM certificate is malformed or too large.');
  const binary = atob(encoded); const der = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const cert = readDer(der); const root = children(der, cert); if (cert.tag !== 0x30 || root.length < 3) throw new RangeError('The certificate is not a valid X.509 sequence.');
  if (root[0].tag !== 0x30) throw new RangeError('The certificate has an invalid TBSCertificate field.');
  const tbs = children(der, root[0]); const serialIndex = tbs[0]?.tag === 0xa0 ? 1 : 0;
  const validityField = tbs[serialIndex + 3];
  if (validityField?.tag !== 0x30) throw new RangeError('The certificate validity dates could not be read.');
  const validity = children(der, validityField);
  if (validity.length !== 2) throw new RangeError('The certificate validity dates are incomplete.');
  const notBefore = certDate(derText(der, validity[0]), validity[0].tag === 0x17);
  const notAfter = certDate(derText(der, validity[1]), validity[1].tag === 0x17);
  const extensionsField = tbs.find((field) => field.tag === 0xa3); const dnsNames = [];
  if (extensionsField) {
    const sequence = children(der, extensionsField)[0];
    for (const ext of sequence?.tag === 0x30 ? children(der, sequence) : []) {
      const extParts = children(der, ext); if (extParts[0]?.tag === 0x06 && oid(der, extParts[0]) === '2.5.29.17') {
      const octet = extParts.at(-1); if (octet?.tag !== 0x04) continue;
      const sanSequence = readDer(octet.raw, 0);
      for (const name of children(octet.raw, sanSequence)) if (name.tag === 0x82) dnsNames.push(derText(octet.raw, name));
      }
    }
  }
  const now = new Date(); const hostnameMatch = dnsNames.some((name) => matchesHost(name, hostname));
  const fingerprint = [...new Uint8Array(await crypto.subtle.digest('SHA-256', der))].map((byte) => byte.toString(16).padStart(2, '0')).join(':').toUpperCase();
  return Object.freeze({ hostname, hostnameMatch, dnsNames: dnsNames.slice(0, 100), notBefore: notBefore.toISOString(), notAfter: notAfter.toISOString(), expired: now > notAfter, notYetValid: now < notBefore, sha256Fingerprint: fingerprint });
}

export function traumaReflection(input) {
  const prompts = [
    ['rest', input.rest], ['present', input.present], ['avoidance', input.avoidance], ['connection', input.connection],
  ];
  if (prompts.some(([, value]) => !['not-today', 'some', 'a-lot', 'skip'].includes(value))) throw new RangeError('Choose an option for each reflection or choose skip.');
  return Object.freeze({ reflection: Object.fromEntries(prompts.map(([key, value]) => [key, value])) });
}

export function stressReflection(input) {
  const prompts = [['rest', input.rest], ['focus', input.focus], ['tension', input.tension], ['recovery', input.recovery]];
  if (prompts.some(([, value]) => !['not-today', 'some', 'a-lot', 'skip'].includes(value))) throw new RangeError('Choose an option for each reflection or choose skip.');
  return Object.freeze({ reflection: Object.fromEntries(prompts.map(([key, value]) => [key, value])) });
}

export function allocateUserShares(input) {
  const estate = finite(input.estate, 'Estate amount', 0.01, 1e12); const currency = safe(input.currency, 12);
  if (!/^[A-Za-z0-9._-]{1,12}$/u.test(currency)) throw new RangeError('Enter a short currency or unit label.');
  const lines = String(input.shares ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > 30) throw new RangeError('Enter 2 to 30 recipients, one per line as name | percent.');
  const recipients = lines.map((line, index) => {
    const [namePart, sharePart, ...extra] = line.split('|'); const name = safe(namePart, 80); const share = Number(String(sharePart ?? '').replace('%', '').trim());
    if (extra.length || !name || !Number.isFinite(share) || share <= 0 || share > 100) throw new RangeError(`Recipient line ${index + 1} must contain a name and a percentage from 0 to 100.`);
    return { name, share };
  });
  const total = recipients.reduce((sum, person) => sum + person.share, 0);
  if (Math.abs(total - 100) > 0.000001) throw new RangeError(`Entered shares total ${total.toFixed(4)}%; they must total exactly 100%.`);
  const allocations = recipients.map(({ name, share }) => `${name}: ${(estate * share / 100).toFixed(2)} ${currency} (${share}%)`).join('\n');
  return Object.freeze({ allocations, sharesTotal: '100%', estateAmount: `${estate.toFixed(2)} ${currency}` });
}

const notePattern = /^([A-Ga-g])([#b]?)(-?\d+):(whole|half|quarter|eighth|16th)$/u;
const durations = { whole: 16, half: 8, quarter: 4, eighth: 2, '16th': 1 };
export function transcribeScore(input) {
  const bars = String(input.notes ?? '').split('|').map((bar) => bar.trim()).filter(Boolean);
  if (!bars.length || bars.length > 32) throw new RangeError('Enter 1 to 32 measures separated by |.');
  const measures = bars.map((bar, index) => {
    const tokens = bar.split(/[\s,]+/u).filter(Boolean); if (!tokens.length || tokens.length > 32) throw new RangeError(`Measure ${index + 1} must have 1 to 32 notes.`);
    const notes = tokens.map((token) => { const m = notePattern.exec(token); if (!m) throw new RangeError(`Unsupported note “${token}”. Use C4:quarter, F#4:eighth, Bb3:half, or C4:whole.`); const octave = Number(m[3]); if (octave < 0 || octave > 8) throw new RangeError('Octave must be from 0 to 8.'); return { step: m[1].toUpperCase(), alter: m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0, octave, duration: durations[m[4]], type: m[4] }; });
    if (notes.reduce((sum, note) => sum + note.duration, 0) > 16) throw new RangeError(`Measure ${index + 1} exceeds 4/4. Shorten it or split the bar.`);
    return notes;
  });
  const xmlMeasures = measures.map((notes, index) => `<measure number="${index + 1}">${index === 0 ? '<attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>' : ''}${notes.map((note) => `<note><pitch><step>${note.step}</step>${note.alter ? `<alter>${note.alter}</alter>` : ''}<octave>${note.octave}</octave></pitch><duration>${note.duration}</duration><type>${note.type}</type></note>`).join('')}</measure>`).join('');
  const musicXml = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd"><score-partwise version="4.0"><work><work-title>${escapeXml(safe(input.title, 100) || 'Manual transcription')}</work-title></work><part-list><score-part id="P1"><part-name>${escapeXml(safe(input.partName, 40) || 'Part 1')}</part-name></score-part></part-list><part id="P1">${xmlMeasures}</part></score-partwise>`;
  return Object.freeze({ measureCount: String(measures.length), noteCount: String(measures.flat().length), musicXml });
}

export function prepareEquationTranscript(input) {
  const latex = safe(input.latex, 2000); if (!latex) throw new RangeError('Enter a formula in LaTeX.');
  if (!/^[\p{L}\p{N}\s+\-*/=().,^_{}\\\[\]|<>!%&:;]+$/u.test(latex)) throw new RangeError('Use only equation symbols and letters; HTML and arbitrary markup are not accepted.');
  const reference = safe(input.reference, 200);
  return Object.freeze({ latex, reference });
}

export async function summarizeBirdClip(input) {
  const file = input.audioFile;
  if (!(file instanceof Blob) || file.size < 1 || file.size > 15 * 1024 * 1024) throw new RangeError('Choose an audio clip smaller than 15 MiB.');
  const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Audio decoding is unavailable in this browser.');
  const metadataUrl = URL.createObjectURL(file); const metadataAudio = new Audio(); metadataAudio.preload = 'metadata'; metadataAudio.src = metadataUrl;
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Audio metadata timed out.')), 8000);
      metadataAudio.addEventListener('loadedmetadata', () => { clearTimeout(timeout); resolve(); }, { once: true });
      metadataAudio.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Audio metadata could not be read.')); }, { once: true });
    });
    if (!Number.isFinite(metadataAudio.duration) || metadataAudio.duration <= 0 || metadataAudio.duration > 30) throw new RangeError('Choose an audio clip up to 30 seconds.');
  } finally { metadataAudio.removeAttribute('src'); metadataAudio.load(); URL.revokeObjectURL(metadataUrl); }
  const context = new AudioContextClass(); let buffer;
  try { buffer = await context.decodeAudioData(await file.arrayBuffer()); } finally { await context.close(); }
  if (buffer.duration > 30 || buffer.numberOfChannels > 2 || buffer.sampleRate > 96000) throw new RangeError('Use an audio clip up to 30 seconds, two channels, and 96 kHz.');
  let squares = 0; let peak = 0; let crossings = 0; let count = 0; let prior = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel); prior = 0;
    for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / 300000))) { const value = data[i]; squares += value * value; peak = Math.max(peak, Math.abs(value)); if (i && ((value < 0) !== (prior < 0))) crossings++; prior = value; count++; }
  }
  return Object.freeze({ fileName: safe(file.name, 120), durationSeconds: buffer.duration.toFixed(2), sampleRateHz: String(buffer.sampleRate), channels: String(buffer.numberOfChannels), peakLevel: peak.toFixed(4), rmsLevel: Math.sqrt(squares / Math.max(1, count)).toFixed(4), zeroCrossings: String(crossings) });
}
