import { playRockPaperScissors } from '../pending-23/logic.mjs';
import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';

const root=document.querySelector('[data-tool="rock-paper-scissors"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const copy=readToolCopy(root);root._rpsScore={win:0,loss:0,draw:0};
  const clear=()=>clearResult(root);form.addEventListener('input',clear);form.addEventListener('reset',()=>queueMicrotask(clear));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();clear();
    try{
      const round=playRockPaperScissors({choice:form.elements.namedItem('choice').value});root._rpsScore[round.outcome]++;
      const message={win:copy.fields.youWin,loss:copy.fields.youLose,draw:copy.fields.itsATie}[round.outcome];const section=document.createElement('section');section.className='pending-rps-round';section.setAttribute('aria-live','polite');const heading=document.createElement('h3');heading.textContent=message;const you=document.createElement('p');you.textContent=`${copy.fields.youChose}: ${copy.fields[round.choice]}`;const computer=document.createElement('p');computer.textContent=`${copy.fields.computerChose}: ${copy.fields[round.computerChoice]}`;const score=root._rpsScore;const scoreboard=document.createElement('p');scoreboard.className='pending-rps-score';scoreboard.textContent=`${copy.fields.score}: ${copy.fields.wins} ${score.win} · ${copy.fields.losses} ${score.loss} · ${copy.fields.draws} ${score.draw}`;const reset=document.createElement('button');reset.type='button';reset.className='button button--secondary';reset.textContent=copy.fields.resetScore;reset.addEventListener('click',()=>{score.win=0;score.loss=0;score.draw=0;clear();});section.append(heading,you,computer,scoreboard,reset);content.replaceChildren(section);result.hidden=false;announce(root,copy.messages.complete,'success');
    }catch{announce(root,copy.messages.error,'error');}
  });
}
