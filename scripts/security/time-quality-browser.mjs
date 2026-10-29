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
const copy=JSON.parse(await readFile(join(root,'translation-sources/time-duration-calculator.json'))).sourceCopy;
const report={scope:'unpublished-time-duration-calculator',startedAt:new Date().toISOString(),physicalDevices:false,clipboard:'mocked success and permission-denied fallback; OS clipboard not modified',browsers:[]};
for(const [name,type]of Object.entries({chromium,firefox,webkit})){
  await checkResources(root,80_000_000);
  const profile=await mkdtemp(join(root,'.qa-time-profile-'));
  let context;
  const result={name,checks:[],geometries:[],consoleErrors:[],pageErrors:[],thirdPartyRequests:[]};
  try{
    context=await type.launchPersistentContext(profile,{headless:true,...(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{}),viewport:{width:390,height:844},locale:'en-US',timezoneId:'America/New_York',colorScheme:'light',reducedMotion:'reduce'});
    const page=context.pages()[0]??await context.newPage();
    page.on('console',m=>{if(m.type()==='error')result.consoleErrors.push(m.text());});page.on('pageerror',e=>result.pageErrors.push(e.message));
    page.on('request',r=>{if(new URL(r.url()).origin!==origin.origin)result.thirdPartyRequests.push(r.url());});
    const open=async query=>{await page.goto(origin.origin+'/tools/time-duration-calculator/'+(query??''));await page.evaluate(()=>document.fonts.ready);};
    const check=async(label,fn)=>{await fn();result.checks.push(label);};
    const fillMoment=async(id,text)=>{const [date,time]=text.split('T');await page.locator('#'+id+'-date').fill(date??'');await page.locator('#'+id+'-time').fill(time??'');};
    const calculate=async()=>page.getByRole('button',{name:'Calculate duration',exact:true}).click();
    const seconds=async expected=>assert.equal((await page.locator('#total-seconds').textContent()).replaceAll(',',''),String(expected));
    const example=async id=>page.locator(`[data-example=${id}]`).click();
    await open();
    await check('default 8h30; existing canonical and draft noindex',async()=>{await seconds(30600);assert.equal(await page.locator('#answer').textContent(),'8 hours, 30 minutes');assert.ok(!/undefined|NaN/.test(await page.locator('body').innerText()));assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://usefulverse.com/tools/time-duration-calculator/');assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');});
    await check('clock overnight and break; too-long break removes stale result',async()=>{await example('overnight');await seconds(6300);await page.locator('#break').fill('15');assert.equal(await page.locator('#copy').isDisabled(),true);await calculate();await seconds(5400);await page.locator('#break').fill('106');await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.BREAK_TOO_LONG);assert.equal(await page.locator('#answer').count(),0);assert.equal(await page.locator('#copy').isDisabled(),true);});
    await check('all four executable examples match their published seconds',async()=>{for(const [id,n]of [['overnight',6300],['leap',172800],['spring',10800],['flight',7200]]){await example(id);await seconds(n);}});
    await check('Madrid missing hour rejected; real time succeeds',async()=>{await example('spring');await page.locator('.advanced summary').click();await page.locator('#start-zone').selectOption('Europe/Madrid');await page.locator('#end-zone').selectOption('Europe/Madrid');await fillMoment('start','2026-03-29T02:30');await fillMoment('end','2026-03-29T04:00');await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.TIME_GAP);assert.equal(await page.evaluate(()=>document.activeElement.id),'start-time');await fillMoment('start','2026-03-29T01:30');await calculate();await seconds(5400);});
    await check('repeated New York labels need separate occurrence choices',async()=>{await example('spring');await fillMoment('start','2024-11-03T01:30');await fillMoment('end','2024-11-03T01:30');await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.TIME_REPEAT);assert.equal(await page.evaluate(()=>document.activeElement.id),'start-occurrence');await page.locator('#start-occurrence').selectOption('earlier');await page.locator('#end-occurrence').selectOption('later');await calculate();await seconds(3600);assert.ok((await page.locator('#result').textContent()).includes('-04:00'));assert.ok((await page.locator('#result').textContent()).includes('-05:00'));});
    await check('swap preserves explicit zones and reversed result note',async()=>{await example('flight');await page.locator('#swap').click();await seconds(7200);assert.ok((await page.locator('#result').textContent()).includes(copy.ui.reversed));});
    await check('empty date and incomplete numeric input are focused/rejected',async()=>{await fillMoment('start','');await calculate();assert.equal(await page.evaluate(()=>document.activeElement.id),'start-date');await example('overnight');await page.locator('#break').fill('');await page.locator('#break').press('-');if(await page.locator('#break').evaluate(e=>e.validity.badInput)){await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.BREAK_INVALID);assert.equal(await page.locator('#answer').count(),0);}});
    await check('mocked clipboard and denied-permission share restore explicit zones',async()=>{await example('flight');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.__copied=text}}));await page.locator('#copy').click();assert.ok((await page.evaluate(()=>window.__copied)).includes('7,200'));await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));await page.locator('#share').click();assert.equal(await page.locator('#copy-fallback').isVisible(),true);const link=await page.locator('#copy-text').inputValue();assert.ok(link.includes('startZone=America%2FNew_York'));await page.goto(link);await seconds(7200);});
    await check('malformed share URL cannot inject HTML',async()=>{await open('?mode=clock&start=%3Cscript%3E');assert.equal(await page.locator('#error').textContent(),copy.ui.errors.LINK_INVALID);assert.equal(await page.locator('#answer').count(),0);});
    await open();
    await check('FAQ structured data matches ten visible questions/answers',async()=>{const d=await page.evaluate(()=>({schema:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).find(s=>s['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),visible:[...document.querySelectorAll('.faq details')].map(e=>[e.querySelector('summary').textContent,e.querySelector('p').textContent])}));assert.deepEqual(d.schema,d.visible);assert.equal(d.visible.length,10);});
    await check('keyboard skip link and calculation radios',async()=>{await page.keyboard.press(name==='webkit'?'Alt+Tab':'Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'calculator');await page.keyboard.press(name==='webkit'?'Alt+Tab':'Tab');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('input[name=mode]:checked').inputValue(),'clock');});
    await check('calculation still works offline after initial load',async()=>{await context.setOffline(true);try{await example('overnight');await seconds(6300);}finally{await context.setOffline(false);}});
    await open();await page.addScriptTag({path:join(root,'node_modules/axe-core/axe.min.js')});
    await check('input boundaries meet WCAG non-text contrast 3:1',async()=>{
      const ratio=await page.locator('#start-date').evaluate(el=>{const s=getComputedStyle(el),lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(v=>Number(v)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];};const a=lum(s.borderTopColor),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert.ok(ratio>=3,String(ratio));
    });
    for(const theme of ['light','dark']){
      await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
      for(const width of [320,360,390,414,768,1024,1280,1440,1920]){
        await page.setViewportSize({width,height:900});
        const geometry=await page.evaluate(()=>{const w=document.querySelector('main>.wrap').getBoundingClientRect();return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,margins:[w.left+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineStart),innerWidth-w.right+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineEnd)]};});
        assert.ok(geometry.scrollWidth<=width,JSON.stringify({name,theme,...geometry}));const nativeTimeMin=await page.evaluate(()=>Math.min(...['start-time','end-time'].map(id=>document.getElementById(id).clientWidth)));assert.ok(nativeTimeMin>=180,JSON.stringify({name,width,nativeTimeMin}));geometry.nativeTimeMin=nativeTimeMin;assert.ok(Math.min(...geometry.margins)>=16);
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
