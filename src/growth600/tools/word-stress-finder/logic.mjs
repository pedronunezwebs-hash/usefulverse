const VOWELS = 'aeiouáéíóúü';
const STRONG = new Set(['a','e','o','á','é','ó']);
const ACCENTED = new Set(['á','é','í','ó','ú']);
const ONSETS = new Set(['bl','br','ch','cl','cr','dr','fl','fr','gl','gr','ll','pl','pr','rr','tr','tl']);

function isVowel(ch) { return VOWELS.includes(ch); }
function splitSyllables(word) {
  const marked = word.replace(/qu([ei])/gu, 'q~$1').replace(/gu([ei])/gu, 'g~$1');
  const nuclei=[];
  for(let i=0;i<marked.length;){
    if(!isVowel(marked[i])){i++;continue;}
    let start=i,end=i+1;i++;
    while(i<marked.length&&isVowel(marked[i])){
      const prev=marked[i-1],next=marked[i];
      const hiatus=ACCENTED.has(prev)&&['í','ú'].includes(prev)||ACCENTED.has(next)&&['í','ú'].includes(next)||STRONG.has(prev)&&STRONG.has(next);
      if(hiatus)break;
      end=++i;
    }
    nuclei.push({start,end});
    if(i===start+1&&isVowel(marked[i]))continue;
  }
  if(!nuclei.length)throw new RangeError('Word has no supported vowel nucleus.');
  const cuts=[0];
  for(let j=0;j<nuclei.length-1;j++){
    const left=nuclei[j],right=nuclei[j+1],between=marked.slice(left.end,right.start),length=between.length;
    let onset=1;
    if(length===0)onset=0;
    else if(length===2&&ONSETS.has(between.toLowerCase()))onset=2;
    else if(length>=3&&ONSETS.has(between.slice(-2).toLowerCase()))onset=2;
    cuts.push(right.start-onset);
  }
  cuts.push(marked.length);
  return cuts.slice(0,-1).map((start,i)=>word.slice(start,cuts[i+1]));
}

export function analyzeSpanishWordStress(input) {
  const word=String(input??'').trim().toLowerCase().normalize('NFC');
  if(!word||word.length>60||!/^[a-záéíóúüñ]+$/u.test(word))throw new RangeError('Enter one Spanish word using letters only.');
  const marks=[...word].filter(ch=>ACCENTED.has(ch));
  if(marks.length>1)throw new RangeError('This helper supports at most one written accent mark.');
  const syllables=splitSyllables(word);
  let stressedIndex;
  if(marks.length){
    const markPos=word.search(/[áéíóú]/u);
    let offset=0;stressedIndex=syllables.findIndex(s=>{const start=offset;offset+=s.length;return markPos>=start&&markPos<offset;});
  } else {
    const endsVowelOrNs=/[aeiouáéíóúüns]$/u.test(word);
    stressedIndex=Math.max(0,syllables.length-(endsVowelOrNs?2:1));
  }
  if(stressedIndex<0)throw new RangeError('Could not locate the written stress mark.');
  const fromEnd=syllables.length-1-stressedIndex;
  const key=fromEnd===0?'acute':fromEnd===1?'grave':fromEnd===2?'esdrujula':'sobresdrujula';
  const markedPositionRequiresAccent=marks.length===1&&(key==='esdrujula'||key==='sobresdrujula'||key==='acute'&&/(?:[aeiouáéíóúü]|n|s)$/u.test(word)||key==='grave'&&!/[aeiouáéíóúüns]$/u.test(word));
  return Object.freeze({word,syllables:Object.freeze(syllables),stressedIndex,stress:syllables[stressedIndex],rule:key,hasWrittenAccent:marks.length===1,markedPositionRequiresAccent});
}
