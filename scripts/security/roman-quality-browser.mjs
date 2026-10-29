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
const copy=JSON.parse(await readFile(join(root,'translation-sources/roman-numeral-converter.json'))).sourceCopy;
const report={scope:'unpublished-roman-numeral-converter',startedAt:new Date().toISOString(),physicalDevices:false,clipboard:'mocked success and permission-denied fallback; OS clipboard not modified',browsers:[]};
for(const [name,type]of Object.entries({chromium,firefox,webkit})){
  await checkResources(root,80_000_000);
  const profile=await mkdtemp(join(root,'.qa-roman-profile-'));
  let context;
  const result={name,checks:[],geometries:[],consoleErrors:[],pageErrors:[],thirdPartyRequests:[]};
  try{
    context=await type.launchPersistentContext(profile,{headless:true,...(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{}),viewport:{width:390,height:844},locale:'en-US',timezoneId:'America/New_York',colorScheme:'light',reducedMotion:'reduce'});
    const page=context.pages()[0]??await context.newPage();
    page.on('console',m=>{if(m.type()==='error')result.consoleErrors.push(m.text());});page.on('pageerror',e=>result.pageErrors.push(e.message));
    page.on('request',r=>{if(new URL(r.url()).origin!==origin.origin)result.thirdPartyRequests.push(r.url());});
    const open=async query=>{await page.goto(origin.origin+'/tools/roman-numeral-converter/'+(query??''));await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.querySelector('#answer')||!document.querySelector('#error').hidden);};
    const check=async(label,fn)=>{await fn();result.checks.push(label);};
    const calculate=async()=>{await page.getByRole('button',{name:'Convert',exact:true}).click();await page.waitForFunction(()=>document.getElementById('cancel').hidden);};
    const answer=async value=>assert.equal(await page.locator('#answer').textContent(),value);
    const switchMode=async m=>page.locator(`input[name=mode][value=${m}]`).check();
    await open();
    await check('default numeral and draft metadata on existing canonical',async()=>{await answer('MMXXVI');assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://usefulverse.com/tools/roman-numeral-converter/');});
    await check('both directions, lowercase/Unicode and no stale result after invalid input',async()=>{await switchMode('roman');await page.locator('#roman-input').fill('xiv');await calculate();await answer('14');await page.locator('#roman-input').fill('Ⅻ');await calculate();await answer('12');await page.locator('#roman-input').fill('IIII');assert.equal(await page.locator('#copy').isDisabled(),true);await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.ROMAN_INVALID);assert.equal(await page.locator('#answer').count(),0);});
    await check('date conversion retains all three orders and validates empty dates',async()=>{await switchMode('date');for(const [order,value]of [['dmy','XXIX / X / MMXXVI'],['mdy','X / XXIX / MMXXVI'],['ymd','MMXXVI / X / XXIX']]){await page.locator('#order').selectOption(order);await calculate();await answer(value);assert.ok((await page.locator('#result').textContent()).includes(copy.ui.dateParts));}await page.locator('#date-input').fill('');await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.DATE_INVALID);assert.equal(await page.evaluate(()=>document.activeElement.id),'date-input');});
    await check('four worked examples are executable',async()=>{for(const [id,value]of [['year','MMXXVI'],['subtractive','1999'],['date','XXIX / X / MMXXVI'],['large','(IV)']]){await page.locator(`[data-example=${id}]`).click();await page.waitForFunction(()=>document.getElementById('cancel').hidden);await answer(value);}});
    await check('grouped thousands and integers above safe Number precision',async()=>{await switchMode('number');await page.locator('#number-input').fill('4000');await calculate();await answer('(IV)');await page.locator('#extended').uncheck();await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.STANDARD_RANGE);await page.locator('#extended').check();await page.locator('#number-input').fill('9007199254740993');await calculate();const r=await page.locator('#answer').textContent();await switchMode('roman');await page.locator('#roman-input').fill(r);await calculate();await answer('9007199254740993');});
    await check('1,000 batch entries survive worker chunks and complete CSV download',async()=>{await switchMode('batch');await page.locator('#batch-input').fill(Array.from({length:1000},(_,i)=>String(i+1)).join('\n'));await calculate();assert.equal(await page.locator('#batch-rows tr').count(),50);assert.ok((await page.locator('#result').textContent()).includes('1000'));const download=page.waitForEvent('download');await page.locator('#download').click();const file=await download;const target=join(dirname(output),name+'-1000.csv');await file.saveAs(target);const csv=await readFile(target,'utf8');assert.equal(csv.split('\r\n').length,1002);assert.ok(csv.includes('"1000","1000","1000","M",""'));});
    await check('batch row errors, formula-safe CSV and literal untrusted HTML',async()=>{await page.locator('#batch-input').fill('4\n=1+1\n<img src=x onerror=alert(1)>\nIX');await calculate();assert.equal(await page.locator('#batch-rows tr').count(),4);assert.equal(await page.locator('#batch-rows img').count(),0);const download=page.waitForEvent('download');await page.locator('#download').click();const file=await download;const target=join(dirname(output),name+'-invalid.csv');await file.saveAs(target);const csv=await readFile(target,'utf8');assert.ok(csv.includes("\"'=1+1\""));assert.ok(csv.includes('ROMAN_INVALID'));});
    await check('empty batch reports an error and cannot download an empty result',async()=>{await switchMode('batch');await page.locator('#batch-input').fill('');await calculate();assert.equal(await page.locator('#error').textContent(),copy.ui.errors.BATCH_EMPTY);assert.equal(await page.locator('#download').isDisabled(),true);});
    await check('cancel stops a large job and cannot overwrite a newer result',async()=>{await switchMode('batch');assert.equal(await page.locator('#batch-input').isVisible(),true);assert.equal(await page.locator('#batch-input').isEditable(),true);await page.locator('#batch-input').evaluate(e=>{e.value='1\n'.repeat(10000);e.dispatchEvent(new Event('input',{bubbles:true}));});await page.getByRole('button',{name:'Convert',exact:true}).click();await page.locator('#cancel').click();assert.equal(await page.locator('#progress').textContent(),copy.ui.cancelled);assert.equal(await page.locator('#download').isDisabled(),true);await switchMode('number');await page.locator('#number-input').fill('9');await calculate();await answer('IX');});
    await check('mocked clipboard and denied-permission share restore exact input',async()=>{await page.locator('[data-example=year]').click();await page.waitForFunction(()=>document.getElementById('cancel').hidden);await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.__copied=text}}));await page.locator('#copy').click();assert.equal(await page.evaluate(()=>window.__copied),'MMXXVI');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}}));await page.locator('#share').click();assert.equal(await page.locator('#copy-fallback').isVisible(),true);const link=await page.locator('#copy-text').inputValue();assert.ok(link.includes('input=2026'));await page.goto(link);await page.waitForSelector('#answer');await answer('MMXXVI');});
    await check('malformed and duplicate share parameters cannot inject HTML',async()=>{await open('?mode=number&mode=roman&input=%3Cscript%3E');assert.equal(await page.locator('#error').textContent(),copy.ui.errors.LINK_INVALID);assert.equal(await page.locator('#answer').count(),0);});
    await open();
    await check('FAQ schema matches ten visible questions and answers',async()=>{const d=await page.evaluate(()=>({schema:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).find(s=>s['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),visible:[...document.querySelectorAll('.faq details')].map(e=>[e.querySelector('summary').textContent,e.querySelector('p').textContent])}));assert.deepEqual(d.schema,d.visible);assert.equal(d.visible.length,10);});
    await check('keyboard skip and native mode radio navigation',async()=>{await page.keyboard.press(name==='webkit'?'Alt+Tab':'Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'calculator');await page.keyboard.press(name==='webkit'?'Alt+Tab':'Tab');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('input[name=mode]:checked').inputValue(),'roman');});
    await open();await page.addScriptTag({path:join(root,'node_modules/axe-core/axe.min.js')});
    await check('input boundaries meet WCAG non-text contrast 3:1',async()=>{
      const ratio=await page.locator('#number-input').evaluate(el=>{const s=getComputedStyle(el),lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(v=>Number(v)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];};const a=lum(s.borderTopColor),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert.ok(ratio>=3,String(ratio));
    });
    for(const theme of ['light','dark']){
      await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
      for(const width of [320,360,390,414,768,1024,1280,1440,1920]){
        await page.setViewportSize({width,height:900});
        const geometry=await page.evaluate(()=>{const w=document.querySelector('main>.wrap').getBoundingClientRect();return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,margins:[w.left+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineStart),innerWidth-w.right+parseFloat(getComputedStyle(document.querySelector('main>.wrap')).paddingInlineEnd)]};});
        assert.ok(geometry.scrollWidth<=width,JSON.stringify({name,theme,...geometry}));const centerOffset=await page.evaluate(()=>{const p=document.querySelector('.result-metrics'),e=p.lastElementChild,a=p.getBoundingClientRect(),b=e.getBoundingClientRect();return Math.abs((a.left+a.right-b.left-b.right)/2);});assert.ok(centerOffset<=1,JSON.stringify({name,width,centerOffset}));geometry.lastMetricCenterOffset=centerOffset;assert.ok(Math.min(...geometry.margins)>=16);
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
  }catch(error){result.failure=String(error.stack).slice(0,1800)+'\n'+String(error.stack).slice(-1200);report.browsers.push(result);report.failed=true;break;}
  finally{await context?.close();await rm(profile,{recursive:true,force:true});}
}
report.completedAt=new Date().toISOString();await writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({browsers:report.browsers.map(b=>({name:b.name,checks:b.checks.length,geometries:b.geometries.length,failure:b.failure})),failed:!!report.failed}));if(report.failed)process.exitCode=1;
