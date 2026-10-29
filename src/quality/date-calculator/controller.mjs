// Critical styles render immediately; enable the complete stylesheet once fetched.
const fullStyles = document.getElementById('full-styles');
if (fullStyles) {
  const enableStyles = () => { fullStyles.media = 'all'; };
  fullStyles.addEventListener('load', enableStyles, { once: true });
  if (fullStyles.sheet) enableStyles();
}
import { betweenCivil, shiftCivil, longDate, localToday, stateFromURL, stateToURL } from './logic.mjs';
const $ = id => document.getElementById(id);
const data = JSON.parse($('date-copy').textContent), u = data.ui;
let lastState, lastText='';
const mode = () => document.querySelector('input[name=mode]:checked').value;
const count = (n,singular) => `${new Intl.NumberFormat('en').format(n)} ${u.unit[n===1?singular:singular+'s']}`;
const line = (tag,text,className) => { const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el; };
const resetError = () => { $('error').hidden=true;for(const input of document.querySelectorAll('input,select'))input.removeAttribute('aria-invalid'); };
function currentState() {
  return mode()==='between'
    ? {mode:'between',start:$('start').value,end:$('end').value,inclusive:$('inclusive').checked}
    : {mode:'shift',start:$('base').value,units:Object.fromEntries(['years','months','weeks','days'].map(k=>[k,$(k).value])),direction:Number($('direction').value),overflow:$('overflow').value};
}
function clearResult() {
  $('result').replaceChildren(line('p',u.empty));lastState=null;lastText='';
  $('copy').disabled=true;$('share').disabled=true;$('copy-status').textContent='';$('copy-fallback').hidden=true;
}
function setMode(next) {
  document.querySelector(`input[name=mode][value="${next}"]`).checked=true;
  $('between-fields').hidden=next!=='between';$('shift-fields').hidden=next!=='shift';
  resetError();clearResult();
}
function showState(state) {
  setMode(state.mode);
  if(state.mode==='between'){$('start').value=state.start;$('end').value=state.end;$('inclusive').checked=state.inclusive;}
  else{$('base').value=state.start;$('direction').value=String(state.direction);$('overflow').value=state.overflow;for(const key of ['years','months','weeks','days'])$(key).value=state.units[key]??0;}
}
function calculate() {
  resetError();$('copy-fallback').hidden=true;$('copy-status').textContent='';
  const state=currentState();
  try {
    const active=document.getElementById(state.mode==='between'?'between-fields':'shift-fields');
    const nativeInvalid=[...active.querySelectorAll('input')].find(el=>el.validity.badInput||el.validity.rangeUnderflow||el.validity.stepMismatch);
    if(nativeInvalid)throw new RangeError(nativeInvalid.type==='number'?'OFFSET_INTEGER':'DATE_INVALID');
    const output=$('result');output.replaceChildren();
    if(state.mode==='between') {
      const answer=betweenCivil(state.start,state.end,state.inclusive);
      const number=line('p',new Intl.NumberFormat('en').format(answer.days),'result-number');number.id='answer-days';output.append(number,line('p',state.inclusive?u.counted:u.elapsed,'result-label'));
      const dates=line('p','','result-dates');dates.append(line('span',longDate(state.start)),line('span',longDate(state.end)));output.append(dates);
      const metrics=line('dl','','result-metrics');
      const weeks=`${count(answer.weeks,'week')}, ${count(answer.remainder,'day')}`;
      const period=[['years','year'],['months','month'],['days','day']].filter(([key])=>answer.period[key]).map(([key,unit])=>count(answer.period[key],unit)).join(', ')||count(0,'day');
      for(const [label,value]of [[u.weekSpan,weeks],[u.calendarSpan,period]]){const group=document.createElement('div');group.append(line('dt',label),line('dd',value));metrics.append(group);}output.append(metrics,line('p',u.periodNote,'result-note'));
      if(answer.reversed)output.append(line('p',u.reversed,'result-note'));
      lastText=`${longDate(state.start)} → ${longDate(state.end)}\n${answer.days} ${state.inclusive?u.counted:u.elapsed}\n${u.weekSpan}: ${weeks}\n${u.calendarSpan}: ${period}`;
    } else {
      const answer=shiftCivil(state.start,state.units,state.direction,state.overflow);
      output.append(line('p',u.newDate,'result-label'),line('p',longDate(answer.iso),'result-date'));
      const iso=line('time',answer.iso,'result-iso');iso.dateTime=answer.iso;iso.id='answer-date';output.append(iso);
      const units=Object.entries(state.units).filter(([,v])=>Number(v)).map(([key,v])=>count(Number(v),key.slice(0,-1))).join(', ')||count(0,'day');
      output.append(line('p',`${longDate(state.start)} ${state.direction===1?'+':'−'} ${units}`,'result-dates'),line('p',answer.clipped?u.clipped:u.notClipped,'result-note'));
      lastText=`${longDate(state.start)} ${state.direction===1?'+':'−'} ${units}\n${longDate(answer.iso)} (${answer.iso})\n${answer.clipped?u.clipped:u.notClipped}`;
    }
    lastState=state;$('copy').disabled=false;$('share').disabled=false;return true;
  }catch(error){
    clearResult();$('error').hidden=false;$('error').textContent=u.errors[error.message]??u.errors.DATE_INVALID;
    const candidates=state.mode==='between'?[$('start'),$('end')]:[$('base'),...['years','months','weeks','days'].map($)];
    const invalid=candidates.find(el=>!el.validity.valid||el.type==='date'&&!el.value);
    if(invalid){invalid.setAttribute('aria-invalid','true');invalid.focus();}return false;
  }
}
async function copy(text,isLink=false) {
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(text);$('copy-status').textContent=isLink?`${u.copied} ${u.shareNotice}`:u.copied;}
  catch{$('copy-fallback').hidden=false;$('copy-text').value=text;$('copy-text').focus();$('copy-text').select();$('copy-status').textContent=isLink?u.shareNotice:u.copyFallback;}
}
$('date-form').addEventListener('submit',e=>{e.preventDefault();if(calculate())$('result').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
$('date-form').addEventListener('input',()=>{resetError();clearResult();});
$('date-form').addEventListener('change',()=>{resetError();clearResult();});
for(const radio of document.querySelectorAll('input[name=mode]'))radio.addEventListener('change',()=>setMode(radio.value));
$('swap').addEventListener('click',()=>{const a=$('start').value;$('start').value=$('end').value;$('end').value=a;calculate();});
for(const button of document.querySelectorAll('[data-today]'))button.addEventListener('click',()=>{$(button.dataset.today).value=localToday();clearResult();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{showState(data.examples.find(e=>e.id===button.dataset.example));calculate();$('calculator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('date-form').querySelector('div:not([hidden]) input')?.focus({preventScroll:true});});
$('reset').addEventListener('click',()=>{showState({mode:'between',start:localToday(),end:localToday(),inclusive:false});clearResult();});
$('copy').addEventListener('click',()=>copy(lastText));
$('share').addEventListener('click',()=>{if(lastState)copy(location.origin+location.pathname+stateToURL(lastState),true);});
const themeButton=$('theme');
let theme;try{theme=localStorage.getItem('usefulverse-theme');}catch{}
if(!['light','dark'].includes(theme))theme=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
const applyTheme=()=>{document.documentElement.dataset.theme=theme;themeButton.setAttribute('aria-label',theme==='dark'?u.themeLight:u.themeDark);};
applyTheme();themeButton.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';applyTheme();try{localStorage.setItem('usefulverse-theme',theme);}catch{}});
try{const state=stateFromURL(location.search);if(state)showState(state);calculate();}catch{clearResult();$('error').hidden=false;$('error').textContent=u.errors.LINK_INVALID;}
