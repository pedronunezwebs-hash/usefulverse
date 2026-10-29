// Manual local-only measurement. No CI dispatch, credentials, or deployment.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import {mkdtemp,rm,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,resolve,relative} from 'node:path';
import {checkResources} from '../local-resources.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const url=new URL(process.argv[2]??''),output=resolve(process.argv[3]??'');
if(url.protocol!=='http:'||!['127.0.0.1','[::1]'].includes(url.hostname)||url.username||url.password)throw Error('Only loopback HTTP URLs');
if(!relative(root,output).startsWith('.qa-')||relative(root,output).includes('..'))throw Error('Use a new owned .qa- report');
if(await stat(output).then(()=>true,()=>false))throw Error('Refusing to overwrite evidence');
await checkResources(root,80_000_000);
// A fresh profile prevents stale DevToolsActivePort from connecting to a dead browser.
const profile=await mkdtemp(join(root,'.qa-lighthouse-'));let chrome;
try{
  chrome=await chromeLauncher.launch({chromePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',userDataDir:profile,chromeFlags:['--headless=new','--no-first-run','--disable-extensions']});
  const {lhr}=await lighthouse(url.href,{port:chrome.port,logLevel:'error',onlyCategories:['performance','accessibility','best-practices'],formFactor:'mobile',screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false}});
  const report={version:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,scope:'local unpublished prototype; HTTP server may lack compression/Cloudflare headers',scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score*100])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index'].map(k=>[k,{value:lhr.audits[k].numericValue,unit:lhr.audits[k].numericUnit}])),failedAudits:Object.entries(lhr.audits).filter(([,a])=>a.score===0).map(([id,a])=>({id,title:a.title,details:a.details})),fieldINP:'not measured'};
  await writeFile(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({scores:report.scores,metrics:report.metrics}));
}finally{await chrome?.kill();await rm(profile,{recursive:true,force:true});}
