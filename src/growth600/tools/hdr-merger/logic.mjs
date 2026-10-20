const MAX_IMAGES=5,MAX_DIMENSION=2048,MAX_EV=8;
function srgbToLinear(value){const v=value/255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}
function linearToSrgb(value){const v=Math.max(0,Math.min(1,value));return Math.round(255*(v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055));}

export function mergeExposureImages({images,exposures,toneStops=0}={}){
  if(!Array.isArray(images)||images.length<2||images.length>MAX_IMAGES||!Array.isArray(exposures)||exposures.length!==images.length)throw new RangeError('Choose 2–5 images and one exposure value for each.');
  const width=Number(images[0]?.width),height=Number(images[0]?.height);
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>MAX_DIMENSION||height>MAX_DIMENSION)throw new RangeError('Image dimensions exceed the supported limit.');
  if(!Number.isFinite(Number(toneStops))||Number(toneStops)<-3||Number(toneStops)>3)throw new RangeError('Tone adjustment must be between −3 and 3 EV.');
  for(let i=0;i<images.length;i++){
    const image=images[i];
    if(image.width!==width||image.height!==height||!image.data||image.data.length!==width*height*4)throw new RangeError('All images must have the same valid dimensions.');
    if(!Number.isFinite(Number(exposures[i]))||Number(exposures[i]) < -MAX_EV||Number(exposures[i])>MAX_EV)throw new RangeError('Exposure offsets must be between −8 and 8 EV.');
  }
  const output=new Uint8ClampedArray(width*height*4),gain=2**Number(toneStops),scales=exposures.map(ev=>2**Number(ev));
  for(let p=0;p<width*height;p++){
    let r=0,g=0,b=0,total=0;
    for(let i=0;i<images.length;i++){
      const data=images[i].data,index=p*4,alpha=data[index+3]/255;
      if(alpha<=0)continue;
      const lum=(data[index]+data[index+1]+data[index+2])/(3*255),weight=Math.max(.05,1-Math.abs(2*lum-1))*alpha,scale=scales[i];
      r+=srgbToLinear(data[index])/scale*weight;g+=srgbToLinear(data[index+1])/scale*weight;b+=srgbToLinear(data[index+2])/scale*weight;total+=weight;
    }
    const index=p*4;
    if(total){output[index]=linearToSrgb((r/total)*gain/((r/total)*gain+1));output[index+1]=linearToSrgb((g/total)*gain/((g/total)*gain+1));output[index+2]=linearToSrgb((b/total)*gain/((b/total)*gain+1));output[index+3]=255;}
  }
  return Object.freeze({width,height,data:output});
}
