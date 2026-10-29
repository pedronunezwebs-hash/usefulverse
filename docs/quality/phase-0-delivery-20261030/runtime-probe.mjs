import {chromium} from 'playwright';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),origin=process.argv[2],out=resolve(process.argv[3]??''),publicRun=origin==='https://tools.usefulverse.com';
if(![origin==='http://127.0.0.1:54829',publicRun].some(Boolean)||!out.startsWith(root+'/.qa-phase0/'))throw Error('Use explicit known origin/owned report');
const {checkResources}=await import(pathToFileURL(join(root,'scripts/local-resources.mjs')));
await checkResources(root,80_000_000);
const profile=await mkdtemp(join(root,'.qa-phase0/profile-')),report={checkedAt:new Date().toISOString(),origin,scope:'phase0 infrastructure; no tool/language approval',rows:[],geometries:[],pageErrors:[],consoleErrors:[],failedRequests:[]};let ctx;
try{
 ctx=await chromium.launchPersistentContext(profile,{headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',locale:'en-US',viewport:{width:390,height:844}});
 const page=ctx.pages()[0];
 page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('status of 404'))report.consoleErrors.push(m.text());});page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
 for(const path of ['/tools/zzz/','/es/zzz/','/zzz.html','/tools/zzz-no-existe/']){
  const r=await page.goto(origin+path);const state=await page.evaluate(()=>({title:document.title,lang:document.documentElement.lang,noindex:document.querySelector('meta[name=robots]')?.content}));
  assert.equal(r.status(),404);assert.equal(state.noindex,'noindex,follow');assert.equal(state.lang,path.startsWith('/es/')?'es':'en');report.rows.push({path,status:r.status(),...state});
 }
 if(!publicRun){
  const axe=await readFile(join(root,'node_modules/axe-core/axe.min.js'),'utf8'),probe=await readFile(join(root,'tests/browser/phase-zero.js'),'utf8');
  for(const lang of ['es','de','ar']){
   await page.goto(origin+'/'+lang+'/zzz/');await page.evaluate(axe);
   for(const width of [320,360,390,414,768,1024,1280,1440,1920]){await page.setViewportSize({width,height:900});report.geometries.push(await page.evaluate(probe));}
  }
 }
 await page.goto(origin+'/tools/401k-calculator/');await page.waitForFunction(()=>[...document.scripts].some(s=>s.src.includes('/8dcb0a88a745596406d82318/controllers/401k-calculator.js')));
 await page.waitForTimeout(250);
 report.tool=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.textContent,canonical:document.querySelector('link[rel=canonical]')?.href,controls:document.querySelectorAll('input,select,button').length,robots:document.querySelector('meta[name=robots]')?.content??null}));
 assert.equal(report.tool.canonical,'https://tools.usefulverse.com/tools/401k-calculator/');assert.ok(!report.tool.robots?.includes('noindex'));
 report.asset=await page.evaluate(async()=>{const url='/assets/recovered-live-only-106/8dcb0a88a745596406d82318/controllers/401k-calculator.js',r=await fetch(url);return {path:url,status:r.status,cacheControl:r.headers.get('cache-control'),contentType:r.headers.get('content-type')};});
 assert.equal(report.asset.status,200);assert.ok(report.asset.cacheControl.includes('max-age=31536000')&&report.asset.cacheControl.includes('immutable'));assert.ok(!report.asset.cacheControl.includes('max-age=0'));assert.ok(report.asset.contentType.includes('javascript'));
 const samplePaths=['/tools/radical-calculator/','/es/tools/limit-calculator/','/ar/tools/inequality-calculator/','/ja/tools/rref-calculator/','/hi/tools/histogram-calculator/','/de/tools/differential-equation-solver/','/fr/tools/prime-factorization-calculator/','/ru/tools/modulo-calculator/','/tools/401k-calculator/','/nb/tools/aquarium-water-mixing-calculator/'];
 report.samples=await page.evaluate(async paths=>{const rows=[];for(const path of paths){const r=await fetch(path,{signal:AbortSignal.timeout(15000)});const doc=new DOMParser().parseFromString(await r.text(),'text/html'),canonical=doc.querySelector('link[rel=canonical]')?.getAttribute('href'),robots=doc.querySelector('meta[name=robots]')?.content??'';if(r.status!==200||canonical!=='https://tools.usefulverse.com'+path||robots.includes('noindex'))throw Error('Bad sample '+path);const namespace=path.startsWith('/nb/')?null:[...doc.scripts].some(s=>s.getAttribute('src')?.includes('/8dcb0a88a745596406d82318/controllers/'));if(namespace===false)throw Error('Unversioned sample '+path);rows.push({path,status:r.status,canonical,lang:doc.documentElement.lang,h1:doc.querySelector('h1')?.textContent,robots,namespace});}return rows;},samplePaths);
 report.sitemap=await page.evaluate(async samplePaths=>{
  const parse=(text,label)=>{const xml=new DOMParser().parseFromString(text,'application/xml');if(xml.querySelector('parsererror'))throw Error('Invalid XML '+label+' prefix='+JSON.stringify(text.slice(0,180)));return xml;};
  const r=await fetch('/sitemap.xml',{signal:AbortSignal.timeout(15000)});if(r.status!==200)throw Error('Sitemap HTTP');const index=parse(await r.text(),'/sitemap.xml');if(index.documentElement.localName!=='sitemapindex')throw Error('Expected sitemap index');
  const feeds=[...index.querySelectorAll('sitemap>loc')].map(n=>n.textContent),urls=new Set(),counts=[];
  for(const feed of feeds){const u=new URL(feed);if(u.origin!=='https://tools.usefulverse.com')throw Error('Foreign feed');const r=await fetch(u.pathname,{signal:AbortSignal.timeout(15000)});if(r.status!==200)throw Error('Feed HTTP');const doc=parse(await r.text(),u.pathname+' content-type='+r.headers.get('content-type'));const locs=[...doc.querySelectorAll('url>loc')].map(n=>n.textContent);for(const loc of locs){if(!loc.startsWith('https://tools.usefulverse.com/'))throw Error('Foreign canonical');if(urls.has(loc))throw Error('Duplicate canonical');urls.add(loc);}counts.push({path:u.pathname,urls:locs.length});}
  return {feeds:feeds.length,urls:urls.size,counts,samples:samplePaths.map(path=>({path,present:urls.has('https://tools.usefulverse.com'+path)}))};
 },samplePaths);
 assert.ok(report.sitemap.samples.every(s=>s.present));assert.equal(report.samples.length,10);
 assert.equal(report.sitemap.feeds,37);assert.equal(report.sitemap.urls,15365);
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
 await writeFile(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({origin,rows:report.rows,geometries:report.geometries.length,asset:report.asset,sitemap:{feeds:report.sitemap.feeds,urls:report.sitemap.urls},errors:0}));
}catch(error){report.failure=String(error.stack).slice(0,2200);await writeFile(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});throw error;}finally{await ctx?.close();await rm(profile,{recursive:true,force:true});}
