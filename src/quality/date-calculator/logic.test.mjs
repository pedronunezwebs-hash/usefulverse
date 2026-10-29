import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { betweenCivil, shiftCivil, parseCivil, isoCivil, stateFromURL, stateToURL, longDate } from './logic.mjs';

// Independent references: Python datetime.date subtraction (Gregorian calendar),
// https://docs.python.org/3/library/datetime.html#date-objects ; checked 29-Oct.
const references = [
  ['2026-01-01','2026-01-31',30], ['2026-01-31','2026-01-01',30],
  ['2024-02-28','2024-03-01',2], ['2025-02-28','2025-03-01',1],
  ['1900-02-28','1900-03-01',1], ['2000-02-28','2000-03-01',2],
  ['1999-12-31','2000-01-01',1], ['0001-01-01','0001-01-02',1],
  ['2026-10-01','2026-11-01',31], ['9999-12-31','9999-12-31',0],
  ['2026-03-08','2026-03-09',1], ['2026-11-01','2026-11-02',1],
  ['2020-01-01','2021-01-01',366], ['2025-12-31','2026-01-01',1],
];
for (const [a,b,days] of references) test(`reference ${a} → ${b}: ${days} calendar days`, () => {
  assert.equal(betweenCivil(a,b).days, days); assert.equal(betweenCivil(a,b,true).days, days+1);
});
// Published MDN Temporal.PlainDate.add examples; our runtime needs no Temporal.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/add#examples
for (const [start, units, direction, expected] of [
  ['2021-01-01',{years:1,months:2,weeks:3,days:4},1,'2022-03-26'],
  ['2021-01-01',{years:1,months:2,weeks:3,days:4},-1,'2019-10-07'],
  ['2021-01-31',{months:1},1,'2021-02-28'],
  ['2021-01-31',{months:1,days:31},1,'2021-03-31'],
  ['2024-02-29',{years:1},1,'2025-02-28'],
]) test(`calendar addition ${start} → ${expected}`, () => assert.equal(shiftCivil(start,units,direction).iso,expected));
test('regression: year 10000 is not truncated to the legacy +010000-01 display', () => {
  assert.equal(shiftCivil('9999-12-31',{days:1}).iso,'10000-01-01');
  assert.equal(isoCivil(parseCivil('10000-01-01')),'10000-01-01');
});
test('month-end policy is explicit, and reject never silently rolls into March', () => {
  assert.equal(shiftCivil('2026-01-31',{months:1}).clipped,true);
  assert.throws(()=>shiftCivil('2026-01-31',{months:1},1,'reject'),/MONTH_END/u);
  assert.deepEqual(betweenCivil('2026-01-31','2026-02-28').period,{years:0,months:1,days:0});
  assert.deepEqual(betweenCivil('2026-01-31','2026-03-30').period,{years:0,months:1,days:30});
});
test('native range, impossible dates, fractions and overflow fail with stable codes', () => {
  for (const bad of ['',null,'0000-01-01','2026-02-29','2026-04-31','2026-13-01','2026-00-01','2026-01-00','2026-1-1','275760-09-14']) assert.throws(()=>parseCivil(bad));
  for (const days of [-1,1.5,NaN,Infinity,'1.2','1e2',' 2 ',null,{}]) assert.throws(()=>shiftCivil('2026-01-01',{days}));
  assert.throws(()=>shiftCivil('0001-01-01',{days:1},-1),/DATE_RANGE/u);
  assert.throws(()=>shiftCivil('2026-01-01',{days:Number.MAX_SAFE_INTEGER}),/DATE_RANGE/u);
  assert.equal(shiftCivil('0001-01-01',{days:4_000_000}).iso,'10952-08-18');
  assert.equal(betweenCivil('275760-08-31','275760-09-13').days,13);
});
const civilDate = fc.integer({min:0,max:3_000_000}).map(days=>shiftCivil('0001-01-01',{days}).iso);
test('5,000 generated date pairs: symmetry, inclusive count and exact calendar reconstruction', () => {
  fc.assert(fc.property(civilDate,civilDate,(a,b)=>{
    const result=betweenCivil(a,b); assert.equal(result.days,betweenCivil(b,a).days);
    assert.equal(betweenCivil(a,b,true).days,result.days+1);
    const [low,high]=parseCivil(a)<=parseCivil(b)?[a,b]:[b,a];
    assert.equal(shiftCivil(low,result.period).iso,high);
    assert.equal(result.weeks*7+result.remainder,result.days);
  }),{numRuns:5000,seed:20261029});
});
test('5,000 offsets round-trip without timezone drift, including offsets beyond 3.65M days', () => {
  fc.assert(fc.property(civilDate,fc.integer({min:0,max:3_000_000}),(start,days)=>{
    const end=shiftCivil(start,{days}).iso;
    assert.equal(shiftCivil(end,{days},-1).iso,start);
    assert.equal(betweenCivil(start,end).days,days);
  }),{numRuns:5000,seed:2981026});
});
test('share parameters round-trip and reject malformed input instead of producing NaN', () => {
  for(const state of [{mode:'between',start:'2026-01-01',end:'2026-01-31',inclusive:true},{mode:'shift',start:'2026-01-31',units:{years:0,months:1,weeks:0,days:0},direction:1,overflow:'constrain'}]) assert.deepEqual(stateFromURL(stateToURL(state)),state);
  for(const search of ['?mode=x&start=2026-01-01','?start=bad&end=2026-01-01','?start=2026-01-01&end=2026-01-02&inclusive=yes','?mode=shift&start=2026-01-01&days=Infinity']) assert.throws(()=>stateFromURL(search));
  assert.equal(stateFromURL(''),null);
  assert.equal(longDate('2026-10-01'),'Thursday, October 1, 2026');
});
