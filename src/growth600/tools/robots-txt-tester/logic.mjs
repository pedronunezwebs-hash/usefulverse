export const ROBOTS_LIMITS = Object.freeze({ textBytes: 200_000, lines: 5_000, rules: 2_000, urls: 100, agentLength: 80, urlLength: 4_096, ruleLength: 2_048, matchWork: 25_000_000 });

function fail(code) { throw new Error(code); }

export function parseRobotsText(text) {
  if (typeof text !== 'string' || !text.trim()) fail('emptyRobots');
  if (new TextEncoder().encode(text).byteLength > ROBOTS_LIMITS.textBytes) fail('tooLarge');
  const lines = text.replace(/^\uFEFF/u, '').split(/\r?\n/u);
  if (lines.length > ROBOTS_LIMITS.lines) fail('tooManyLines');
  const groups = []; let group = null; let ruleCount = 0; let ignoredDirectives = 0; let malformedLines = 0;
  for (const original of lines) {
    const line = original.split('#', 1)[0].trim();
    if (!line) continue;
    const colon = line.indexOf(':');
    if (colon < 1) { malformedLines += 1; continue; }
    const name = line.slice(0, colon).trim().toLowerCase(); const value = line.slice(colon + 1).trim();
    if (name === 'user-agent') {
      if (!value || value.length > ROBOTS_LIMITS.agentLength || /[\s:#]/u.test(value)) { malformedLines += 1; continue; }
      if (!group || group.hasRecords) { group = { agents: [], rules: [], hasRecords: false }; groups.push(group); }
      group.agents.push(value.toLowerCase());
      continue;
    }
    if (!group) { ignoredDirectives += 1; continue; }
    group.hasRecords = true;
    if (name === 'allow' || name === 'disallow') {
      if (!value) continue;
      if (!value.startsWith('/') || value.length > ROBOTS_LIMITS.ruleLength) { malformedLines += 1; continue; }
      ruleCount += 1;
      if (ruleCount > ROBOTS_LIMITS.rules) fail('tooManyRules');
      group.rules.push({ directive: name, path: value, line: original.trim(), specificity: new TextEncoder().encode(value.replace(/\*|\$$/gu, '')).length });
    } else {
      ignoredDirectives += 1;
    }
  }
  return { groups: groups.map(({ agents, rules }) => ({ agents, rules })), ruleCount, ignoredDirectives, malformedLines };
}

function matchesRobotsPattern(pattern, target) {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  let patternIndex = 0; let targetIndex = 0; let lastWildcard = -1; let wildcardTargetStart = -1;
  while (targetIndex < target.length) {
    if (!anchored && patternIndex === body.length) return true;
    const character = body[patternIndex];
    if (character === target[targetIndex]) { patternIndex += 1; targetIndex += 1; continue; }
    if (character === '*') { lastWildcard = patternIndex; wildcardTargetStart = targetIndex; patternIndex += 1; continue; }
    if (lastWildcard !== -1) { patternIndex = lastWildcard + 1; wildcardTargetStart += 1; targetIndex = wildcardTargetStart; continue; }
    return false;
  }
  while (body[patternIndex] === '*') patternIndex += 1;
  return patternIndex === body.length;
}

function selectGroups(groups, userAgent) {
  const token = userAgent.trim().toLowerCase();
  if (!token || token.length > ROBOTS_LIMITS.agentLength || /[\s:#]/u.test(token)) fail('invalidAgent');
  const candidates = groups.flatMap((group) => group.agents.filter((agent) => agent !== '*' && token.startsWith(agent)).map((agent) => ({ group, agent })));
  if (candidates.length) {
    const longest = Math.max(...candidates.map(({ agent }) => agent.length));
    return { groups: candidates.filter(({ agent }) => agent.length === longest).map(({ group }) => group), selected: candidates.find(({ agent }) => agent.length === longest).agent, wildcard: false };
  }
  const wildcard = groups.filter((group) => group.agents.includes('*'));
  return { groups: wildcard, selected: wildcard.length ? '*' : '', wildcard: wildcard.length > 0 };
}

function normalizeUrl(value) {
  if (typeof value !== 'string' || value.length > ROBOTS_LIMITS.urlLength) fail('invalidUrl');
  let url;
  try { url = new URL(value); } catch { fail('invalidUrl'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) fail('invalidUrl');
  return `${url.pathname}${url.search}` || '/';
}

export function evaluateRobots({ robotsText, userAgent, urls }) {
  if (!Array.isArray(urls) || !urls.some((item) => String(item).trim())) fail('emptyUrls');
  const targets = urls.map((item) => String(item).trim()).filter(Boolean);
  if (targets.length > ROBOTS_LIMITS.urls) fail('tooManyUrls');
  const parsed = parseRobotsText(robotsText);
  const selected = selectGroups(parsed.groups, String(userAgent ?? ''));
  const rules = selected.groups.flatMap((group) => group.rules);
  const targetPaths = targets.map((rawUrl) => ({ rawUrl, path: normalizeUrl(rawUrl) }));
  const estimatedWork = rules.reduce((sum, rule) => sum + rule.path.length, 0) * targetPaths.reduce((sum, item) => sum + item.path.length, 0);
  if (estimatedWork > ROBOTS_LIMITS.matchWork) fail('tooComplex');
  const results = targetPaths.map(({ rawUrl, path }) => {
    const matches = rules.filter((rule) => matchesRobotsPattern(rule.path, path));
    const highest = matches.reduce((max, rule) => Math.max(max, rule.specificity), -1);
    const strongest = matches.filter((rule) => rule.specificity === highest);
    // Widely implemented crawler behavior: the most specific path wins; an
    // Allow rule wins an equal-length tie. This is a preview, not a universal bot emulator.
    const winner = strongest.find((rule) => rule.directive === 'allow') ?? strongest[0] ?? null;
    return { url: rawUrl, path, allowed: winner?.directive !== 'disallow', matchedRule: winner?.line ?? '', matchedDirective: winner?.directive ?? 'default', matchingRules: matches.length };
  });
  return { userAgent: String(userAgent).trim(), selectedAgentGroup: selected.selected, usedWildcard: selected.wildcard, results, ruleCount: parsed.ruleCount, ignoredDirectives: parsed.ignoredDirectives, malformedLines: parsed.malformedLines };
}
