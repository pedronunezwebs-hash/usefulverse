import { geographicDistance } from '../pending-23/logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root=document.querySelector('[data-tool="geographic-distance-calculator"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const copy=readToolCopy(root);const locale=copy.copyLanguage?.replaceAll('_','-')??undefined;
  form.addEventListener('input',()=>clearResult(root));form.addEventListener('reset',()=>queueMicrotask(()=>clearResult(root)));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();clearResult(root);
    try{
      const rawWaypoints=form.elements.namedItem('waypoints').value.trim();const waypoints=rawWaypoints?rawWaypoints.split(/\r?\n/u).map((line)=>line.trim()).filter(Boolean).map((line)=>{const pair=line.split(';');if(pair.length!==2)throw new RangeError();return{lat:Number(pair[0].trim().replace(',','.')),lon:Number(pair[1].trim().replace(',','.'))};}):[];
      if(waypoints.length>100)throw new RangeError();
      const result=geographicDistance({fromLatitude:readNumber(form,'fromLatitude',{min:-90,max:90}),fromLongitude:readNumber(form,'fromLongitude',{min:-180,max:180}),toLatitude:readNumber(form,'toLatitude',{min:-90,max:90}),toLongitude:readNumber(form,'toLongitude',{min:-180,max:180}),waypoints,unit:form.elements.namedItem('unit').value});
      const rows=[[copy.fields.distance,`${numberFormat(locale,result.distance)} ${copy.fields[result.unit]}`],[copy.fields.initialBearing,result.initialBearing===null?copy.messages.noBearing:`${numberFormat(locale,result.initialBearing,1)}°`],[copy.fields.centralAngleDegrees,`${numberFormat(locale,result.centralAngleDegrees,4)}°`],[copy.fields.segmentCount,numberFormat(locale,result.segmentCount,0)]];showRows(root,rows);
      const actions=document.createElement('div');actions.className='actions pending-result-actions';const serialized=JSON.stringify(result,null,2);const copyButton=document.createElement('button');copyButton.type='button';copyButton.className='button button--secondary';copyButton.textContent=copy.actions.copy;copyButton.addEventListener('click',()=>copyText(root,serialized,copy));const download=document.createElement('button');download.type='button';download.className='button button--secondary';download.textContent=copy.actions.download;download.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([serialized],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='usefulverse-geographic-distance.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});root.querySelector('[data-result-content]').append(actions);actions.append(copyButton,download);announce(root,copy.messages.complete,'success');
    }catch{announce(root,copy.messages.error,'error');}
  });
}
