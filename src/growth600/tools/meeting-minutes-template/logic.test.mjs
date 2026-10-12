import assert from 'node:assert/strict';
import test from 'node:test';
import { createMeetingMinutes, renderMeetingMinutesMarkdown } from './logic.mjs';

const sample = { title: 'Weekly planning', date: '2026-10-13', facilitator: 'Alex', attendees: 'Alex\nSam', agenda: 'Release status\nOpen questions', decisions: 'Ship after review', actions: 'Review translations | Sam | 2026-10-16' };

test('creates structured minutes and includes action owner and due date in Markdown export', () => {
  const minutes = createMeetingMinutes(sample);
  assert.equal(minutes.actions[0].owner, 'Sam');
  const markdown = renderMeetingMinutesMarkdown(minutes);
  assert.match(markdown, /Review translations — Owner: Sam — Due: 2026-10-16/u);
  assert.match(markdown, /## Decisions\n- Ship after review/u);
});

test('supports optional metadata and empty content sections', () => {
  const minutes = createMeetingMinutes({ title: 'Quick sync' });
  assert.equal(minutes.actions.length, 0);
  assert.match(renderMeetingMinutesMarkdown(minutes), /## Action items\n- —/u);
});

test('rejects missing action owner/date, invalid dates, duplicate attendees and oversized sections', () => {
  assert.throws(() => createMeetingMinutes({ ...sample, actions: 'Do task | | 2026-10-16' }), /task \| owner \| due date/u);
  assert.throws(() => createMeetingMinutes({ ...sample, actions: 'Do task | Sam | 2026-02-30' }), /calendar date/u);
  assert.throws(() => createMeetingMinutes({ ...sample, attendees: 'Sam\nsam' }), /unique/u);
  assert.throws(() => createMeetingMinutes({ ...sample, title: '' }), /meeting title/u);
});

test('does not mutate input when formatting and caps untrusted user content', () => {
  const source = structuredClone(sample);
  const minutes = createMeetingMinutes(source);
  renderMeetingMinutesMarkdown(minutes);
  assert.deepEqual(source, sample);
  assert.throws(() => createMeetingMinutes({ ...sample, agenda: Array(41).fill('Topic').join('\n') }), /limits/u);
});
