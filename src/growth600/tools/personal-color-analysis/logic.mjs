export const PERSONAL_PALETTES=Object.freeze({
  spring:Object.freeze(['#E76F51','#F4A261','#E9C46A','#F6BD60','#84A59D','#8AB17D','#E5989B','#F28482']),
  summer:Object.freeze(['#7D8CA3','#9AA6B2','#A8B4C4','#C4A7B7','#B8C0D9','#8F9BB3','#D3B6C6','#9FB7B2']),
  autumn:Object.freeze(['#8D5524','#B5651D','#C97B3B','#D6A15D','#6B705C','#A3A380','#8A4F3D','#C17C74']),
  winter:Object.freeze(['#1D3557','#2A6F97','#4A4E9B','#6A4C93','#B5173A','#D62828','#147D74','#172A3A']),
});
export function getPersonalPalette(name){if(!Object.hasOwn(PERSONAL_PALETTES,name))throw new RangeError('Choose a palette family.');return PERSONAL_PALETTES[name];}
export function photoCanvasDimensions(width,height,maxWidth=720,maxHeight=540){if(![width,height,maxWidth,maxHeight].every(Number.isFinite)||width<=0||height<=0||maxWidth<1||maxHeight<1)throw new RangeError('Photo dimensions must be positive.');const scale=Math.min(1,maxWidth/width,maxHeight/height);return Object.freeze({width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))});}
export function nearestPaletteSwatch(hex,palette){if(!/^#[0-9a-f]{6}$/i.test(hex)||!Array.isArray(palette)||palette.some((v)=>!/^#[0-9a-f]{6}$/i.test(v)))throw new RangeError('Provide valid RGB colors.');const rgb=(c)=>c.slice(1).match(/../g).map((v)=>parseInt(v,16));const [r,g,b]=rgb(hex);return palette.map((color,index)=>{const [pr,pg,pb]=rgb(color);return{color,index,distance:(r-pr)**2+(g-pg)**2+(b-pb)**2};}).sort((a,b)=>a.distance-b.distance).slice(0,3).map(({color,index})=>Object.freeze({color,index}));}
