import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { norwayCompanyCarEnglish } from '../../src/markets-no-ch/norway-company-car-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
const output = resolve('src/markets-no-ch/norway-company-car-translation-captures.json');
const flatten = (v, a=[]) => { if (typeof v === 'string') a.push(v); else if (Array.isArray(v)) v.forEach(x => flatten(x,a)); else if (v && typeof v === 'object') Object.values(v).forEach(x => flatten(x,a)); return a; };
const sources = [...new Set(flatten(norwayCompanyCarEnglish))];
const common = sources.filter(s => Object.keys(translationsByLocale).filter(k=>k!=='en').every(k=>translationsByLocale[k]?.[s]));
const uniqueSources = sources.filter(s => !common.includes(s));
const allowed = Object.keys(translationsByLocale).filter(k=>k!=='en');
const escape = s => JSON.stringify(s).replaceAll('<','\\u003c');
const html = `<!doctype html><meta charset="utf-8"><title>NO006 capture receiver</title><h1>NO006 static translation capture</h1><textarea id="source" hidden>${escape(uniqueSources)}</textarea><label>Locale<input id="locale"></label><label>JSON row<textarea id="row"></textarea></label><button id="save">Save this locale</button><output id="status"></output><script>document.querySelector('#save').onclick=async()=>{const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locale:document.querySelector('#locale').value,row:JSON.parse(document.querySelector('#row').value)})});document.querySelector('#status').textContent=await r.text()}</script>`;
createServer(async (req,res)=>{
 if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(html);return;}
 if(req.method==='POST'&&req.url==='/save'){
  let body='';for await(const c of req)body+=c;const {locale,row}=JSON.parse(body);
  if(!allowed.includes(locale)||!Array.isArray(row)||row.length!==uniqueSources.length||row.some(x=>typeof x!=='string'||!x.trim())){res.writeHead(400);res.end('Invalid locale capture');return;}
  let data={};try{data=JSON.parse(await readFile(output,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  data[locale]=row;await writeFile(output,JSON.stringify(data,null,2)+'\n');res.writeHead(200,{'content-type':'text/plain; charset=utf-8'});res.end(`Saved ${locale}: ${row.length} strings.`);return;
 }
 res.writeHead(404);res.end('Not found');
}).listen(4194,'127.0.0.1',()=>console.log(`NO006 capture receiver on 127.0.0.1:4194 (${uniqueSources.length} strings).`));
