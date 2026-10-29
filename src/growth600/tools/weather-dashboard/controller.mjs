import { createMetWeatherRequest, parseWeatherCache, readLimitedWeatherResponse, readMetForecast, WEATHER_API, WEATHER_CACHE_KEY } from './logic.mjs';

const root=document.querySelector('[data-tool="weather-dashboard"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');let busy=false;let fallbackCache=null;let rateLimitUntil=0;
  const announce=(message,error=false)=>{status.textContent=message;status.classList.toggle('status--error',error);};
  const node=(tag,text)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=String(text);return element;};
  const clear=()=>{content.replaceChildren();result.hidden=true;announce('');};
  const getCache=()=>{try{const stored=parseWeatherCache(sessionStorage.getItem(WEATHER_CACHE_KEY));if(stored)fallbackCache=stored;}catch{}return parseWeatherCache(fallbackCache?JSON.stringify(fallbackCache):null);};
  const saveCache=(value)=>{fallbackCache=value;try{sessionStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify(value));}catch{}}
  const present=(forecast,request,cached)=>{
    content.replaceChildren();content.append(node('h3',`${copy.fields.forecastFor}: ${request.latitude}, ${request.longitude}`));
    content.append(node('p',`${copy.fields.updated}: ${new Intl.DateTimeFormat(document.documentElement.lang||undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(forecast.updatedAt))}`));
    content.append(node('p',cached?copy.messages.cached:copy.messages.fresh));
    const current=forecast.current;const summary=node('dl');
    const addPair=(label,value)=>{summary.append(node('dt',label),node('dd',value));};
    addPair(copy.fields.temperature,`${current.temperature} °C`);addPair(copy.fields.conditions,copy.fields[`condition_${current.condition}`]??copy.fields.condition_unknown);
    if(current.humidity!==null)addPair(copy.fields.humidity,`${Math.round(current.humidity)}%`);
    if(current.wind!==null)addPair(copy.fields.wind,`${current.wind} m/s`);
    if(current.precipitation!==null)addPair(copy.fields.precipitation,`${current.precipitation} mm`);
    content.append(summary);
    if(forecast.hours.length){content.append(node('h4',copy.fields.upcomingHours));const list=node('ol');for(const hour of forecast.hours){const time=new Intl.DateTimeFormat(document.documentElement.lang||undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(hour.time));const condition=copy.fields[`condition_${hour.condition}`]??copy.fields.condition_unknown;const precipitation=hour.precipitation===null?'':` · ${copy.fields.precipitationShort} ${hour.precipitation} mm`;list.append(node('li',`${time}: ${hour.temperature} °C · ${condition}${precipitation}`));}content.append(list);}
    if(forecast.days.length){content.append(node('h4',copy.fields.dailyForecast));const list=node('ul');for(const day of forecast.days){const date=new Intl.DateTimeFormat(document.documentElement.lang||undefined,{weekday:'short',month:'short',day:'numeric'}).format(new Date(`${day.date}T12:00:00`));const condition=copy.fields[`condition_${day.condition}`]??copy.fields.condition_unknown;list.append(node('li',`${date}: ${Math.round(day.min)}–${Math.round(day.max)} °C · ${condition}`));}content.append(list);}
    const attribution=node('p',copy.fields.attribution);attribution.className='hint';content.append(attribution);
    const links=node('p');const source=node('a',copy.fields.officialSource);source.href='https://api.met.no/weatherapi/locationforecast/2.0/documentation';source.target='_blank';source.rel='noopener noreferrer';const license=node('a',copy.fields.license);license.href='https://docs.api.met.no/doc/License.html';license.target='_blank';license.rel='noopener noreferrer';const terms=node('a',copy.fields.terms);terms.href='https://api.met.no/doc/TermsOfService';terms.target='_blank';terms.rel='noopener noreferrer';links.append(source,document.createTextNode(' · '),license,document.createTextNode(' · '),terms);content.append(links);
    result.hidden=false;announce(cached?copy.messages.cached:copy.messages.complete);
  };
  const useLocation=node('button',copy.actions.useLocation);useLocation.type='button';useLocation.className='button button--secondary';form.querySelector('.actions')?.append(useLocation);
  useLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){announce(copy.messages.locationUnavailable,true);return;}
    useLocation.disabled=true;announce(copy.messages.locating);
    navigator.geolocation.getCurrentPosition((position)=>{form.elements.namedItem('latitude').value=String(position.coords.latitude);form.elements.namedItem('longitude').value=String(position.coords.longitude);useLocation.disabled=false;announce(copy.messages.locationReady);},()=>{useLocation.disabled=false;announce(copy.messages.locationDenied,true);},{enableHighAccuracy:false,maximumAge:0,timeout:10_000});
  });
  form.addEventListener('reset',()=>queueMicrotask(clear));
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();if(busy)return;clear();let request;
    try{request=createMetWeatherRequest(form.elements.namedItem('latitude').value,form.elements.namedItem('longitude').value);}catch{announce(copy.messages.invalidCoordinates,true);return;}
    const timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';const cached=getCache();if(cached?.key===request.key){try{present(readMetForecast(JSON.parse(cached.forecastJson),timeZone),request,true);return;}catch{}}
    if(cached&&cached.expiresAt>Date.now()){announce(copy.messages.waitUntilExpiry.replace('{time}',new Intl.DateTimeFormat(document.documentElement.lang||undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(cached.expiresAt))),true);return;}
    if(rateLimitUntil>Date.now()){announce(copy.messages.rateLimit,true);return;}
    busy=true;const submit=form.querySelector('[type="submit"]');submit.disabled=true;useLocation.disabled=true;announce(copy.messages.loading);
    const abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),12_000);
    try{
      const response=await fetch(request.url,{method:'GET',mode:'cors',credentials:'omit',redirect:'error',referrerPolicy:'origin',signal:abort.signal});
      if(response.status===429)throw new Error('rate');if(!response.ok)throw new Error('service');
      if(!response.headers.get('content-type')?.toLowerCase().includes('application/json'))throw new Error('format');
      const payload=JSON.parse(await readLimitedWeatherResponse(response));const forecast=readMetForecast(payload,timeZone);const expiryHeader=Date.parse(response.headers.get('expires')??'');const expiresAt=Number.isFinite(expiryHeader)&&expiryHeader>Date.now()?expiryHeader:Date.now()+15*60*1000;
      saveCache({key:request.key,expiresAt,forecastJson:JSON.stringify(forecast)});present(forecast,request,false);
    }catch(error){if(error.message==='rate')rateLimitUntil=Date.now()+30*60*1000;announce(error.name==='AbortError'?copy.messages.timeout:error.message==='rate'?copy.messages.rateLimit:copy.messages.serviceError,true);result.hidden=true;}
    finally{clearTimeout(timeout);busy=false;submit.disabled=false;useLocation.disabled=false;}
  });
}
