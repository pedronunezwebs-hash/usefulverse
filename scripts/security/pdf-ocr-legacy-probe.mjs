// Explicit local/manual QA of the public widget using a synthetic local PDF.
import { chromium } from 'playwright';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { checkResources } from '../local-resources.mjs';
import assert from 'node:assert/strict';
const root=resolve('.'),out=resolve(process.argv[2]??''),fixture=resolve(process.argv[3]??''),scan=process.argv[4]?resolve(process.argv[4]):null;
if(!out.startsWith(root+'/.qa-')||!fixture.startsWith(root+'/.qa-'))throw Error('Use owned QA paths');
if(scan&&!scan.startsWith(root+'/.qa-'))throw Error('Use an owned scan fixture');
await checkResources(root,90_000_000);
const profile=await mkdtemp(join(root,'.qa-math-profile-ocr-'));let context;
try {
 context=await chromium.launchPersistentContext(profile,{headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',viewport:{width:390,height:844}});
 const page=context.pages()[0],sent=[],failures=[];
 page.on('request',r=>{if(r.method()!=='GET')sent.push({url:r.url(),method:r.method()});});
 page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
 const response=await page.goto('https://usefulverse.com/tools/pdf-ocr/');
 assert.equal(response.status(),200);
 await page.waitForFunction(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('/tool-suite-tools.js')));
 await page.waitForTimeout(500); // Let the deferred public controller install its listeners.
 await page.locator('#suite-ocr-file').setInputFiles(fixture);
 await page.locator('#suite-ocr-pages').fill('1');
 await page.getByRole('button',{name:'Extract text / OCR',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#tool-status').textContent.includes('120 pages'));
 const result=await page.evaluate(()=>({url:location.href,title:document.title,selection:document.querySelector('#suite-ocr-pages').value,status:document.querySelector('#tool-status').textContent,output:document.querySelector('#suite-ocr-output').value}));
 assert.equal(result.output,'');assert.equal(result.selection,'1');
 await page.locator('#suite-ocr-file').scrollIntoViewIfNeeded();
 await page.screenshot({path:out.replace(/\.json$/u,'.webp'),type:'webp'});
 await writeFile(out,JSON.stringify({checkedAt:new Date().toISOString(),scope:'Old published widget; real synthetic121-page PDF, requested page1',httpStatus:response.status(),...result,nonGETRequests:sent,failedRequests:failures,candidatePublished:false},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(result));
 if(scan){
  await page.waitForFunction(()=>!document.querySelector('[data-action="run-ocr"]').disabled);
  await page.locator('#suite-ocr-file').setInputFiles(scan);
  await page.locator('#suite-ocr-pages').fill('all');
  await page.getByRole('button',{name:'Extract text / OCR',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#tool-status').textContent.startsWith('Text is ready'),{},{timeout:90000});
  const recognized=await page.evaluate(()=>({status:document.querySelector('#tool-status').textContent,text:document.querySelector('#suite-ocr-output').value}));
  for(const phrase of ['USEFULVERSE OCR TEST','Invoice number UV 2026 001','Total amount 123.45 USD'])assert.ok(recognized.text.replace(/\s+/gu,' ').includes(phrase),phrase);
  assert.deepEqual(sent,[]);
  await writeFile(out.replace(/\.json$/u,'-scan.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'Real OCR in old published widget, one synthetic English scan; no candidate integration or non-English approval',...recognized,nonGETRequests:sent,failedRequests:failures},null,2)+'\n',{flag:'wx'});
  console.log('Three known English lines recognized by the real published PDF.js/Tesseract pipeline');
 }
} finally {await context?.close();await rm(profile,{recursive:true,force:true});}
