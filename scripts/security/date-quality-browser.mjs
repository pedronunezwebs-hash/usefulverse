// Manual, local-only browser checks. Never dispatches CI or deploys anything.
import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkResources } from '../local-resources.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const origin=new URL(process.argv[2]??'');
if(!['127.0.0.1','[::1]'].includes(origin.hostname)||origin.protocol!=='http:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('Use only a loopback HTTP origin');
const output=resolve(process.argv[3]??'');if(!output.startsWith(root+'.qa-'))throw Error('Use a new owned .qa-... report');
const copy=JSON.parse(await readFile(join(root,'translation-sources/date-calculator.json'))).sourceCopy;
const report={scope:'unpublished-date-calculator',startedAt:new Date().toISOString(),physicalDevices:false,clipboard:'mocked success and permission-denied fallback; OS clipboard not modified',browsers:[]};
for(const [name,type]of Object.entries({chromium,firefox,webkit})){
  await checkResources(root,80_000_000);
  const profile=await mkdtemp(join(root,'.qa-date-profile-'));
  let context;
  const result={name,checks:[],geometries:[],consoleErrors:[],pageErrors:[],thirdPartyRequests:[]};
  try{
    context=await type.launchPersistentContext(profile,{headless:true,...(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{}),viewport:{width:390,height:844},locale:'en-US',timezoneId:'America/New_York',colorScheme:'light',reducedMotion:'reduce'});
    const page=context.pages()[0]??await context.newPage();
    page.on('console',m=>{if(m.type()==='error')result.consoleErrors.push(m.text());});page.on('pageerror',e=>result.pageErrors.push(e.message));
    page.on('request',r=>{if(new URL(r.url()).origin!==origin.origin)result.thirdPartyRequests.push(r.url());});
    const open=async query=>{await page.goto(origin.origin+'/tools/date-calculator/'+(query??''));await page.evaluate(()=>document.fonts.ready);};
    const check=async(label,fn)=>{await fn();result.checks.push(label);};
    await open();
    await check('default 31 days; draft metadata; canonical existing URL',async()=>{assert.equal(await page.locator('#answer-days').textContent(),'31');assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://usefulverse.com/tools/date-calculator/');assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');});
    const calculate=async()=>{await page.getByRole('button',{name:'Calculate dates',exact:true}).click();
      if(await page.locator('#answer-days').count())assert.ok(await page.locator('#answer-days').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'The numeric answer should be visible after submission');
    };
    await check('elapsed/inclusive/reversed dates',async()=>{await page.locator('#start').fill('2026-01-01');await page.locator('#end').fill('2026-01-31');await calculate();assert.equal(await page.locator('#answer-days').textContent(),'30');await page.locator('#inclusive').check();await calculate();assert.equal(await page.locator('#answer-days').textContent(),'31');await page.locator('#swap').click();assert.equal(await page.locator('#answer-days').textContent(),'31');assert.ok((await page.locator('#result').textContent()).includes(copy.ui.reversed));});
    await check('month-end constrain/reject; no stale output after error',async()=>{await page.getByLabel('Add or subtract',{exact:true}).check();await page.locator('#base').fill('2026-01-31');await page.locator('#months').fill('1');await page.locator('#days').fill('0');await calculate();assert.equal(await page.locator('#answer-date').textContent(),'2026-02-28');await page.locator('.advanced summary').click();await page.locator('#overflow').selectOption('reject');await calculate();assert.equal(await page.locator('#error').isVisible(),true);assert.equal(await page.locator('#answer-date').count(),0);assert.equal(await page.locator('#copy').isDisabled(),true);await page.locator('#overflow').selectOption('constrain');});
    await check('all four worked example buttons produce their stated result',async()=>{for(const [id,expected]of [['elapsed','31'],['leap','2'],['month','2026-02-28'],['ninety','2026-12-30']]){await page.locator(`[data-example=${id}]`).click();assert.equal(await page.locator(id==='elapsed'||id==='leap'?'#answer-days':'#answer-date').textContent(),expected);}});
    await check('year 10000 is displayed completely',async()=>{await page.locator('#base').fill('9999-12-31');await page.locator('#months').fill('0');await page.locator('#days').fill('1');await calculate();assert.equal(await page.locator('#answer-date').textContent(),'10000-01-01');});
    await check('empty date reports and focuses the field',async()=>{await page.locator('#base').fill('');await calculate();assert.equal(await page.locator('#error').isVisible(),true);assert.equal(await page.locator('#base').getAttribute('aria-invalid'),'true');assert.equal(await page.evaluate(()=>document.activeElement.id),'base');});
    await check('native bad numeric input is not treated as zero',async()=>{await page.locator('#base').fill('2026-01-01');await page.locator('#days').fill('');await page.locator('#days').press('-');const bad=await page.locator('#days').evaluate(el=>el.validity.badInput);if(bad){await calculate();assert.equal(await page.locator('#error').isVisible(),true);assert.equal(await page.locator('#answer-date').count(),0);}else result.checks.push('browser rejected the incomplete numeric token before submission');});
    await check('copy success payload and denied clipboard share fallback',async()=>{await page.locator('[data-example=elapsed]').click();await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}}));await page.locator('#copy').click();assert.ok((await page.evaluate(()=>window.__copied)).includes('31 calendar days apart'));assert.equal(await page.locator('#copy-status').textContent(),copy.ui.copied);await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Denied','NotAllowedError');}}}));await page.locator('#share').click();assert.equal(await page.locator('#copy-fallback').isVisible(),true);const link=await page.locator('#copy-text').inputValue();assert.ok(link.includes('start=2026-10-01'));await page.goto(link);assert.equal(await page.locator('#answer-days').textContent(),'31');});
    await check('malformed share link cannot display injected content',async()=>{await open('?start=%3Cscript%3E&end=2026-01-01');assert.equal(await page.locator('#error').textContent(),copy.ui.errors.LINK_INVALID);assert.equal(await page.locator('#answer-days').count(),0);});
    await open();
    await check('FAQ structured data exactly matches visible questions and answers',async()=>{const data=await page.evaluate(()=>{const schema=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);return {schema:schema.find(s=>s['@type']==='FAQPage').mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})),visible:[...document.querySelectorAll('.faq details')].map(d=>({question:d.querySelector('summary').textContent,answer:d.querySelector('p').textContent}))};});assert.deepEqual(data.schema,data.visible);assert.equal(data.visible.length,10);});
    await check('skip link and native calculation radios work with keyboard',async()=>{const next=name==='webkit'?'Alt+Tab':'Tab';await page.keyboard.press(next);assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'calculator');await page.keyboard.press(next);await page.keyboard.press('ArrowRight');assert.equal(await page.locator('input[name=mode]:checked').inputValue(),'shift');});
    await open();await page.addScriptTag({path:join(root,'node_modules/axe-core/axe.min.js')});
    await check('input boundaries meet WCAG non-text contrast 3:1',async()=>{
      const ratio=await page.locator('#start').evaluate(el=>{const s=getComputedStyle(el),lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(v=>Number(v)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];};const a=lum(s.borderTopColor),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert.ok(ratio>=3,String(ratio));
    });
    for(const theme of ['light','dark']){
      await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
      for(const width of [320,360,390,414,768,1024,1280,1440,1920]){
        await page.setViewportSize({width,height:900});
        const geometry=await page.evaluate(()=>{const w=document.querySelector('main>.wrap').getBoundingClientRect();return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,margins:[w.left+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineStart),innerWidth-w.right+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineEnd)]};});
        assert.ok(geometry.scrollWidth<=width,JSON.stringify({name,theme,...geometry}));assert.ok(Math.min(...geometry.margins)>=16);
        const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
        assert.deepEqual(violations,[],JSON.stringify({name,theme,width,violations}));result.geometries.push({theme,...geometry,axeViolations:0});
      }
    }
    result.stressLayouts=[];
    for(const fixture of ['rtl','long-text','text-size-200']){
      await open();await page.setViewportSize({width:390,height:844});
      await page.evaluate(fixture=>{
        if(fixture==='rtl')document.documentElement.dir='rtl';
        if(fixture==='text-size-200'){
          for(const el of document.querySelectorAll('body *')){
            if(!el.matches('script,style,svg,svg *'))el.dataset.originalFontSize=getComputedStyle(el).fontSize;
          }
          for(const el of document.querySelectorAll('[data-original-font-size]'))el.style.fontSize=(parseFloat(el.dataset.originalFontSize)*2)+'px';
        }else{
          for(const el of document.querySelectorAll('h1,h2,h3,p,summary,button,.field>span,.mode span,.check-label>span')){
            if(el.querySelector('svg,button,span,small,input')||el.closest('#result'))continue;
            el.textContent=fixture==='rtl'?el.textContent+' — تفاصيل التقويم':el.textContent+' '+el.textContent;
          }
        }
      },fixture);
      const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
      assert.ok(overflow.scrollWidth<=overflow.width,JSON.stringify({name,fixture,...overflow}));
      result.stressLayouts.push({fixture,...overflow,note:'Synthetic layout fixture, not a translated-language approval or actual browser zoom'});
      if(name==='chromium')await page.screenshot({path:join(dirname(output),fixture+'.webp'),type:'webp',fullPage:false});
    }
    for(const width of [568,844,1024,1920]){
      await open();await page.setViewportSize({width,height:390});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      result.stressLayouts.push({fixture:'landscape',width,height:390});
    }
    await open();await page.setViewportSize({width:1440,height:1000});
    if(name==='chromium'){
      await page.screenshot({path:join(dirname(output),'desktop.webp'),type:'webp',fullPage:false});
      await page.setViewportSize({width:390,height:844});await page.screenshot({path:join(dirname(output),'mobile.webp'),type:'webp',fullPage:false});
    }
    assert.deepEqual(result.pageErrors,[]);assert.deepEqual(result.consoleErrors,[]);assert.deepEqual(result.thirdPartyRequests,[]);
    report.browsers.push(result);
  }catch(error){result.failure=error.stack;report.browsers.push(result);report.failed=true;break;}
  finally{await context?.close();await rm(profile,{recursive:true,force:true});}
}
report.completedAt=new Date().toISOString();await writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({browsers:report.browsers.map(b=>({name:b.name,checks:b.checks.length,geometries:b.geometries.length,failure:b.failure})),failed:!!report.failed}));if(report.failed)process.exitCode=1;
