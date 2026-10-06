import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunityToolMarkup } from './opportunity-template.mjs';
import { habitTrackerEnglishCopy, habitTrackerUiKeys } from './locales/habit-tracker-source.mjs';
import { habitTrackerLocaleData } from './locales/habit-tracker.mjs';
import { habitTrackerContent } from './locales/habit-tracker-content.mjs';
import { locales, localizedTool } from './locales.mjs';
import { opportunityLocaleData } from './locales/opportunity-tools.mjs';
import { opportunityTools } from './opportunity-tools.mjs';

test('habit tracker has complete static UI and SEO copy for all 36 published languages', () => {
  const languages = Object.keys(locales);
  assert.equal(languages.length, 36);
  assert.equal(Object.keys(habitTrackerLocaleData).length, languages.length - 1);
  for (const language of languages) {
    const content = habitTrackerContent(language);
    assert.equal(Object.keys(content.ui).length, habitTrackerUiKeys.length, `${language} UI key count`);
    assert.ok(content.ui['Add habit'], `${language} add label`);
    assert.equal(content.copy.length, habitTrackerEnglishCopy.length, `${language} SEO copy fields`);
    assert.ok(content.copy.every((value) => typeof value === 'string' && value.trim()), `${language} nonempty copy`);
    assert.doesNotMatch(JSON.stringify(content), /ZUVHAB\d{4}X|ZuVHAB\d{4}X|HABITMARKER/iu, `${language} contains no translation sentinel`);
  }
});

test('RTL and non-Latin locales keep their script and functional labels', () => {
  const examples = {
    ar: /\p{Script=Arabic}/u,
    bn: /\p{Script=Bengali}/u,
    hi: /\p{Script=Devanagari}/u,
    ja: /\p{Script=Han}/u,
    ru: /\p{Script=Cyrillic}/u,
    zh: /\p{Script=Han}/u,
    zh_tw: /\p{Script=Han}/u,
  };
  for (const [language, script] of Object.entries(examples)) {
    const { ui, copy } = habitTrackerContent(language);
    assert.match(ui['Add habit'], script, `${language} action label`);
    assert.match(copy[0], script, `${language} page title`);
  }
  assert.match(habitTrackerContent('it').ui['Current streak'], /Serie/u);
  assert.match(habitTrackerContent('uk').ui['Current streak'], /серія/u);
});

test('habit tracker markup exposes translated local-only workflow in every language', () => {
  const tool = opportunityTools.find(({ id }) => id === 'habit-tracker');
  assert.ok(tool);
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup(tool.id, language, opportunityLocaleData[language]?.ui ?? {}, localizedTool(tool, language).title);
    for (const control of ['data-habit-form', 'data-habit-name', 'data-habit-save', 'data-habit-load', 'data-habit-download', 'data-habit-import', 'data-habit-clear', 'data-habit-list', 'aria-live="polite"', 'data-habit-messages=']) {
      assert.ok(markup.includes(control), `${language} exposes ${control}`);
    }
    const privacyHint = habitTrackerContent(language).ui['Your habits stay in this browser. Nothing is uploaded.'].replaceAll("'", '&#039;');
    assert.ok(markup.includes(privacyHint), `${language} states local-only processing`);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest|https?:\/\//iu, `${language} tool markup does not call a service`);
  }
});
