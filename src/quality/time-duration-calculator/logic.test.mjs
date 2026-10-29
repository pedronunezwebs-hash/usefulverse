import test from 'node:test';import assert from 'node:assert/strict';import fc from 'fast-check';
import refs from '../../../docs/quality/tools/time-duration-calculator/reference-python.json' with {type:'json'};
import {duration,resolveTime,stateFromURL,stateToURL,parseDateTime} from './logic.mjs';
for(const r of refs.cases)test(`Python zoneinfo reference: ${r.start} ${r.startZone} → ${r.end} ${r.endZone}`,()=>assert.equal(duration({mode:'dates',...r}).seconds,r.seconds));
test('Madrid gap is rejected instead of silently normalizing 02:30 into 03:30',()=>{
  for(const choice of ['reject','earlier','later'])assert.throws(()=>resolveTime('2026-03-29T02:30','Europe/Madrid',choice),/TIME_GAP/u);
});
test('repeated time needs a choice; the two identical clock labels can be one hour apart',()=>{
  assert.throws(()=>resolveTime('2024-11-03T01:30','America/New_York'),/TIME_REPEAT/u);
  const s={mode:'dates',start:'2024-11-03T01:30',end:'2024-11-03T01:30',startZone:'America/New_York',endZone:'America/New_York',startOccurrence:'earlier',endOccurrence:'later'};
  assert.equal(duration(s).seconds,3600);assert.equal(duration(s).start.offset,'-04:00');assert.equal(duration(s).end.offset,'-05:00');
});
test('a skipped whole date in Apia is rejected, not shifted to the next date',()=>assert.throws(()=>resolveTime('2011-12-30T12:00','Pacific/Apia','later'),/TIME_GAP/u));
test('clock mode makes overnight, equal times and breaks explicit',()=>{
  const s={mode:'clock',start:'23:30',end:'01:15',nextDay:true};assert.equal(duration(s).seconds,6300);
  assert.throws(()=>duration({...s,nextDay:false}),/CLOCK_ORDER/u);
  assert.equal(duration({...s,start:'09:00',end:'09:00',nextDay:false}).seconds,0);
  assert.equal(duration({...s,start:'09:00',end:'09:00'}).seconds,86400);
  assert.equal(duration({...s,breakMinutes:15}).seconds,5400);
  assert.throws(()=>duration({...s,breakMinutes:106}),/BREAK_TOO_LONG/u);
});
test('invalid dates, leap seconds, zones, negative/fractional breaks and options fail safely',()=>{
  for(const x of ['','2026-02-29T09:00','2026-10-01T24:00','2026-10-01T12:60','2026-10-01T23:59:60','0000-01-01T00:00','<script>'])assert.throws(()=>parseDateTime(x));
  assert.equal(parseDateTime('10000-01-01T00:00').year,10000);
  assert.throws(()=>resolveTime('2026-01-01T12:00','not/a/zone'),/ZONE_INVALID/u);
  for(const b of [-1,1.5,'1e2',Infinity,null])assert.throws(()=>duration({mode:'clock',start:'09:00',end:'17:00',nextDay:false,breakMinutes:b}));
});
test('5,000 clock pairs reconstruct the exact count, with whole break minutes removed',()=>{
  const fmt=n=>[Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(x=>String(x).padStart(2,'0')).join(':');
  fc.assert(fc.property(fc.integer({min:0,max:86399}),fc.integer({min:0,max:86399}),(a,b)=>{
    const s={mode:'clock',start:fmt(a),end:fmt(b),nextDay:b<a};const r=duration(s);
    assert.equal(r.seconds,(b-a+86400)%86400);assert.equal(r.parts.days*86400+r.parts.hours*3600+r.parts.minutes*60+r.parts.seconds,r.seconds);
  }),{numRuns:5000,seed:29102026});
});
test('1,000 generated UTC intervals are symmetric and timezone independent',()=>{
  fc.assert(fc.property(fc.integer({min:0,max:10000000}),fc.integer({min:0,max:10000000}),(a,b)=>{
    const iso=n=>new Date(Date.UTC(2000,0,1)+n*1000).toISOString().slice(0,19);
    const state={mode:'dates',start:iso(a),end:iso(b),startZone:'UTC',endZone:'UTC'};assert.equal(duration(state).seconds,Math.abs(a-b));
    assert.equal(duration({...state,start:state.end,end:state.start}).seconds,Math.abs(a-b));
  }),{numRuns:1000,seed:20261029});
});
test('share round-trip preserves explicit zones/occurrences; invalid and duplicate parameters are rejected',()=>{
  for(const s of [{mode:'clock',start:'23:30',end:'01:15',nextDay:true,breakMinutes:'0'},{mode:'dates',start:'2024-11-03T01:30',end:'2024-11-03T01:30',startZone:'America/New_York',endZone:'America/New_York',startOccurrence:'earlier',endOccurrence:'later',breakMinutes:'0'}])assert.deepEqual(stateFromURL(stateToURL(s)),s);
  assert.equal(stateFromURL(''),null);for(const q of ['?mode=x','?mode=clock&start=x','?mode=clock&mode=dates','?start=%3Cscript%3E'])assert.throws(()=>stateFromURL(q));
});
