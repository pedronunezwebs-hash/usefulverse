import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dateCopy as copy, dateExamples, renderDateQuality } from './render.mjs';
import { betweenCivil, shiftCivil } from './logic.mjs';
import { tools } from '../../catalog.mjs';

const options={css:'/assets/test.css',js:'/assets/test.js',font:'/assets/test.woff2'};
test('every worked example is executable and its published answer is correct',()=>{
  assert.deepEqual(copy.examples.map(e=>e.id),dateExamples.map(e=>e.id));
  for(const e of dateExamples){
    if(e.mode==='between')assert.equal(betweenCivil(e.start,e.end,e.inclusive).days,e.expectedDays);
    else assert.equal(shiftCivil(e.start,e.units,e.direction,e.overflow).iso,e.expectedISO);
  }
  assert.equal(betweenCivil('2026-10-01','2026-11-01',true).days,32);
  assert.equal(betweenCivil('2025-02-28','2025-03-01').days,1);
  assert.equal(shiftCivil('2021-01-31',{months:1,days:31}).iso,'2021-03-31');
});
test('metadata is specific, honest and unique among other native tools',()=>{
  assert.ok(copy.title.length>=30&&copy.title.length<=60);
  assert.ok(copy.description.length>=120&&copy.description.length<=160);
  for(const t of tools.filter(t=>t.id!=='date-calculator')){
    assert.notEqual(copy.title,t.title);assert.notEqual(copy.description,t.description);
  }
  assert.equal(copy.related.length,3);
  for(const t of copy.related)assert.ok(tools.some(other=>other.id===t.id),t.id);
});
test('prototype remains isolated, noindex and on the existing canonical',()=>{
  const html=renderDateQuality(options);
  assert.match(html,/<meta name="robots" content="noindex,follow">/u);
  assert.match(html,/<link rel="canonical" href="https:\/\/usefulverse.com\/tools\/date-calculator\/">/u);
  assert.equal((html.match(/<h1\b/gu)||[]).length,1);
  assert.doesNotMatch(html,/\son(?:load|click)=|<iframe\b|https:\/\/fonts\./u);
  const faq=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/u)[1]).find(s=>s['@type']==='FAQPage');
  assert.deepEqual(faq.mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),copy.faq.map(f=>[f.question,f.answer]));
});
test('editorial body shares fewer than 30% of its five-word phrases with other tool sources',async t=>{
  const strings=v=>typeof v==='string'?[v]:v&&typeof v==='object'?Object.values(v).flatMap(strings):[];
  const grams=s=>{const w=s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];return new Set(w.slice(4).map((_,i)=>w.slice(i,i+5).join(' ')));};
  const own=grams(strings([copy.examples,copy.method,copy.uses,copy.privacy,copy.faq]).join(' '));
  const dir=new URL('../../../translation-sources/',import.meta.url);
  let max={file:null,shared:0,ratio:0};
  for(const name of await readdir(dir)){
    if(!name.endsWith('.json')||name==='date-calculator.json')continue;
    const other=grams(strings(JSON.parse(await readFile(new URL(name,dir),'utf8'))).join(' '));
    const shared=[...own].filter(g=>other.has(g)).length,ratio=shared/own.size;
    if(ratio>max.ratio)max={file:name,shared,ratio};
  }
  t.diagnostic(JSON.stringify({uniqueOwnPhrases:own.size,max}));
  assert.ok(max.ratio<.30,JSON.stringify(max));
});
test('query coverage describes real tasks without claiming measured keyword volumes',async()=>{
  const doc=JSON.parse(await readFile(new URL('../../../docs/quality/tools/date-calculator/keywords.json',import.meta.url)));
  assert.equal(doc.intents.length,24);assert.equal(new Set(doc.intents.map(i=>i.phrase)).size,24);
  const html=renderDateQuality(options);
  for(const i of doc.intents)assert.ok(html.includes(`id="${i.section}"`),i.phrase);
  assert.equal(doc.newIndexableURLs,0);assert.equal(doc.provenance.paidSEOTools,false);
});
