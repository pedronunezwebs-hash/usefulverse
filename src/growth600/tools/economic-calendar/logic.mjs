const MAX_EVENTS = 200;
const CATEGORIES = new Set(['inflation','employment','growth','interest-rates','trade','other']);
const cleanText = (value, max) => String(value ?? '').trim().replace(/[\u0000-\u001f\u007f]/gu, '').slice(0, max);
export function createEconomicEvent(input, id = globalThis.crypto?.randomUUID?.() ?? `event-${Date.now()}-${Math.random().toString(36).slice(2)}`) {
  const title = cleanText(input.title, 120), dateTime = String(input.dateTime ?? ''), region = cleanText(input.region, 80), category = String(input.category ?? 'other'), sourceUrl = String(input.sourceUrl ?? '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/u.exec(dateTime);
  const parts = match?.slice(1).map(Number);
  const validLocalDate = parts && parts[1] >= 1 && parts[1] <= 12 && parts[2] >= 1 && parts[2] <= 31 && parts[3] <= 23 && parts[4] <= 59 && (() => { const date = new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4]); return date.getFullYear() === parts[0] && date.getMonth() === parts[1]-1 && date.getDate() === parts[2] && date.getHours() === parts[3] && date.getMinutes() === parts[4]; })();
  if (!title || !region || !validLocalDate || !CATEGORIES.has(category)) throw new RangeError('Check the title, local date and time, region and category.');
  let url;
  try { url = new URL(sourceUrl); } catch { throw new RangeError('Add the official source URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new RangeError('The source must use a public HTTPS URL.');
  return Object.freeze({ id, title, dateTime, region, category, sourceUrl: url.href });
}
export function addEconomicEvent(events, input) {
  if (!Array.isArray(events) || events.length >= MAX_EVENTS) throw new RangeError('A calendar can contain up to 200 events.');
  const event = createEconomicEvent(input);
  return [...events, event].sort((a,b) => a.dateTime.localeCompare(b.dateTime));
}
const icsEscape = (text) => String(text).replace(/\\/gu,'\\\\').replace(/\r?\n/gu,'\\n').replace(/,/gu,'\\,').replace(/;/gu,'\\;');
function foldLine(line) {
  const chunks=[];let chunk='',bytes=0;
  for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>73){chunks.push(chunk);chunk=' ';bytes=1;}chunk+=char;bytes+=size;}
  chunks.push(chunk);return chunks.join('\r\n');
}
export function exportEconomicCalendar(events, now = new Date()) {
  if (!Array.isArray(events) || events.length > MAX_EVENTS) throw new RangeError('Invalid calendar.');
  const stamp = now.toISOString().replace(/[-:]/gu,'').replace(/\.\d{3}/u,'');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UsefulVerse//Economic Release Calendar//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  for(const event of [...events].sort((a,b)=>a.dateTime.localeCompare(b.dateTime))){
    const safe=createEconomicEvent(event,event.id);const local=safe.dateTime.replace(/[-:]/gu,'')+'00';
    lines.push('BEGIN:VEVENT',`UID:${icsEscape(safe.id)}@usefulverse.com`,`DTSTAMP:${stamp}`,`DTSTART:${local}`,`SUMMARY:${icsEscape(safe.title)}`,`LOCATION:${icsEscape(safe.region)}`,`CATEGORIES:${icsEscape(safe.category)}`,`DESCRIPTION:${icsEscape(`Official source: ${safe.sourceUrl}`)}`,'URL:'+safe.sourceUrl,'END:VEVENT');
  }
  lines.push('END:VCALENDAR');return lines.map(foldLine).join('\r\n')+'\r\n';
}
