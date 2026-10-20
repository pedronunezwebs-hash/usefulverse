import { exportSurfaceObj, sampleHeightField } from './logic.mjs';

const root = document.querySelector('[data-tool="3d-function-grapher"]');
if (root) {
  const form = root.querySelector('[data-3d-graph-form]'), canvas = root.querySelector('[data-surface-canvas]');
  const ctx = canvas.getContext('2d'), result = root.querySelector('[data-result]'), content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]'), exportButton = root.querySelector('[data-export]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let mesh, yaw = -0.65, pitch = 0.75, drag;
  function draw() {
    if (!mesh) return;
    const finite = mesh.vertices.filter(v => v.z !== null), extent = Math.max(...finite.map(v => Math.abs(v.z)), 1);
    const points = mesh.vertices.map(v => {
      if (v.z === null) return null;
      const x=v.x*Math.cos(yaw)-v.y*Math.sin(yaw), y=v.x*Math.sin(yaw)+v.y*Math.cos(yaw);
      return { x:400+x*29, y:260+(y*Math.sin(pitch)-v.z/extent*3.5)*25, d:y*Math.cos(pitch)+v.z/extent*3.5 };
    });
    ctx.clearRect(0,0,800,520); ctx.fillStyle='#fff'; ctx.fillRect(0,0,800,520);
    const triangles=mesh.faces.map(face=>({p:face.map(i=>points[i]),z:face.reduce((s,i)=>s+points[i].d,0)/3,surfaceZ:face.reduce((s,i)=>s+(mesh.vertices[i].z??0),0)/3})).sort((a,b)=>a.z-b.z);
    for(const t of triangles){ctx.beginPath();ctx.moveTo(t.p[0].x,t.p[0].y);ctx.lineTo(t.p[1].x,t.p[1].y);ctx.lineTo(t.p[2].x,t.p[2].y);ctx.closePath();const shade=Math.max(-1,Math.min(1,t.surfaceZ/extent));ctx.fillStyle=`hsl(${215-shade*55} 68% ${48+shade*12}%)`;ctx.fill();ctx.strokeStyle='rgba(15,23,42,.42)';ctx.lineWidth=.65;ctx.stroke();}
  }
  form.addEventListener('submit', event => { event.preventDefault(); try { mesh=sampleHeightField({expression:form.elements.namedItem('expression').value,minimum:form.elements.namedItem('minimum').value,maximum:form.elements.namedItem('maximum').value,grid:form.elements.namedItem('grid').value}); draw(); result.hidden=false; exportButton.disabled=!mesh.faces.length; content.textContent=`${mesh.vertices.length} ${copy.fields.vertices}; ${mesh.faces.length} ${copy.fields.triangles}.`; status.textContent=copy.messages.complete; status.classList.remove('status--error'); } catch { mesh=undefined; result.hidden=true; status.textContent=copy.messages.error; status.classList.add('status--error'); } });
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag||!mesh)return;yaw+=(e.clientX-drag.x)*.01;pitch=Math.max(-1.3,Math.min(1.3,pitch+(e.clientY-drag.y)*.01));drag={x:e.clientX,y:e.clientY};draw();});
  canvas.addEventListener('pointerup',()=>{drag=undefined;});
  canvas.addEventListener('keydown',e=>{const step=.12;if(e.key==='ArrowLeft')yaw-=step;else if(e.key==='ArrowRight')yaw+=step;else if(e.key==='ArrowUp')pitch=Math.min(1.3,pitch+step);else if(e.key==='ArrowDown')pitch=Math.max(-1.3,pitch-step);else return;e.preventDefault();draw();});
  exportButton.addEventListener('click',()=>{if(!mesh)return;const url=URL.createObjectURL(new Blob([exportSurfaceObj(mesh)],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='usefulverse-surface.obj';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  form.addEventListener('reset',()=>queueMicrotask(()=>{mesh=undefined;result.hidden=true;content.replaceChildren();ctx.clearRect(0,0,800,520);exportButton.disabled=true;status.textContent='';status.classList.remove('status--error');}));
}
