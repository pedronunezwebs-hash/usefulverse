import test from 'node:test';
import assert from 'node:assert/strict';
import { amerikanerCardGameEnglish as copy } from './amerikaner-card-game-copy-en.mjs';

test('Amerikaner copy teaches and scopes the Norwegian card-game variant', () => {
  assert.match(copy.name, /card game/iu);
  assert.match(copy.intro, /Norwegian Amerikaner trick-taking game/iu);
  assert.match(copy.details, /Norwegian Amerikaner rules/iu);
  assert.match(copy.details, /three to six players/iu);
  assert.match(copy.details, /at least half your hand rounded up/iu);
  assert.match(copy.details, /request an in-play card/iu);
  assert.match(copy.limits, /one Norwegian rule set/iu);
  assert.match(copy.limits, /simple heuristics/iu);
  assert.match(copy.privacy, /nothing is uploaded/iu);
  assert.match(copy.fields.bidHelp, /half your hand rounded up/iu);
});
