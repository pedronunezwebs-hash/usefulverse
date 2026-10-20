import { createWiktionaryRequest, extractWiktionaryDefinitions, parseWiktionaryResponse, readLimitedResponse } from './logic.mjs';

const root=document.querySelector('[data-tool="dictionary"]');
if(root){
  const form=root.querySelector('[data-pending-form]');
  const result=root.querySelector('[data-result]');
  const content=root.querySelector('[data-result-content]');
  const status=root.querySelector('[data-status]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');
  let activeRequest=null;
  let requestVersion=0;
  const announce=(message,error=false)=>{status.textContent=message;status.classList.toggle('status--error',error);};
  const node=(tag,text)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=String(text);return element;};
  form.addEventListener('reset',()=>{requestVersion++;activeRequest?.abort();activeRequest=null;form.querySelector('[type="submit"]').disabled=false;content.replaceChildren();result.hidden=true;announce('');});
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    activeRequest?.abort();const version=++requestVersion;
    const input=Object.fromEntries([...form.querySelectorAll('[data-input]')].map((field)=>[field.dataset.input,field.value]));
    content.replaceChildren();result.hidden=true;
    let request;
    try{request=createWiktionaryRequest(input.term,input.language);}
    catch{announce(copy.messages.invalid,true);return;}
    const abort=new AbortController();activeRequest=abort;
    const timeout=setTimeout(()=>abort.abort(),12_000);
    const submit=form.querySelector('[type="submit"]');submit.disabled=true;
    announce(copy.messages.searching);
    try{
      const response=await fetch(request.url,{method:'GET',mode:'cors',credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',headers:{Accept:'application/json'},signal:abort.signal});
      if(!response.ok)throw new Error('http');
      if(!response.headers.get('content-type')?.toLowerCase().includes('application/json'))throw new Error('format');
      const text=await readLimitedResponse(response);
      if(version!==requestVersion)return;
      const payload=parseWiktionaryResponse(text);
      const entry=extractWiktionaryDefinitions(payload,request.languageName);
      const title=entry.title||input.term.trim();
      const heading=node('h3',title);content.append(heading);
      if(entry.definitions.length){const list=node('ol');for(const definition of entry.definitions)list.append(node('li',definition));content.append(list);}
      else content.append(node('p',copy.messages.noDefinitions));
      const encoded=encodeURIComponent(title.replaceAll(' ','_'));
      const links=node('p');
      const article=node('a',copy.fields.entryLink);article.href=`https://en.wiktionary.org/wiki/${encoded}`;article.target='_blank';article.rel='noopener noreferrer';
      const history=node('a',copy.fields.historyLink);history.href=`https://en.wiktionary.org/w/index.php?title=${encoded}&action=history`;history.target='_blank';history.rel='noopener noreferrer';
      links.append(article,document.createTextNode(' · '),history);content.append(links);
      const attribution=node('p',copy.fields.licenseAttribution);attribution.className='hint';content.append(attribution);
      const licenseLink=node('a',copy.fields.licenseLink);licenseLink.href='https://en.wiktionary.org/wiki/Wiktionary:Copyrights';licenseLink.target='_blank';licenseLink.rel='noopener noreferrer';content.append(licenseLink);
      result.hidden=false;announce(entry.definitions.length?copy.messages.complete:copy.messages.noDefinitions);
    }catch(error){
      if(version!==requestVersion)return;
      announce(error.name==='AbortError'?copy.messages.timeout:error.message==='http'?copy.messages.serviceError:copy.messages.lookupError,true);result.hidden=true;
    }finally{clearTimeout(timeout);if(activeRequest===abort){activeRequest=null;submit.disabled=false;}}
  });
}
