import { announce, readToolCopy } from '../controller-helpers.mjs';

const root=document.querySelector('[data-tool="soundboard"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const copy=readToolCopy(root);let players=[];let urls=[];
  const cleanup=()=>{players.forEach((audio)=>audio.pause());urls.forEach((url)=>URL.revokeObjectURL(url));players=[];urls=[];content.replaceChildren();result.hidden=true;};
  const volume=form.elements.namedItem('volume');volume.addEventListener('input',()=>players.forEach((audio)=>{audio.volume=Number(volume.value);}));
  form.elements.namedItem('files').addEventListener('change',cleanup);form.addEventListener('reset',()=>queueMicrotask(cleanup));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();cleanup();const files=Array.from(form.elements.namedItem('files').files??[]);
    if(!files.length){announce(root,copy.messages.chooseAudio,'error');return;}
    if(files.length>24||files.some((file)=>file.size>25*1024*1024||!file.type.startsWith('audio/'))||files.reduce((total,file)=>total+file.size,0)>100*1024*1024){announce(root,copy.messages.audioLimit,'error');return;}
    const board=document.createElement('div');board.className='pending-soundboard';
    for(const file of files){const url=URL.createObjectURL(file);urls.push(url);const audio=new Audio(url);audio.preload='metadata';audio.volume=Number(volume.value);players.push(audio);const pad=document.createElement('button');pad.type='button';pad.className='button button--secondary pending-soundboard__pad';pad.textContent=file.name;pad.addEventListener('click',async()=>{try{audio.currentTime=0;await audio.play();}catch{announce(root,copy.messages.playbackUnavailable,'error');}});board.append(pad);}
    const stop=document.createElement('button');stop.type='button';stop.className='button button--secondary';stop.textContent=copy.fields.stopAll;stop.addEventListener('click',()=>players.forEach((audio)=>{audio.pause();audio.currentTime=0;}));board.append(stop);content.append(board);result.hidden=false;announce(root,copy.messages.complete,'success');
  });
  const observer=new MutationObserver(()=>{if(!root.isConnected){cleanup();observer.disconnect();}});observer.observe(document.documentElement,{childList:true,subtree:true});
}
