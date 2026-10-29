import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { runPdfOcr, pageSelection, pageText } from './pipeline.mjs';

const deferred = () => { let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject}; };
const tick = () => new Promise(resolve=>setImmediate(resolve));
function fixture(total=3, native=()=> 'Native text') {
 const counts={open:0,get:[],active:0,maxActive:0,clean:0,render:0,release:0,create:0,recognize:0,terminate:0,destroy:0};
 const worker={recognize:async(_image,_options,output)=>{counts.recognize++;return {data:{text:'Recognized text',confidence:87,pdf:output.pdf?new TextEncoder().encode('%PDF-test'):null}};},terminate:async()=>{counts.terminate++;}};
 const adapters={openDocument:async()=>{counts.open++;return {numPages:total,getPage:async n=>{counts.get.push(n);counts.active++;counts.maxActive=Math.max(counts.maxActive,counts.active);return {number:n,getTextContent:async()=>({items:[{str:native(n)}]}),cleanup:()=>{counts.clean++;counts.active--;}};},destroy:async()=>{counts.destroy++;}};},renderPage:async()=>{counts.render++;return {image:{synthetic:true},release:async()=>{counts.release++;}};},createOCR:async()=>{counts.create++;return worker;}};
 const records=[],progress=[];
 return {counts,adapters,worker,records,options:{onPage:r=>records.push(r),onProgress:r=>progress.push(r)},progress};
}

test('legacy120 regression: requested page1 of121 does not reject the whole document',async()=>{
 const f=fixture(121);const result=await runPdfOcr({...f.options,range:'1'},f.adapters);
 assert.deepEqual(f.counts.get,[1]);assert.equal(result.documentPages,121);assert.equal(result.completedPages,1);assert.equal(f.counts.create,0);
});
test('1000 selected pages are consumed sequentially without retaining page rasters',async()=>{
 const f=fixture(1000);const result=await runPdfOcr(f.options,f.adapters);
 assert.equal(result.completedPages,1000);assert.equal(f.counts.clean,1000);assert.equal(f.counts.maxActive,1);assert.equal(f.counts.active,0);assert.equal(f.counts.destroy,1);
 assert.equal(f.progress[0].fraction,0);assert.equal(f.progress.at(-1).fraction,1);
 for(let i=1;i<f.progress.length;i++)assert.ok(f.progress[i].fraction>=f.progress[i-1].fraction);
});
test('one real text character is usable without forcing a model download',async()=>{
 const f=fixture(1,()=> 'A');await runPdfOcr(f.options,f.adapters);assert.equal(f.records[0].text,'A');assert.equal(f.counts.create,0);
});
test('mixed pages load OCR lazily, reuse one worker and release every raster',async()=>{
 const f=fixture(4,n=>n%2?'Native':'');await runPdfOcr(f.options,f.adapters);
 assert.deepEqual(f.records.map(r=>r.source),['existing','ocr','existing','ocr']);assert.equal(f.counts.create,1);assert.equal(f.counts.terminate,1);assert.equal(f.counts.render,2);assert.equal(f.counts.release,2);
});
test('force and existing-only modes are explicit instead of guessing mixed scan content',async()=>{
 const a=fixture();await runPdfOcr({...a.options,mode:'force'},a.adapters);assert.equal(a.counts.recognize,3);
 const b=fixture(3,()=> '');await runPdfOcr({...b.options,mode:'existing'},b.adapters);assert.equal(b.counts.create,0);assert.ok(b.records.every(r=>r.text===''));
});
test('12 range cases reject coercion and preserve unique ascending selected pages',()=>{
 const cases=[['all',121,121],['1',121,1],['120-121',121,2],['3,1-3,2',121,3],[' 1 - 2 , 4 ',121,3],['',121,121]];
 for(const[value,total,length]of cases)assert.equal(pageSelection(value,total).length,length);
 for(const s of ['0','122','2-1','1,,2','1e2','9007199254740993'])assert.throws(()=>pageSelection(s,121),/PAGE_RANGE/u);
 assert.throws(()=>pageSelection('all',0),/EMPTY_DOCUMENT/u);
});
test('5000 generated ranges agree with independently expanded integer sets',()=>{
 fc.assert(fc.property(fc.array(fc.tuple(fc.integer({min:1,max:1000}),fc.integer({min:1,max:1000})),{minLength:1,maxLength:10}),pairs=>{
  const expected=new Set();const ranges=pairs.map(([a,b])=>{const lo=Math.min(a,b),hi=Math.max(a,b);for(let n=lo;n<=hi;n++)expected.add(n);return lo+'-'+hi;});
  assert.deepEqual(pageSelection(ranges.join(','),1000),[...expected].sort((a,b)=>a-b));
 }),{numRuns:5000,seed:20261029});
});
test('native line endings are retained and nontext PDF items ignored',()=>assert.equal(pageText([{str:'First',hasEOL:true},{str:'Second'},{type:'image'},{str:'line'}]),'First\nSecond line'));
test('invalid ranges destroy the document before any model or page work',async()=>{
 const f=fixture();await assert.rejects(runPdfOcr({...f.options,range:'4'},f.adapters),/PAGE_RANGE/u);assert.equal(f.counts.destroy,1);assert.equal(f.counts.create,0);assert.deepEqual(f.counts.get,[]);
});
test('OCR failures release page, canvas, worker and document exactly once',async()=>{
 const f=fixture(1,()=> '');f.worker.recognize=async()=>{throw Error('decoder failure');};await assert.rejects(runPdfOcr(f.options,f.adapters),/decoder failure/u);
 for(const key of ['clean','release','terminate','destroy'])assert.equal(f.counts[key],1,key);
});
test('consumer errors release resources and do not read the next page',async()=>{
 const f=fixture();await assert.rejects(runPdfOcr({...f.options,onPage:()=>{throw Error('sink failed');}},f.adapters),/sink failed/u);assert.deepEqual(f.counts.get,[1]);assert.equal(f.counts.clean,1);assert.equal(f.counts.destroy,1);
});
test('aborted jobs do not open any document',async()=>{
 const f=fixture(),c=new AbortController();c.abort();await assert.rejects(runPdfOcr({...f.options,signal:c.signal},f.adapters),{name:'AbortError'});assert.equal(f.counts.open,0);
});
test('cancellation during OCR terminates even when recognize never settles',async()=>{
 const f=fixture(1,()=> ''),c=new AbortController(),started=deferred();f.worker.recognize=()=>{started.resolve();return new Promise(()=>{});};
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);await started.promise;c.abort();await assert.rejects(run,{name:'AbortError'});
 assert.equal(f.records.length,0);for(const k of ['clean','release','terminate','destroy'])assert.equal(f.counts[k],1,k);
});
test('a model that resolves after cancellation is terminated without publishing output',async()=>{
 const f=fixture(1,()=> ''),c=new AbortController(),pending=deferred(),started=deferred();f.adapters.createOCR=()=>{started.resolve();return pending.promise;};
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);await started.promise;c.abort();await assert.rejects(run,{name:'AbortError'});pending.resolve(f.worker);await tick();
 assert.equal(f.counts.terminate,1);assert.equal(f.records.length,0);assert.equal(f.counts.destroy,1);
});
test('a raster that resolves after cancellation is released without starting OCR',async()=>{
 const f=fixture(1,()=> ''),c=new AbortController(),pending=deferred(),started=deferred();f.adapters.renderPage=()=>{started.resolve();return pending.promise;};
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);await started.promise;c.abort();await assert.rejects(run,{name:'AbortError'});let freed=0;pending.resolve({image:{},release:()=>{freed++;}});await tick();
 assert.equal(freed,1);assert.equal(f.counts.create,0);assert.equal(f.records.length,0);
});
test('late document acquisition is destroyed after cancellation',async()=>{
 const f=fixture(),c=new AbortController(),pending=deferred();f.adapters.openDocument=()=>pending.promise;
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);c.abort();await assert.rejects(run,{name:'AbortError'});let destroyed=0;pending.resolve({destroy:()=>destroyed++});await tick();assert.equal(destroyed,1);
});
test('searchable output is requested explicitly and never presented when missing',async()=>{
 const f=fixture(1,()=> '');await runPdfOcr({...f.options,searchablePDF:true},f.adapters);assert.ok(f.records[0].pdf instanceof Uint8Array);
 const bad=fixture(1,()=> '');bad.worker.recognize=async()=>({data:{text:'words',pdf:null}});await assert.rejects(runPdfOcr({...bad.options,searchablePDF:true},bad.adapters),/OCR_PDF_RESULT/u);assert.equal(bad.records.length,0);assert.equal(bad.counts.terminate,1);
});
test('blank OCR is a valid empty page and does not invent confidence',async()=>{
 const f=fixture(1,()=> '');f.worker.recognize=async()=>({data:{text:'',confidence:NaN}});await runPdfOcr(f.options,f.adapters);assert.equal(f.records[0].text,'');assert.equal(f.records[0].confidence,null);
});
test('a page that resolves after cancellation is cleaned without publishing text',async()=>{
 const f=fixture(),c=new AbortController(),pending=deferred(),started=deferred();
 f.adapters.openDocument=async()=>({numPages:1,getPage:()=>{started.resolve();return pending.promise;},destroy:()=>f.counts.destroy++});
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);await started.promise;c.abort();await assert.rejects(run,{name:'AbortError'});
 let cleaned=0;pending.resolve({cleanup:()=>cleaned++});await tick();assert.equal(cleaned,1);assert.equal(f.records.length,0);assert.equal(f.counts.destroy,1);
});
test('decoder text errors clean the current page and never download a model',async()=>{
 const f=fixture();f.adapters.openDocument=async()=>({numPages:1,getPage:async()=>({getTextContent:async()=>{throw Error('bad text stream');},cleanup:()=>f.counts.clean++}),destroy:()=>f.counts.destroy++});
 await assert.rejects(runPdfOcr(f.options,f.adapters),/bad text stream/u);assert.equal(f.counts.clean,1);assert.equal(f.counts.destroy,1);assert.equal(f.counts.create,0);
});
test('model initialization failure releases raster and decoder without reading another page',async()=>{
 const f=fixture(3,()=> '');f.adapters.createOCR=async()=>{throw Error('model could not start');};
 await assert.rejects(runPdfOcr(f.options,f.adapters),/model could not start/u);assert.equal(f.counts.release,1);assert.equal(f.counts.clean,1);assert.equal(f.counts.destroy,1);assert.deepEqual(f.counts.get,[1]);
});
test('late recognition cannot commit output after the job was cancelled',async()=>{
 const f=fixture(1,()=> ''),c=new AbortController(),pending=deferred(),started=deferred();f.worker.recognize=()=>{started.resolve();return pending.promise;};
 const run=runPdfOcr({...f.options,signal:c.signal},f.adapters);await started.promise;c.abort();await assert.rejects(run,{name:'AbortError'});pending.resolve({data:{text:'Late text'}});await tick();assert.equal(f.records.length,0);assert.equal(f.counts.terminate,1);
});
