import { moveJigsawPiece, shuffledPuzzle, validateLocalImage, validatePixelDimensions } from './planned-tools-logic.mjs';

const $=(selector,root)=>root.querySelector(selector); const svgNs='http://www.w3.org/2000/svg';
function msg(root,key){let dict;try{dict=JSON.parse(root.dataset.plannerMessages||'{}')}catch{dict={}}return dict[key]||key}
function say(root,key,error=false){const node=$('#op-status',root);if(node){node.textContent=msg(root,key);node.className=`tool-status${error?' is-error':''}`}}
function readImage(file,maxBytes,maxPixels){
  validateLocalImage(file,maxBytes,maxPixels);
  return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file);const image=new Image();image.onload=()=>{URL.revokeObjectURL(url);try{validatePixelDimensions(image.naturalWidth,image.naturalHeight,maxPixels);resolve(image)}catch(error){reject(error)}};image.onerror=()=>{URL.revokeObjectURL(url);reject(new TypeError('decode'))};image.src=url;});
}
function canvasBlob(canvas,type='image/png'){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('canvas')),type))}
function makeDownload(link,blob,name){if(link.dataset.url)URL.revokeObjectURL(link.dataset.url);link.href=URL.createObjectURL(blob);link.dataset.url=link.href;link.download=name;link.hidden=false}
function revoke(link){if(link?.dataset.url)URL.revokeObjectURL(link.dataset.url);if(link){link.removeAttribute('href');delete link.dataset.url;link.hidden=true}}

function setupMosaic(root){
  const input=$('[data-mosaic-file]',root),canvas=$('[data-mosaic-canvas]',root),preview=$('[data-mosaic-preview]',root),download=$('[data-mosaic-download]',root);let image=null;
  input.addEventListener('change',async()=>{image=null;revoke(download);const file=input.files?.[0];if(!file)return;try{image=await readImage(file,10*1024*1024,4_000_000);say(root,'Choose an image') }catch(error){input.value='';say(root,error instanceof RangeError?'Choose a PNG, JPEG or WebP image under 10 MB and 4 megapixels.':'This image could not be opened in your browser.',true)}});
  $('[data-mosaic-block]',root).addEventListener('input',(event)=>{$('[data-mosaic-block-label]',root).textContent=`${event.target.value} ${say(root,'pixels')}`});
  root.addEventListener('click',async(event)=>{
    if(event.target.closest('[data-mosaic-create]')){
      if(!image)return say(root,'A mosaic needs an image first.',true);
      try{const width=image.naturalWidth,height=image.naturalHeight;validatePixelDimensions(width,height,4_000_000);const block=Number($('[data-mosaic-block]',root).value);const small=document.createElement('canvas');small.width=Math.max(1,Math.ceil(width/block));small.height=Math.max(1,Math.ceil(height/block));const smallCtx=small.getContext('2d',{willReadFrequently:true});smallCtx.drawImage(image,0,0,small.width,small.height);canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,width,height);ctx.drawImage(small,0,0,width,height);small.width=0;small.height=0;const blob=await canvasBlob(canvas);makeDownload(download,blob,'usefulverse-mosaic.png');const thumb=document.createElement('img');thumb.alt=msg(root,'Mosaic created locally.');thumb.src=URL.createObjectURL(blob);if(preview.dataset.url)URL.revokeObjectURL(preview.dataset.url);preview.dataset.url=thumb.src;preview.replaceChildren(thumb);say(root,'Mosaic created locally.')}
      catch{say(root,'Mosaic processing failed. Try a smaller image.',true)}
    }
    if(event.target.closest('[data-mosaic-clear]')){image=null;input.value='';canvas.width=0;canvas.height=0;preview.replaceChildren();if(preview.dataset.url)URL.revokeObjectURL(preview.dataset.url);delete preview.dataset.url;revoke(download);say(root,'Image cleared.')}
  });
  window.addEventListener('pagehide',()=>{revoke(download);if(preview.dataset.url)URL.revokeObjectURL(preview.dataset.url)},{once:true});
}

function setupJigsaw(root){
  const input=$('[data-jigsaw-file]',root),board=$('[data-jigsaw-board]',root),canvas=$('[data-jigsaw-canvas]',root);let image=null,size=3,pieces=[],selected=null;const URLs=[];
  const release=()=>{for(const url of URLs.splice(0))URL.revokeObjectURL(url);board.replaceChildren()};
  const render=()=>{board.style.setProperty('--jigsaw-size',size);board.replaceChildren();pieces.forEach((piece,index)=>{const button=document.createElement('button');button.type='button';button.className='jigsaw__piece';button.dataset.jigsawIndex=String(index);button.setAttribute('role','gridcell');button.setAttribute('aria-label',msg(root,'Piece {number}').replace('{number}',String(piece+1)));button.setAttribute('aria-pressed',String(selected===index));button.style.backgroundImage=`url("${URLs[piece]}")`;board.append(button)})};
  input.addEventListener('change',async()=>{image=null;release();const file=input.files?.[0];if(!file)return;try{image=await readImage(file,5*1024*1024,1_000_000);say(root,'Choose an image to start.')}catch{input.value='';say(root,'Choose an image under 5 MB and 1 megapixel.',true)}});
  const start=()=>{if(!image)return say(root,'Choose an image to start.',true);try{size=Number($('[data-jigsaw-size]',root).value);const scale=Math.min(1,512/Math.max(image.naturalWidth,image.naturalHeight));canvas.width=Math.max(size,Math.round(image.naturalWidth*scale));canvas.height=Math.max(size,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);release();const tileW=canvas.width/size,tileH=canvas.height/size;board.style.aspectRatio=`${canvas.width}/${canvas.height}`;board.style.setProperty('--jigsaw-tile-ratio',`${tileW}/${tileH}`);for(let piece=0;piece<size*size;piece++){const tile=document.createElement('canvas');tile.width=Math.max(1,Math.ceil(tileW));tile.height=Math.max(1,Math.ceil(tileH));tile.getContext('2d').drawImage(canvas,(piece%size)*tileW,Math.floor(piece/size)*tileH,tileW,tileH,0,0,tile.width,tile.height);URLs.push(tile.toDataURL('image/png'));tile.width=0;tile.height=0}canvas.width=0;canvas.height=0;pieces=shuffledPuzzle(size);selected=null;render();say(root,'Puzzle started.')}catch{say(root,'Choose an image under 5 MB and 1 megapixel.',true)}};
  root.addEventListener('click',(event)=>{
    if(event.target.closest('[data-jigsaw-start]'))start();
    if(event.target.closest('[data-jigsaw-shuffle]')){if(!URLs.length)return start();pieces=shuffledPuzzle(size);selected=null;render();say(root,'Puzzle started.')}
    if(event.target.closest('[data-jigsaw-clear]')){image=null;input.value='';release();canvas.width=0;canvas.height=0;say(root,'Image cleared.')}
    const button=event.target.closest('[data-jigsaw-index]');if(button){const index=Number(button.dataset.jigsawIndex);if(selected===null){selected=index;render();return}if(selected===index){selected=null;render();return}pieces=moveJigsawPiece(pieces,size,selected,index);selected=null;render();if(pieces.every((piece,slot)=>piece===slot))say(root,'Puzzle solved!');else say(root,'Puzzle started.')}
  });
  window.addEventListener('pagehide',release,{once:true});
}

export function setupImagePuzzleTool(id,root){if(id==='photo-mosaic-maker')return setupMosaic(root);if(id==='jigsaw-puzzle')return setupJigsaw(root)}
