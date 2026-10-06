import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEmailHtml, buildHtmlForm, buildPatternSvg, buildSvgDocument, parseFormFields } from './web-authoring-logic.mjs';

test('HTML form builder emits unique semantic labels and controls with explicit required state', () => {
  const result = buildHtmlForm('Email address|email|required\nEmail address|text|optional\nMessage|textarea|required', 'Send request');
  assert.equal(result.error, null);
  assert.match(result.html, /for="email-address"/u);
  assert.match(result.html, /name="email-address-2"/u);
  assert.match(result.html, /<textarea id="message" name="message" required><\/textarea>/u);
  assert.match(result.html, /<button type="submit">Send request<\/button>/u);
});

test('form definitions reject unsupported types, malformed requirements and unsafe list sizes', () => {
  assert.equal(parseFormFields('Name|file|required').error, 'line');
  assert.equal(parseFormFields('Name|text|maybe').error, 'line');
  assert.equal(parseFormFields('Name|text|required|unexpected').error, 'line');
  assert.equal(parseFormFields('').error, 'count');
  assert.equal(parseFormFields(Array.from({ length: 61 }, () => 'Field|text').join('\n')).error, 'count');
  assert.match(buildHtmlForm('<img src=x onerror=alert(1)>|text|required').html, /&lt;img src=x onerror=alert\(1\)&gt;/u);
});

test('email template escapes content, restricts links to credential-free HTTPS, and validates theme color', () => {
  const result = buildEmailHtml({ brand: '<Acme>', heading: 'Hello', body: '<script>no</script>', buttonLabel: 'Open', url: 'https://example.com/a?x=1&y=2', accent: '#123abc', language: 'fr' });
  assert.equal(result.error, null);
  assert.match(result.html, /<html lang="fr">/u);
  assert.match(result.html, /&lt;script&gt;no&lt;\/script&gt;/u);
  assert.match(result.html, /https:\/\/example\.com\/a\?x=1&amp;y=2/u);
  assert.doesNotMatch(result.html, /<script>/u);
  for (const url of ['javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com']) assert.equal(buildEmailHtml({ url }).error, 'url');
  assert.equal(buildEmailHtml({ accent: 'red' }).error, 'color');
});

test('SVG editor serializes bounded vector objects and escapes user text', () => {
  const svg = buildSvgDocument({ width: 400, height: 300, items: [{ type: 'circle', x: 20, y: 40, size: 50, fill: '#ff0000' }, { type: 'text', x: 80, y: 60, size: 24, fill: '#000000', text: '<title>' }] });
  assert.match(svg, /<circle cx="45" cy="65" r="25"/u);
  assert.match(svg, /&lt;title&gt;/u);
  assert.equal(buildSvgDocument({ items: [{ type: 'image', fill: '#000000' }] }), '');
  assert.equal(buildSvgDocument({ items: Array.from({ length: 81 }, () => ({ type: 'rect', fill: '#000000' })) }), '');
});

test('seamless pattern generator supports the advertised motifs with bounded SVG output', () => {
  for (const motif of ['dots', 'grid', 'diagonal', 'cross']) assert.match(buildPatternSvg({ motif }), /<pattern id="tile"/u);
  assert.equal(buildPatternSvg({ motif: 'photo' }), '');
  assert.equal(buildPatternSvg({ foreground: 'url(javascript:alert(1))' }), '');
});
