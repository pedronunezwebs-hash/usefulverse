const $=id=>document.getElementById(id),data=JSON.parse($('roman-copy').textContent),u=data.ui,workerURL=JSON.parse($('worker-config').textContent).worker;
const styles=$('full-styles');if(styles){const enable=()=>styles.media='all';styles.addEventListener('load',enable,{once:true});if(styles.sheet)enable();}
const el=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
let worker=null,job=0,lastState=null,lastText='',rows=[];
const mode=()=>document.querySelector('input[name=mode]:checked').value;
const fill=(text,values)=>text.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]));
function clear(){lastState=null;lastText='';rows=[];$('result').replaceChildren(el('p',u.empty));for(const id of ['copy','share','download'])$(id).disabled=true;$('download').hidden=true;$('batch-preview').hidden=true;$('batch-rows').replaceChildren();$('copy-status').textContent='';$('copy-fallback').hidden=true;}
function stop(announce=false){job++;worker?.terminate();worker=null;$('cancel').hidden=true;if(announce){clear();$('progress').textContent=u.cancelled;}}
function resetError(){$('error').hidden=true;for(const e of document.querySelectorAll('[aria-invalid]'))e.removeAttribute('aria-invalid');}
function setMode(m){stop();document.querySelector(`input[name=mode][value="${m}"]`).checked=true;for(const k of ['number','roman','date','batch'])$(k+'-fields').hidden=k!==m;resetError();clear();$('progress').textContent='';}
function state(){const m=mode();return {mode:m,input:$(m+'-input').value,extended:$('extended').checked,...(m==='date'?{order:$('order').value}:{})};}
function show(s){setMode(s.mode);$(s.mode+'-input').value=s.input;$('extended').checked=s.extended;if(s.mode==='date')$('order').value=s.order;}
function error(code){clear();$('progress').textContent='';$('error').hidden=false;$('error').textContent=u.errors[code]??u.errors.ROMAN_INVALID;const field=$(mode()+'-input');field.setAttribute('aria-invalid','true');field.focus();}
function answer(result,s){
  const out=$('result'),label=s.mode==='roman'?u.numberOutput:s.mode==='date'?u.dateOutput:u.romanOutput;
  const text=s.mode==='roman'?result.number:result.roman;const value=el('p',text,'roman-answer');value.id='answer';value.dir='ltr';value.tabIndex=0;value.setAttribute('aria-label',label);out.replaceChildren(el('p',label,'result-label'),value);
  if(result.parts.length){const dl=el('dl','','result-metrics');for(const p of result.parts){const group=el('div','');group.append(el('dt',p.roman),el('dd',p.number));dl.append(group);}out.append(el('p',s.mode==='date'?u.dateParts:u.breakdown,'result-note'),dl);}
  if(result.extended)out.append(el('p',u.groupNote,'result-note'));if(s.mode==='date')out.append(el('p',u.dateNote,'result-note'));
  lastState=s;lastText=text;$('copy').disabled=false;$('share').disabled=false;
}
function run(s=state(),scroll=true){
  stop();resetError();clear();const id=job;$('progress').textContent=u.working;$('cancel').hidden=false;
  try{worker=new Worker(workerURL,{type:'module'});}catch{error('WORKER_FAILED');$('cancel').hidden=true;return;}
  worker.onerror=e=>{e.preventDefault();stop();error('WORKER_FAILED');};
  worker.onmessage=({data:d})=>{
    if(d.id!==job)return;
    if(d.type==='rows'){
      for(const r of d.rows){if($('batch-rows').children.length>=50)break;rows.push(r);const tr=el('tr','');for(const v of [r.line,r.input,r.number??'',r.roman??'',r.error?(u.errors[r.error]??u.errors.ROMAN_INVALID):u.ok])tr.append(el('td',String(v)));$('batch-rows').append(tr);}
      $('progress').textContent=fill(u.processed,{done:d.done,total:d.total});$('batch-preview').hidden=false;return;
    }
    worker?.terminate();worker=null;$('cancel').hidden=true;$('progress').textContent='';
    if(d.type==='error'){error(d.code);return;}
    if(d.type==='complete'){lastText=d.csv;$('result').replaceChildren(el('p',fill(u.completed,{count:d.count}),'batch-summary'));$('copy').disabled=false;$('download').disabled=false;$('download').hidden=false;}
    else answer(d.result,s);
    if(scroll)$('result').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  worker.postMessage({id,state:s,headers:[u.line,u.input,u.numberColumn,u.romanColumn,u.errorColumn]});
}
async function copy(text,link=false){try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);$('copy-status').textContent=link?u.shareNotice:u.copied;}catch{$('copy-fallback').hidden=false;$('copy-text').value=text;$('copy-text').focus();$('copy-text').select();$('copy-status').textContent=link?u.shareNotice:u.copyFallback;}}
$('roman-form').addEventListener('submit',e=>{e.preventDefault();run();});for(const r of document.querySelectorAll('input[name=mode]'))r.addEventListener('change',()=>setMode(r.value));
for(const event of ['input','change'])$('roman-form').addEventListener(event,()=>{stop();resetError();clear();$('progress').textContent='';});
$('cancel').addEventListener('click',()=>stop(true));$('reset').addEventListener('click',()=>{stop();$('roman-form').reset();setMode('number');$('number-input').focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{const s=data.examples.find(e=>e.id===button.dataset.example);show(s);run(s);});
$('copy').addEventListener('click',()=>lastText&&copy(lastText));$('share').addEventListener('click',()=>{if(!lastState)return;const s=lastState,p=new URLSearchParams({mode:s.mode,input:s.input,extended:s.extended?'1':'0'});if(s.mode==='date')p.set('order',s.order);copy(new URL('?'+p,location.href).href,true);});
$('download').addEventListener('click',()=>{if(!lastText||!rows.length)return;const url=URL.createObjectURL(new Blob([lastText],{type:'text/csv;charset=utf-8'})),a=el('a','');a.href=url;a.download='roman-conversions.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
function setTheme(t){document.documentElement.dataset.theme=t;$('theme').setAttribute('aria-label',t==='dark'?u.themeLight:u.themeDark);}try{const t=localStorage.getItem('uv-quality-theme');if(['light','dark'].includes(t))setTheme(t);}catch{}
$('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark'||!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches;setTheme(dark?'light':'dark');try{localStorage.setItem('uv-quality-theme',dark?'light':'dark');}catch{}});
// The worker validates the shared state too; no large integer calculation runs on the UI thread.
const p=new URLSearchParams(location.search);
if(p.size){let bad=false;for(const k of p.keys())if(p.getAll(k).length!==1)bad=true;const m=p.get('mode');if(!['number','roman','date'].includes(m)||!['0','1'].includes(p.get('extended')))bad=true;if(bad)error('LINK_INVALID');else{const s={mode:m,input:p.get('input')??'',extended:p.get('extended')==='1',...(m==='date'?{order:p.get('order')}:{})};show(s);run(s,false);}}
else run(state(),false);
