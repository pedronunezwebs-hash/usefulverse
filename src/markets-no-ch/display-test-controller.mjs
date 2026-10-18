const root = document.querySelector('[data-market-tool="displayTest"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent).fields;
  const select = root.querySelector('[data-display-pattern]'); const stage = root.querySelector('[data-display-stage]');
  const status = root.querySelector('[data-display-status]'); let timer = 0;
  const names = ['Solid red','Solid green','Solid blue','White','Black','Grayscale','Gradient','Grid'];
  const classes = ['red','green','blue','white','black','grayscale','gradient','grid'];
  const labels = [copy.solidRed,copy.solidGreen,copy.solidBlue,copy.white,copy.black,copy.gray,copy.gradient,copy.grid];
  select.replaceChildren(...names.map((name,index)=>{const option=document.createElement('option');option.value=name;option.textContent=labels[index];return option;}));
  const show=()=>{const index=names.indexOf(select.value);stage.className=`display-test-pattern display-test-pattern--${classes[index]}`;stage.setAttribute('aria-label',labels[index]);};
  select.addEventListener('change',show);root.querySelector('[data-display-show]').addEventListener('click',show);
  root.querySelector('[data-display-fullscreen]').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{status.textContent=copy.fullscreenUnsupported;}});
  root.querySelector('[data-display-cycle]').addEventListener('click',(event)=>{if(timer){clearInterval(timer);timer=0;event.currentTarget.textContent=copy.autoCycle;return;}let i=names.indexOf(select.value);timer=setInterval(()=>{if(document.hidden)return;i=(i+1)%names.length;select.value=names[i];show();},5000);event.currentTarget.textContent=copy.stopCycle;});
  document.addEventListener('visibilitychange',()=>{if(timer&&document.hidden)status.textContent=copy.cyclePaused;});show();
}
