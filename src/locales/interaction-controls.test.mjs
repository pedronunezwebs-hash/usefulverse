import test from 'node:test';
import assert from 'node:assert/strict';
import { interactionControlLocales } from './interaction-controls.mjs';

test('all 36 published locales provide localized flashcard format feedback and dismissal labels', () => {
  assert.equal(Object.keys(interactionControlLocales).length, 36);
  for (const [language, messages] of Object.entries(interactionControlLocales)) {
    assert.ok(messages.Close?.trim(), `${language} has a close label`);
    assert.ok(messages['Noise is playing in your browser.']?.trim(), `${language} has a noise playback status`);
    assert.ok(messages['Noise stopped.']?.trim(), `${language} has a noise stopped status`);
    const formatError = messages['Each line needs a term, comma, and definition.'];
    assert.ok(formatError?.trim(), `${language} has flashcard format feedback`);
    if (language !== 'en') assert.notEqual(formatError, 'Each line needs a term, comma, and definition.', `${language} is translated`);
  }
});
