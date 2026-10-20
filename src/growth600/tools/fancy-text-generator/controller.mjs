import { generateFancyText } from '../pending-23/fancy-text.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root=document.querySelector('[data-tool="fancy-text-generator"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const copy=readToolCopy(root);
  const clear=()=>{content.replaceChildren();result.hidden=true;announce(root,'');};
  form.addEventListener('input',clear);form.addEventListener('reset',()=>queueMicrotask(clear));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();clear();
    try{
      const text=form.elements.namedItem('text').value;const items=generateFancyText(text);const list=document.createElement('div');list.className='pending-fancy-text-list';
      for(const item of items){const card=document.createElement('section');card.className='pending-fancy-text-card';const title=copy.fields[`style_${item.id}`]??item.id;const heading=document.createElement('h3');heading.textContent=title;const output=document.createElement('textarea');output.className='pending-fancy-text-output';output.value=item.value;output.readOnly=true;output.setAttribute('aria-label',`${title} — ${copy.fields.resultTitle}`);const button=document.createElement('button');button.type='button';button.className='button button--secondary';button.textContent=copy.actions.copy;button.addEventListener('click',()=>copyText(root,item.value,copy));card.append(heading,output,button);list.append(card);}
      const note=document.createElement('p');note.className='hint';note.textContent=copy.fields.accessibilityNote;content.append(list,note);result.hidden=false;announce(root,copy.messages.complete,'success');
    }catch(error){announce(root,error instanceof RangeError?copy.messages.error:copy.messages.fileError,'error');}
  });
}
