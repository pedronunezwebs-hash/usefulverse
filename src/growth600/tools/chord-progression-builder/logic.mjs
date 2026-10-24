const KEYS=Object.freeze({C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11});
const NAMES=Object.freeze(['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B']);
const ROMAN=Object.freeze(['I','II','III','IV','V','VI','VII']);
const MAJOR=[0,2,4,5,7,9,11];const MINOR=[0,2,3,5,7,8,10];
export function buildChordProgression({key='C',scale='major',degrees='1 5 6 4',inversion=0}={}){
  if(!Object.hasOwn(KEYS,key)||!['major','minor'].includes(scale))throw new RangeError('Choose a supported key and scale.');
  const parsed=String(degrees).trim().split(/[\s,;]+/).filter(Boolean).map(Number);if(!parsed.length||parsed.length>16||parsed.some((n)=>!Number.isInteger(n)||n<1||n>7))throw new RangeError('Enter 1 to 16 scale degrees from 1 to 7.');
  const inv=Number(inversion);if(!Number.isInteger(inv)||inv<0||inv>2)throw new RangeError('Choose root position, first inversion, or second inversion.');
  const steps=scale==='major'?MAJOR:MINOR;const root=KEYS[key];
  return Object.freeze(parsed.map((degree,index)=>{
    const ix=degree-1;const pitches=[0,2,4].map((offset)=>root+steps[(ix+offset)%7]+12*Math.floor((ix+offset)/7));
    const intervals=[pitches[1]-pitches[0],pitches[2]-pitches[1]];const quality=intervals[0]===4&&intervals[1]===3?'major':intervals[0]===3&&intervals[1]===4?'minor':intervals[0]===3&&intervals[1]===3?'diminished':'other';
    for(let n=0;n<inv;n+=1)pitches.push(pitches.shift()+12);
    const midi=Object.freeze(pitches.map((pc)=>48+pc));const label=`${NAMES[(root+steps[ix])%12]}${quality==='minor'?'m':quality==='diminished'?'°':''}`;
    const numeral=scale==='major'?(quality==='major'?ROMAN[ix]:ROMAN[ix].toLowerCase()): (quality==='major'?ROMAN[ix]:ROMAN[ix].toLowerCase());
    return Object.freeze({index,degree,numeral,label,quality,inversion:inv,midi,notes:Object.freeze(midi.map((note)=>`${NAMES[note%12]}${Math.floor(note/12)-1}`))});
  }));
}

function variableLength(value){let n=value&0x7F;while((value>>=7)){n=(n<<8)|((value&0x7F)|0x80);}const bytes=[];while(true){bytes.push(n&0xFF);if(n&0x80)n>>=8;else break;}return bytes;}
function ascii(text){return [...text].map((ch)=>ch.charCodeAt(0));}
function chunk(id,data){return [...ascii(id),(data.length>>>24)&255,(data.length>>>16)&255,(data.length>>>8)&255,data.length&255,...data];}
export function encodeProgressionMidi(chords,{tempo=120,beatsPerChord=1}={}){
  if(!Array.isArray(chords)||!chords.length||chords.length>16||!Number.isInteger(tempo)||tempo<40||tempo>240||!Number.isFinite(beatsPerChord)||beatsPerChord<0.25||beatsPerChord>8)throw new RangeError('Choose a valid progression and MIDI tempo.');
  const ppq=480;const events=[{t:0,order:0,b:[0xFF,0x51,0x03,(60000000/tempo>>>16)&255,(60000000/tempo>>>8)&255,60000000/tempo&255]}];
  chords.forEach((chord,i)=>{for(const note of chord.midi){if(!Number.isInteger(note)||note<0||note>127)throw new RangeError('MIDI note is out of range.');const start=Math.round(i*beatsPerChord*ppq);const end=start+Math.round(beatsPerChord*ppq*0.85);events.push({t:start,order:1,b:[0x90,note,88]},{t:end,order:0,b:[0x80,note,0]});}});
  events.sort((a,b)=>a.t-b.t||a.order-b.order);const track=[];let previous=0;for(const event of events){track.push(...variableLength(event.t-previous),...event.b);previous=event.t;}track.push(0,0xFF,0x2F,0);
  return new Uint8Array([...chunk('MThd',[0,0,0,1,1,0xE0]),...chunk('MTrk',track)]);
}
