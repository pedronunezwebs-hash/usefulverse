import test from 'node:test';
import assert from 'node:assert/strict';
import { addEconomicEvent, createEconomicEvent, exportEconomicCalendar } from './logic.mjs';

const event = (title, dateTime = '2027-01-15T09:30') => ({ title, dateTime, region: 'Global', category: 'inflation', sourceUrl: 'https://example.gov/releases' });

test('economic calendar validates official HTTPS links, sorts local events and exports escaped ICS', () => {
  const first = createEconomicEvent(event('CPI, first; “estimate”'));
  const second = createEconomicEvent(event('Employment', '2027-01-16T09:30'));
  const events = addEconomicEvent([second], event('CPI, first; “estimate”'));
  assert.equal(events[0].title, first.title);
  const ics = exportEconomicCalendar(events, new Date('2027-01-01T00:00:00Z'));
  assert.match(ics, /SUMMARY:CPI\\, first\\; “estimate”/u);
  assert.match(ics, /DTSTART:20270115T093000/u);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});

test('economic calendar rejects invalid dates, categories and insecure official-source URLs', () => {
  assert.throws(() => createEconomicEvent(event('Bad date', '2027-02-30T12:00')));
  assert.throws(() => createEconomicEvent({ ...event('No source'), sourceUrl: 'http://example.gov' }));
  assert.throws(() => createEconomicEvent({ ...event('Bad category'), category: 'fake' }));
  assert.throws(() => createEconomicEvent({ ...event('Credentials'), sourceUrl: 'https://user:pass@example.gov' }));
});
