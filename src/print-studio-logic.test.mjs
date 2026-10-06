import assert from 'node:assert/strict';
import test from 'node:test';
import { makePrintDesign, printDesignHasContent } from './print-studio-logic.mjs';

test('label sheet is bounded to 30 entries, selects paper size, and escapes hostile text', () => {
  const labels = Array.from({ length: 35 }, (_, index) => index === 0 ? '<script>alert(1)</script>' : `Label ${index}`).join('\n');
  const svg = makePrintDesign('printable-label-maker', { items: labels }, { paper: 'letter' });
  assert.match(svg, /width="816" height="1056"/u);
  assert.equal((svg.match(/<rect x="[\d.]+" y="[\d.]+" width="264"/gu) ?? []).length, 30);
  assert.match(svg, /&lt;script&gt;/u);
  assert.doesNotMatch(svg, /<script>/u);
  assert.equal(printDesignHasContent('printable-label-maker', { items: '  \n Address' }), true);
});

test('poster, certificate and invitation create local vector pages with distinct fields', () => {
  const poster = makePrintDesign('poster-maker', { title: 'Open day', subtitle: 'Saturday', message: 'Free entry' }, { theme: 'green' });
  const certificate = makePrintDesign('certificate-maker', { recipient: 'Lee', award: 'Great work', issuer: 'Class' });
  const invitation = makePrintDesign('invitation-maker', { event: 'Birthday', date: 'June 2', time: '3 pm', place: 'Hall', rsvp: 'Text me' });
  assert.match(poster, /Open day/u); assert.match(poster, /#ecfdf3/u); assert.match(poster, /Saturday/u);
  assert.match(certificate, /Lee/u); assert.match(certificate, /Great work/u); assert.match(certificate, /Class/u);
  assert.match(invitation, /Birthday/u); assert.match(invitation, /June 2/u); assert.match(invitation, /Hall/u); assert.match(invitation, /Text me/u);
  assert.equal(printDesignHasContent('poster-maker', { title: 'Open day' }), true);
  assert.equal(printDesignHasContent('poster-maker', { title: '   ' }), false);
  assert.throws(() => makePrintDesign('unknown'), /Unsupported/u);
});

test('paper and color settings alone do not count as printable content', () => {
  for (const kind of ['poster-maker', 'certificate-maker', 'invitation-maker']) {
    assert.equal(printDesignHasContent(kind, { paper: 'a4', theme: 'blue' }), false, kind);
  }
});
