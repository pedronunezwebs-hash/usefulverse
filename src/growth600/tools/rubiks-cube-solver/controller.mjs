import Cube from './vendor/cube.js';
import { copyText } from '../controller-helpers.mjs';
import { exampleRubiksCubeFaces, readRubiksCubeFaces } from './logic.mjs';

  const root=document.querySelector('[data-tool="rubiks-cube-solver"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');const solveButton=form.querySelector('[type="submit"]');const controls=[...form.querySelectorAll('input,textarea,select,button')];let worker=null;let readyPromise=null;let resolveReady=null;let rejectReady=null;let resolveSolve=null;let rejectSolve=null;let busy=false;
  const announce=(message,error=false)=>{status.textContent=message;status.classList.toggle('status--error',error);};
  const clear=()=>{content.replaceChildren();result.hidden=true;announce('');};
  function createWorker(){
    if(worker)return readyPromise;
    try{worker=new Worker(new URL('/assets/cubejs-1.3.2/worker.js',location.href));}
    catch{throw new Error('worker');}
    readyPromise=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
    worker.addEventListener('message',(event)=>{
      if(event.data?.cmd==='init'){if(event.data.status==='ok')resolveReady();else rejectReady(new Error('init'));}
      if(event.data?.cmd==='solve'&&resolveSolve){const resolve=resolveSolve;resolveSolve=null;resolve(event.data.algorithm);}
    });
    worker.addEventListener('error',()=>{rejectReady?.(new Error('worker'));rejectSolve?.(new Error('worker'));resolveSolve=null;rejectSolve=null;worker?.terminate();worker=null;readyPromise=null;resolveReady=null;rejectReady=null;});
    worker.postMessage({cmd:'init'});
    return readyPromise;
  }
  const showSolution=(algorithm)=>{
    content.replaceChildren();
    if(algorithm===null||algorithm===undefined)throw new Error('solve');
    const moves=algorithm.trim()?algorithm.trim().split(/\s+/u):[];
    const count=document.createElement('p');count.textContent=`${copy.fields.moveCount}: ${moves.length}`;content.append(count);
    if(moves.length){const code=document.createElement('p');const codeNode=document.createElement('code');codeNode.textContent=algorithm;code.append(codeNode);content.append(code);const list=document.createElement('ol');list.setAttribute('aria-label',copy.fields.solution);for(let index=0;index<moves.length;index++){const item=document.createElement('li');item.textContent=`${index+1}. ${moves[index]}`;list.append(item);}content.append(list);content.append(document.createElement('p')).lastChild.textContent=copy.fields.notation;const copyButton=document.createElement('button');copyButton.type='button';copyButton.className='button button--secondary';copyButton.textContent=copy.fields.copySolution;copyButton.addEventListener('click',()=>copyText(root,algorithm,copy));content.append(copyButton);}
    else content.append(document.createElement('p')).lastChild.textContent=copy.fields.cubeStateSolved;
    const credit=document.createElement('p');credit.className='hint';const link=document.createElement('a');link.href='https://github.com/ldez/cubejs';link.target='_blank';link.rel='noopener noreferrer';link.textContent=copy.fields.solverCredit;credit.append(link);content.append(credit);result.hidden=false;
  };
  form.addEventListener('submit',async(event)=>{
    event.preventDefault();if(busy)return;clear();let parsed;
    try{const values=Object.fromEntries([...form.querySelectorAll('[data-input]')].map((input)=>[input.dataset.input,input.value]));parsed=readRubiksCubeFaces(values);}
    catch{announce(copy.fields.invalidCube,true);result.hidden=false;return;}
    if(parsed.isSolved){showSolution('');announce(copy.fields.cubeStateSolved);return;}
    busy=true;for(const control of controls)control.disabled=true;announce(copy.messages.preparing);
    try{await createWorker();announce(copy.messages.solving);const algorithm=await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{if(resolveSolve){resolveSolve=null;rejectSolve=null;worker?.terminate();worker=null;readyPromise=null;reject(new Error('timeout'));}},90_000);rejectSolve=reject;resolveSolve=(answer)=>{clearTimeout(timeout);rejectSolve=null;resolve(answer);};worker.postMessage({cmd:'solve',cube:parsed.state});});showSolution(algorithm);announce(copy.messages.complete);}
    catch(error){announce(error.message==='worker'?copy.fields.workerUnavailable:error.message==='timeout'?copy.fields.solverTimeout:copy.fields.solverFailed,true);result.hidden=false;}
    finally{busy=false;for(const control of controls)control.disabled=false;}
  });
  form.querySelector('[data-action="example"]')?.addEventListener('click',()=>{if(busy)return;const example=exampleRubiksCubeFaces();for(const [name,value] of Object.entries(example))form.elements.namedItem(name).value=value;clear();});
  form.addEventListener('reset',()=>queueMicrotask(clear));for(const input of form.querySelectorAll('[data-input]'))input.addEventListener('input',clear);
}
