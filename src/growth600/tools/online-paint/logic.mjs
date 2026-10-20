export function normalizeBrushSettings(color,size){
  if(typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))throw new RangeError('Choose a valid six-digit color.');
  const brush=Number(size);if(!Number.isFinite(brush)||brush<1||brush>80)throw new RangeError('Brush size must be between 1 and 80 pixels.');
  return Object.freeze({color:color.toUpperCase(),size:brush});
}
export function getCanvasPoint(canvas,clientX,clientY){
  const bounds=canvas.getBoundingClientRect();if(!bounds.width||!bounds.height)throw new RangeError('The drawing canvas is not visible.');
  return Object.freeze({x:Math.max(0,Math.min(canvas.width,(clientX-bounds.left)*canvas.width/bounds.width)),y:Math.max(0,Math.min(canvas.height,(clientY-bounds.top)*canvas.height/bounds.height))});
}
export function drawCanvasSegment(context,from,to,{color,size}){
  if(!context||![from?.x,from?.y,to?.x,to?.y].every(Number.isFinite))throw new TypeError('Valid drawing points are required.');
  const brush=normalizeBrushSettings(color,size);context.save();context.strokeStyle=brush.color;context.lineWidth=brush.size;context.lineCap='round';context.lineJoin='round';context.beginPath();context.moveTo(from.x,from.y);context.lineTo(to.x,to.y);context.stroke();context.restore();
}
