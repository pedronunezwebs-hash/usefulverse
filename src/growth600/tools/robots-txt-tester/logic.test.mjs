import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRobots, parseRobotsText, ROBOTS_LIMITS } from './logic.mjs';

test('most-specific crawler group overrides wildcard and path rules use longest match', () => {
  const result = evaluateRobots({
    robotsText: 'User-agent: *\nDisallow: /private\nUser-agent: Googlebot\nAllow: /private/public\nDisallow: /private\n',
    userAgent: 'Googlebot-Image', urls: ['https://site.test/private/a', 'https://site.test/private/public/page'],
  });
  assert.equal(result.selectedAgentGroup, 'googlebot');
  assert.deepEqual(result.results.map(({ allowed }) => allowed), [false, true]);
  assert.equal(result.results[1].matchedDirective, 'allow');
});

test('equally specific matching agent groups combine and Allow wins an equal-length tie', () => {
  const result = evaluateRobots({ robotsText: 'User-agent: Bot\nDisallow: /same\nUser-agent: Bot\nAllow: /same\n', userAgent: 'Bot', urls: ['https://site.test/same'] });
  assert.equal(result.results[0].allowed, true);
  assert.equal(result.results[0].matchedDirective, 'allow');
});

test('wildcard and terminal dollar patterns match path plus query without fetching URLs', () => {
  const result = evaluateRobots({ robotsText: 'User-agent: *\nDisallow: /*?draft=*\nDisallow: /exact$\n', userAgent: 'OtherBot', urls: ['https://site.test/a?draft=1', 'https://site.test/exact', 'https://site.test/exact/more'] });
  assert.deepEqual(result.results.map(({ allowed }) => allowed), [false, false, true]);
  assert.equal(result.usedWildcard, true);
});

test('non-anchored patterns are prefixes, while punctuation remains literal and wildcard matching is bounded', () => {
  const result = evaluateRobots({
    robotsText: 'User-agent: *\nDisallow: /file.json\nDisallow: /private/*/export$\n',
    userAgent: 'OtherBot',
    urls: ['https://site.test/file.json.bak', 'https://site.test/fileXjson', 'https://site.test/private/a/export', 'https://site.test/private/a/export/more'],
  });
  assert.deepEqual(result.results.map(({ allowed }) => allowed), [false, true, false, true]);
});

test('no matching rule defaults to allowed and empty Disallow does not block', () => {
  const result = evaluateRobots({ robotsText: 'User-agent: *\nDisallow:\n', userAgent: 'OtherBot', urls: ['https://site.test/public'] });
  assert.equal(result.results[0].allowed, true);
  assert.equal(result.results[0].matchedDirective, 'default');
});

test('parser handles comments, BOM, consecutive agent lines and reports ignored directives', () => {
  const result = parseRobotsText('\uFEFFUser-agent: Bot # crawler\nUser-agent: OtherBot\nCrawl-delay: 2\nAllow: /ok\n');
  assert.equal(result.groups.length, 1);
  assert.deepEqual(result.groups[0].agents, ['bot', 'otherbot']);
  assert.equal(result.ruleCount, 1);
  assert.equal(result.ignoredDirectives, 1);
});

test('inputs, target URLs, agents and complexity are bounded and validated', () => {
  assert.throws(() => evaluateRobots({ robotsText: '', userAgent: 'Bot', urls: ['https://x.test/'] }), /emptyRobots/u);
  assert.throws(() => evaluateRobots({ robotsText: 'User-agent: *', userAgent: 'Bot', urls: [] }), /emptyUrls/u);
  assert.throws(() => evaluateRobots({ robotsText: 'User-agent: *', userAgent: 'Bot', urls: ['javascript:alert(1)'] }), /invalidUrl/u);
  assert.throws(() => evaluateRobots({ robotsText: 'User-agent: *', userAgent: 'Bad Bot', urls: ['https://x.test/'] }), /invalidAgent/u);
  assert.throws(() => evaluateRobots({ robotsText: 'User-agent: *', userAgent: 'Bot', urls: [`https://x.test/${'a'.repeat(ROBOTS_LIMITS.urlLength)}`] }), /invalidUrl/u);
  assert.throws(() => parseRobotsText('x'.repeat(ROBOTS_LIMITS.textBytes + 1)), /tooLarge/u);
  assert.throws(() => parseRobotsText(`${'x\n'.repeat(ROBOTS_LIMITS.lines)}x`), /tooManyLines/u);
  assert.throws(() => parseRobotsText(`User-agent: *\n${'Disallow: /x\n'.repeat(ROBOTS_LIMITS.rules + 1)}`), /tooManyRules/u);
  assert.throws(() => evaluateRobots({ robotsText: `User-agent: *\n${'Disallow: /x\n'.repeat(1_000)}`, userAgent: 'Bot', urls: Array.from({ length: 100 }, (_, index) => `https://x.test/${index}${'a'.repeat(250)}`) }), /tooComplex/u);
});
