import test from 'node:test';
import assert from 'node:assert/strict';
import { interactionControlLocales } from './interaction-controls.mjs';

test('all 36 published locales provide localized flashcard and diagram editor controls', () => {
  assert.equal(Object.keys(interactionControlLocales).length, 36);
  for (const [language, messages] of Object.entries(interactionControlLocales)) {
    assert.ok(messages.Close?.trim(), `${language} has a close label`);
    assert.ok(messages['Noise is playing in your browser.']?.trim(), `${language} has a noise playback status`);
    assert.ok(messages['Noise stopped.']?.trim(), `${language} has a noise stopped status`);
    assert.ok(messages['Auto-stop (minutes; 0 = off)']?.trim(), `${language} has a localized noise timer label`);
    if (language !== 'en') assert.notEqual(messages['Auto-stop (minutes; 0 = off)'], 'Auto-stop (minutes; 0 = off)', `${language} translates the noise timer label`);
    assert.ok(messages['Save deck on this device']?.trim(), `${language} has a translated flashcard save label`);
    assert.ok(messages['Load saved deck']?.trim(), `${language} has a translated flashcard load label`);
    assert.ok(messages['Delete saved deck']?.trim(), `${language} has a translated flashcard delete label`);
    for (const key of ['Diagram steps', 'Add step', 'Move up', 'Move down', 'Remove step', 'Create diagram', 'Download diagram as SVG', 'New step', 'Use 2–12 steps, max 48 characters each.']) {
      assert.ok(messages[key]?.trim(), `${language} has a translated ${key} label`);
      if (language !== 'en') assert.notEqual(messages[key], key, `${language} translates ${key}`);
    }
    if (language !== 'en') {
      assert.notEqual(messages['Save deck on this device'], 'Save deck on this device', `${language} flashcard save label is translated`);
      assert.notEqual(messages['Load saved deck'], 'Load saved deck', `${language} flashcard load label is translated`);
      assert.notEqual(messages['Delete saved deck'], 'Delete saved deck', `${language} flashcard delete label is translated`);
    }
    const formatError = messages['Each line needs a term, comma, and definition.'];
    assert.ok(formatError?.trim(), `${language} has flashcard format feedback`);
    if (language !== 'en') assert.notEqual(formatError, 'Each line needs a term, comma, and definition.', `${language} is translated`);
  }
});
