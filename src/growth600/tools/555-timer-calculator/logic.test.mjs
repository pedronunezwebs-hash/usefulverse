import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate555Astable, calculate555Monostable } from './logic.mjs';
import copies from '../../locales/555-timer-calculator.mjs';
import { timer555EnglishCopy } from '../../locales/555-timer-calculator.en.mjs';
import { localeEntries } from '../../../locales.mjs';

test('astable timing matches the standard 10 kΩ, 10 kΩ, 10 μF example', () => {
  const result = calculate555Astable({ rAOhms: 10_000, rBOhms: 10_000, capacitanceFarads: 10e-6 });
  assert.ok(Math.abs(result.highSeconds - 0.1386) < 1e-10);
  assert.ok(Math.abs(result.lowSeconds - 0.0693) < 1e-10);
  assert.ok(Math.abs(result.periodSeconds - 0.2079) < 1e-10);
  assert.ok(Math.abs(result.frequencyHz - 1 / 0.2079) < 1e-8);
  assert.ok(Math.abs(result.waveformDutyPercent - 200 / 3) < 1e-10);
  assert.ok(Math.abs(result.dischargeDutyPercent + result.waveformDutyPercent - 100) < 1e-10);
});

test('monostable pulse width uses 1.1 RC', () => {
  assert.ok(Math.abs(calculate555Monostable({ resistanceOhms: 100_000, capacitanceFarads: 10e-6 }).pulseSeconds - 1.1) < 1e-12);
});

test('positive component changes increase their relevant timing', () => {
  const base = calculate555Astable({ rAOhms: 10_000, rBOhms: 10_000, capacitanceFarads: 10e-6 });
  assert.ok(calculate555Astable({ rAOhms: 20_000, rBOhms: 10_000, capacitanceFarads: 10e-6 }).highSeconds > base.highSeconds);
  assert.ok(calculate555Astable({ rAOhms: 10_000, rBOhms: 10_000, capacitanceFarads: 20e-6 }).periodSeconds > base.periodSeconds);
  assert.ok(calculate555Monostable({ resistanceOhms: 200_000, capacitanceFarads: 10e-6 }).pulseSeconds > 1.1);
});

test('invalid and overflowing components are rejected', () => {
  for (const value of [0, -1, Infinity, NaN, 1e13]) assert.throws(() => calculate555Astable({ rAOhms: value, rBOhms: 10_000, capacitanceFarads: 1e-6 }));
  assert.throws(() => calculate555Astable({ rAOhms: 10_000, rBOhms: 10_000, capacitanceFarads: 1e20 }));
  assert.throws(() => calculate555Monostable({ resistanceOhms: 0, capacitanceFarads: 1e-6 }));
});

test('all localized copies preserve metadata limits and the same 555 equations', () => {
  assert.deepEqual(Object.keys(copies).sort(), localeEntries.map(({ key }) => key).sort());
  for (const [locale, copy] of Object.entries(copies)) {
    assert.equal(copy.copyLanguage, locale);
    assert.ok(copy.title.length <= 60, `${locale} title exceeds 60 characters`);
    assert.ok(copy.description.length <= 160, `${locale} description exceeds 160 characters`);
    assert.ok(!/[\r\n]/u.test(copy.title + copy.description), `${locale} metadata contains line breaks`);
    assert.ok(copy.fields.frequencyNote && copy.fields.highFrequencyWarning, `${locale} is missing the high-frequency caution`);
    for (const equation of ['tHIGH = 0.693 × (RA + RB) × C', 'tLOW = 0.693 × RB × C', 'T = tHIGH + tLOW', 'f = 1/T', 'tPULSE ≈ 1.1 × R × C']) {
      assert.ok(copy.fields.formulaNote.includes(equation), `${locale} is missing ${equation}`);
    }
    assert.ok(copy.fields.formulaNote.includes(copy.fields.resultWaveformDuty), `${locale} duty label is not localized`);
  }
  assert.equal(copies.en.fields.formulaNote, timer555EnglishCopy.fields.formulaNote);
});
