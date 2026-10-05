import test from 'node:test';
import assert from 'node:assert/strict';
import { locales, localizedTool } from './locales.mjs';
import { opportunityToolMarkup } from './opportunity-template.mjs';
import { opportunityTools } from './opportunity-tools.mjs';
import { timeTrackerContent } from './locales/time-tracker-content.mjs';

test('time tracker has complete localized controls and SEO copy in every active locale', () => {
  const tool = opportunityTools.find(({ id }) => id === 'time-tracker');
  assert.ok(tool);
  assert.equal(Object.keys(locales).length, 36);
  for (const language of Object.keys(locales)) {
    const content = timeTrackerContent(language);
    const localized = localizedTool(tool, language);
    const markup = opportunityToolMarkup('time-tracker', language, content.ui, localized.title);
    assert.equal(Object.keys(content.ui).length, 40, `${language}: every runtime and form label is translated`);
    assert.ok(content.copy.every((item) => item.trim()), `${language}: SEO copy is present`);
    assert.equal(localized.title, content.copy[0], `${language}: tool title is localized`);
    for (const control of ['data-time-form', 'data-time-clock', 'data-time-pause', 'data-time-resume', 'data-time-stop', 'data-time-save', 'data-time-load', 'data-time-delete', 'data-time-csv', 'data-time-clear']) {
      assert.ok(markup.includes(control), `${language}: ${control} exists`);
    }
    assert.match(markup, /data-time-messages=/u, `${language}: runtime receives localized messages`);
  }
});
