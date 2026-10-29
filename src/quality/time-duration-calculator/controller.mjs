import {duration,stateFromURL,stateToURL} from './logic.mjs';
const $=id=>document.getElementById(id),data=JSON.parse($('time-copy').textContent),u=data.ui;
const styles=$('full-styles');if(styles){const enable=()=>styles.media='all';styles.addEventListener('load',enable,{once:true});if(styles.sheet)enable();}
const el=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
const readMoment=id=>$(id+'-date').value+'T'+$(id+'-time').value;
const writeMoment=(id,text)=>{const [date,time]=text.split('T');$(id+'-date').value=date;$(id+'-time').value=time;};
const deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
let zones;try{zones=Intl.supportedValuesOf('timeZone');}catch{zones=['UTC','America/New_York','Europe/London','Europe/Madrid','Asia/Tokyo','Asia/Kolkata','Asia/Kathmandu','Australia/Lord_Howe','Pacific/Apia'];}
for(const id of ['start-zone','end-zone']){const select=$(id);select.replaceChildren(...[...new Set(['UTC',deviceZone,...zones])].map(z=>{const o=el('option',z.replaceAll('_',' '));o.value=z;return o;}));select.value=deviceZone;}
const setZone=(id,value)=>{if(![...$(id).options].some(o=>o.value===value)){const o=el('option',value);o.value=value;$(id).append(o);}$(id).value=value;};
let lastState,lastText='';const mode=()=>document.querySelector('input[name=mode]:checked').value;
function clear(){lastState=null;lastText='';$('result').replaceChildren(el('p',u.empty));$('copy').disabled=true;$('share').disabled=true;$('copy-fallback').hidden=true;$('copy-status').textContent='';}
function resetError(){$('error').hidden=true;for(const e of document.querySelectorAll('[aria-invalid]'))e.removeAttribute('aria-invalid');}
function setMode(m){document.querySelector(`input[name=mode][value="${m}"]`).checked=true;$('dates-fields').hidden=m!=='dates';$('clock-fields').hidden=m!=='clock';resetError();clear();}
function state(){return mode()==='clock'?{mode:'clock',start:$('clock-start').value,end:$('clock-end').value,nextDay:$('next-day').checked,breakMinutes:$('break').value}:{mode:'dates',start:readMoment('start'),end:readMoment('end'),startZone:$('start-zone').value,endZone:$('end-zone').value,startOccurrence:$('start-occurrence').value,endOccurrence:$('end-occurrence').value,breakMinutes:$('break').value};}
function show(s){setMode(s.mode);$('break').value=s.breakMinutes??0;if(s.mode==='clock'){$('clock-start').value=s.start;$('clock-end').value=s.end;$('next-day').checked=s.nextDay;}else{writeMoment('start',s.start);writeMoment('end',s.end);setZone('start-zone',s.startZone);setZone('end-zone',s.endZone);$('start-occurrence').value=s.startOccurrence??'reject';$('end-occurrence').value=s.endOccurrence??'reject';}}
const nf=new Intl.NumberFormat('en',{maximumFractionDigits:6});
const span=r=>Object.entries(r.parts).filter(([,n])=>n).map(([key,n])=>`${nf.format(n)} ${u.unit[n===1?key.slice(0,-1):key]}`).join(', ')||`0 ${u.unit.seconds}`;
function calculate(){
  resetError();$('copy-status').textContent='';$('copy-fallback').hidden=true;const s=state();
  try{
    const bad=[...document.querySelectorAll(mode()==='clock'?'#clock-fields input,#break':'#dates-fields input,#break')].find(e=>e.validity.badInput||e.validity.rangeUnderflow||e.validity.stepMismatch);
    if(bad){const e=Error(bad.id==='break'?'BREAK_INVALID':'DATE_INVALID');e.field=bad.id;throw e;}
    const r=duration(s),out=$('result'),answer=el('p',span(r),'result-duration');answer.id='answer';out.replaceChildren(answer,el('p',u.elapsed,'result-label'));
    const totals=el('dl','','result-metrics');for(const [label,value]of [[u.totalHours,nf.format(r.totalHours)],[u.totalMinutes,nf.format(r.seconds/60)],[u.totalSeconds,nf.format(r.seconds)],[u.iso,r.iso]]){const group=el('div','');const dd=el('dd',value);if(label===u.totalSeconds)dd.id='total-seconds';group.append(el('dt',label),dd);totals.append(group);}out.append(totals,el('p',u.dayNote,'result-note'));
    if(r.breakMinutes)out.append(el('p',`${u.breakNote}: ${r.breakMinutes} ${u.unit.minutes}. ${u.beforeBreak}: ${nf.format(r.beforeBreakSeconds)} ${u.unit.seconds}.`,'result-note'));
    if(r.reversed)out.append(el('p',u.reversed,'result-note'));
    if(r.start){out.append(el('p',u.zoneNote,'result-note'));for(const endpoint of [r.start,r.end])out.append(el('p',`${endpoint.zone} (${endpoint.offset}) → ${endpoint.utc}`,'instant'));}
    $('zone-status').textContent=s.mode==='dates'?`${s.startZone} → ${s.endZone}`:u.nextDayHint;
    lastState=s;lastText=out.innerText;$('copy').disabled=false;$('share').disabled=false;return true;
  }catch(e){clear();$('error').textContent=u.errors[e.message]??u.errors.DATE_INVALID;$('error').hidden=false;
    let id=e.field;if(id==='start'||id==='end'){if(e.message==='TIME_REPEAT'){document.querySelector('.advanced').open=true;id+='-occurrence';}else if(mode()==='clock')id='clock-'+id;else id+=e.message==='TIME_GAP'?'-time':'-date';}
    const input=$(id??'')??[...document.querySelectorAll(mode()==='clock'?'#clock-fields input':'#dates-fields input')].find(i=>!i.value||!i.validity.valid);
    if(input){input.setAttribute('aria-invalid','true');input.focus();}return false;
  }
}
async function copy(text,isLink=false){try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);$('copy-status').textContent=isLink?u.shareNotice:u.copied;}catch{$('copy-fallback').hidden=false;$('copy-text').value=text;$('copy-text').focus();$('copy-text').select();$('copy-status').textContent=isLink?u.shareNotice:u.copyFallback;}}
$('time-form').addEventListener('submit',e=>{e.preventDefault();if(calculate())$('result').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
for(const radio of document.querySelectorAll('input[name=mode]'))radio.addEventListener('change',()=>setMode(radio.value));
for(const event of ['input','change'])$('time-form').addEventListener(event,()=>{resetError();clear();});
$('swap').addEventListener('click',()=>{const s=state();show({...s,start:s.end,end:s.start,startZone:s.endZone,endZone:s.startZone,startOccurrence:s.endOccurrence,endOccurrence:s.startOccurrence});calculate();});
$('device-zone').addEventListener('click',()=>{setZone('start-zone',deviceZone);setZone('end-zone',deviceZone);resetError();clear();$('zone-status').textContent=deviceZone;});
$('reset').addEventListener('click',()=>{$('time-form').reset();setMode('dates');setZone('start-zone',deviceZone);setZone('end-zone',deviceZone);$('start-date').focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{show(data.examples.find(e=>e.id===button.dataset.example));calculate();$('result').scrollIntoView({block:'nearest',behavior:'instant'});});
$('copy').addEventListener('click',()=>lastText&&copy(lastText));$('share').addEventListener('click',()=>lastState&&copy(new URL(stateToURL(lastState),location.href).href,true));
function setTheme(theme){document.documentElement.dataset.theme=theme;$('theme').setAttribute('aria-label',theme==='dark'?u.themeLight:u.themeDark);}
try{const saved=localStorage.getItem('uv-quality-theme');if(['light','dark'].includes(saved))setTheme(saved);}catch{}
$('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark'||!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches;setTheme(dark?'light':'dark');try{localStorage.setItem('uv-quality-theme',dark?'light':'dark');}catch{}});
try{const shared=stateFromURL(location.search);if(shared)show(shared);calculate();}catch{clear();$('error').hidden=false;$('error').textContent=u.errors.LINK_INVALID;}
