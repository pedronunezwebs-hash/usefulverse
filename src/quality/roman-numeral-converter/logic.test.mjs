import test from 'node:test';import assert from 'node:assert/strict';import fc from 'fast-check';
import refs from '../../../docs/quality/tools/roman-numeral-converter/references.json' with {type:'json'};
import {toRoman,fromRoman,convert,convertRows,rowsToCSV,stateToURL,stateFromURL} from './logic.mjs';
for(const r of refs.cases)test(`Unicode reference ${r.unicode} = ${r.number}`,()=>{assert.equal(toRoman(r.number),r.roman);assert.equal(fromRoman(r.unicode),r.number);});
test('external MathWorld examples use ordinary subtractive notation',()=>{
  for(const [n,r]of [['4','IV'],['9','IX'],['14','XIV'],['29','XXIX'],['1732','MDCCXXXII']]){assert.equal(toRoman(n),r);assert.equal(fromRoman(r),n);}
});
test('all 3,999 ordinary numerals round-trip, lower case included',()=>{for(let n=1;n<=3999;n++){const r=toRoman(String(n),false);assert.equal(fromRoman(r.toLowerCase(),false),String(n));}});
test('5,000 generated large integers round-trip exactly, above Number.MAX_SAFE_INTEGER',()=>{
  fc.assert(fc.property(fc.bigInt({min:1n,max:10n**100n}),n=>assert.equal(fromRoman(toRoman(n.toString())),n.toString())),{numRuns:5000,seed:20261029});
});
test('explicit grouped-thousands convention has no numerical cap or recursive stack dependency',()=>{
  for(const [n,r]of [['4000','(IV)'],['4044','(IV)XLIV'],['1000000','(M)'],['4000000','((IV))']]){assert.equal(toRoman(n),r);assert.equal(fromRoman(r),n);}
  assert.equal(toRoman('4000'),'(IV)');assert.equal(toRoman('4000000'),'((IV))');
  const huge='1'+'0'.repeat(10000);assert.equal(fromRoman(toRoman(huge)),huge);
  assert.throws(()=>toRoman('4000',false),/STANDARD_RANGE/u);
});
test('noncanonical numerals, zero, fractions, unsafe coercion and malformed groups fail explicitly',()=>{
  for(const r of ['','IIII','IIV','IL','IC','VX','VV','MMMM','(I)','(IV','IV)','()','(())','(IV)M','<img>','I V','ↀ'])assert.throws(()=>fromRoman(r),r);
  for(const n of ['0','-1','1.5','1,000','1e3','',NaN,9007199254740992])assert.throws(()=>toRoman(n));
});
test('date mode keeps DMY/MDY/YMD and rejects impossible dates',()=>{
  assert.equal(convert({mode:'date',input:'2026-10-29',order:'dmy'}).roman,'XXIX / X / MMXXVI');
  assert.equal(convert({mode:'date',input:'2026-10-29',order:'mdy'}).roman,'X / XXIX / MMXXVI');
  assert.equal(convert({mode:'date',input:'2026-10-29',order:'ymd'}).roman,'MMXXVI / X / XXIX');
  assert.throws(()=>convert({mode:'date',input:'2026-02-29',order:'dmy'}),/DATE_INVALID/u);
});
test('1,000 mixed batch rows preserve all results and per-row errors; CSV shields formulas',()=>{
  const input=Array.from({length:1000},(_,i)=>i%2?toRoman(String(i+1)):String(i+1)).join('\n');const rows=convertRows(input);assert.equal(rows.length,1000);rows.forEach((r,i)=>assert.equal(r.number,String(i+1)));
  const bad=convertRows('4\n=1+1\n\nIX\nIIII');assert.equal(bad.length,4);assert.equal(bad[1].error,'ROMAN_INVALID');assert.equal(bad[2].number,'9');
  const csv=rowsToCSV(bad);assert.ok(csv.includes('"\'=1+1"'));assert.ok(csv.includes('"5","IIII"'));assert.equal(rowsToCSV(rows).split('\r\n').length,1002);
});
test('share links preserve the exact integer and all date options',()=>{
  for(const s of [{mode:'number',input:'9007199254740993',extended:true},{mode:'roman',input:'ⅩⅣ',extended:false},{mode:'date',input:'2026-10-29',order:'ymd',extended:true}])assert.deepEqual(stateFromURL(stateToURL(s)),s);
  assert.equal(stateFromURL(''),null);for(const q of ['?mode=x','?mode=number&mode=roman','?mode=number&input=1e3&extended=1'])assert.throws(()=>stateFromURL(q));
});
