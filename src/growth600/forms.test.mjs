import assert from 'node:assert/strict';
import test from 'node:test';
import { growthPilotTools } from './catalog.mjs';
import { renderGrowthForm } from './forms.mjs';

const actions = {
  calculate: 'Calculate', generate: 'Generate', reset: 'Reset', example: 'Load example', newGame: 'New game', rules: 'Rules', reveal: 'Reveal', next: 'Next', copy: 'Copy', download: 'Download', result: 'Result', rectangle: 'Rectangle', circle: 'Circle', triangle: 'Triangle', computer: 'Play computer', twoPlayers: 'Two players', privacyNote: 'Assignments are visible on this device.',
};
const copies = {
  'gravel-calculator': { name: 'Gravel calculator', actions, fields: Object.fromEntries(['shape', 'area', 'depth', 'length', 'width', 'diameter', 'base', 'density', 'waste', 'bagSize'].map((key) => [key, key])) },
  'molar-mass-calculator': { name: 'Molar mass calculator', actions, fields: { formula: 'Formula', supportedHint: 'Common elements and selected isotopes are supported.' } },
  'auto-loan-refinance-calculator': { name: 'Auto refinance calculator', actions, fields: { balance: 'Payoff balance', currentApr: 'Current APR', currentMonths: 'Months remaining', newApr: 'New APR', newMonths: 'New term', fees: 'Fees', feeTreatment: 'Fee treatment', upfront: 'Pay upfront', rolledIn: 'Add to balance' } },
  'secret-santa-generator': { name: 'Secret Santa generator', actions, fields: { names: 'Participants', exclusions: 'Exclusions', exclusionsHint: 'One giver:recipient per line.' } },
  mancala: { name: 'Mancala', actions, fields: { mode: 'Game mode', board: 'Kalah board', rules: 'Choose a pit. Seeds are sown counter-clockwise; the other player store is skipped.' } },
};

test('all pilot forms render semantic labels, explicit actions and localized strings', () => {
  for (const tool of growthPilotTools) {
    const html = renderGrowthForm(tool.id, copies[tool.id]);
    assert.ok(html.length > 100, `${tool.id} form should render`);
    assert.match(html, /aria-live="polite"/u, `${tool.id} should announce state/results`);
    assert.doesNotMatch(html, /\son[a-z]+=/iu, `${tool.id} must not use inline event handlers`);
    assert.doesNotMatch(html, /undefined|null/u, `${tool.id} must not emit missing values`);
  }
  assert.match(renderGrowthForm('gravel-calculator', copies['gravel-calculator']), /for="area"/u);
  assert.match(renderGrowthForm('molar-mass-calculator', copies['molar-mass-calculator']), /maxlength="160"/u);
  assert.match(renderGrowthForm('secret-santa-generator', copies['secret-santa-generator']), /data-reveal-name/u);
  assert.match(renderGrowthForm('mancala', copies.mancala), /data-board/u);
});

test('pilot form renderer blocks missing translated fields or actions instead of silently falling back', () => {
  assert.throws(() => renderGrowthForm('molar-mass-calculator', { actions, fields: {} }), /localized form fields/);
  assert.throws(() => renderGrowthForm('mancala', { name: 'Mancala', fields: copies.mancala.fields, actions: {} }), /localized form actions/);
  assert.throws(() => renderGrowthForm('unknown', { actions, fields: {} }), /localized form fields/);
});
