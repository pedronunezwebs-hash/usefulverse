export const HANDWRITING_LIMITS = Object.freeze({ maxCharacters: 12000, maxPages: 5, width: 1240, height: 1754, margin: 105 });

export function prepareHandwritingText(input, locale = 'en', direction = 'auto') {
  const text=String(input??'').replace(/\r\n?/gu,'\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu,'');
  if(!text.trim())throw new RangeError('Enter some text first.');
  if([...text].length>HANDWRITING_LIMITS.maxCharacters)throw new RangeError(`Keep the text under ${HANDWRITING_LIMITS.maxCharacters.toLocaleString(locale)} characters.`);
  if(!['auto','ltr','rtl'].includes(direction))throw new RangeError('Choose automatic, left-to-right or right-to-left direction.');
  const resolvedDirection=direction==='auto'?(/[\u0590-\u08ff]/u.test(text)?'rtl':'ltr'):direction;
  const paragraphs=text.split('\n').map((line)=>line.trim());
  const words=paragraphs.map((line)=>{
    if(!line)return [''];
    if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter(locale,{granularity:'word'}).segment(line)].map(({segment})=>segment);
    return line.split(/(\s+)/u).filter(Boolean);
  });
  return Object.freeze({paragraphs:Object.freeze(words.map(Object.freeze)),direction:resolvedDirection,characterCount:[...text].length});
}

export function handwritingRandom(seed) {
  let value=(Number(seed)>>>0)||0x6d2b79f5;
  return ()=>{value=(value+0x6d2b79f5)>>>0;let t=value;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
}
