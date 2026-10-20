export const WIKTIONARY_LANGUAGES=Object.freeze({en:'English',es:'Spanish',fr:'French','pt-BR':'Portuguese',de:'German',ja:'Japanese',ko:'Korean',id:'Indonesian',hi:'Hindi',ar:'Arabic','zh-CN':'Chinese',bn:'Bengali',ru:'Russian',ur:'Urdu',tr:'Turkish',vi:'Vietnamese',it:'Italian','zh-TW':'Chinese',bg:'Bulgarian',ca:'Catalan',nl:'Dutch',el:'Greek',ms:'Malay',pl:'Polish',sv:'Swedish',th:'Thai',uk:'Ukrainian',sw:'Swahili',mr:'Marathi',ha:'Hausa',fil:'Tagalog',ta:'Tamil',fa:'Persian',am:'Amharic',gu:'Gujarati','nb-NO':'Norwegian Bokmål',te:'Telugu'});

export function createWiktionaryRequest(word,language){
  const term=String(word??'').trim();
  if(!term||term.length>80||/[\u0000-\u001f\u007f]/u.test(term))throw new RangeError('Enter one word or short phrase (up to 80 characters).');
  if(!Object.hasOwn(WIKTIONARY_LANGUAGES,language))throw new RangeError('Choose a supported entry language.');
  const url=new URL('https://en.wiktionary.org/w/api.php');
  url.search=new URLSearchParams({action:'parse',page:term,prop:'text',format:'json',origin:'*'}).toString();
  return Object.freeze({url:url.href,languageName:WIKTIONARY_LANGUAGES[language]});
}

export function extractWiktionaryDefinitions(payload,languageName,DOMParserClass=globalThis.DOMParser){
  if(!payload||payload.error||typeof payload.parse?.text?.['*']!=='string'||!DOMParserClass)throw new TypeError('The dictionary response could not be read.');
  const document=new DOMParserClass().parseFromString(payload.parse.text['*'],'text/html');
  const headings=[...document.querySelectorAll('h2')];
  const heading=headings.find((element)=>(element.querySelector('.mw-headline')?.textContent??element.textContent).replace(/\[edit\]/giu,'').trim()===languageName);
  if(!heading)return Object.freeze({title:String(payload.parse.title??''),revision:Number(payload.parse.revid)||null,language:languageName,definitions:Object.freeze([])});
  const definitions=[];let sibling=heading.parentElement?.nextElementSibling??heading.nextElementSibling;
  while(sibling&&!/^H2$/u.test(sibling.tagName)&&!sibling.querySelector('h2')){
    for(const list of sibling.querySelectorAll('ol')){
      if(list.parentElement?.closest('ol'))continue;
      for(const item of list.children){
        if(item.tagName!=='LI')continue;
      const clone=item.cloneNode(true);for(const nested of clone.querySelectorAll('ol,ul,sup,.reference,.mw-editsection'))nested.remove();
      const text=clone.textContent.replace(/\s+/gu,' ').trim();if(text&& !definitions.includes(text))definitions.push(text.slice(0,500));
      if(definitions.length===3)break;
      }
      if(definitions.length===3)break;
    }
    if(definitions.length===3)break;sibling=sibling.nextElementSibling;
  }
  return Object.freeze({title:String(payload.parse.title??''),revision:Number(payload.parse.revid)||null,language:languageName,definitions:Object.freeze(definitions)});
}

export function parseWiktionaryResponse(text){
  if(typeof text!=='string'||text.length>1_000_000)throw new RangeError('The dictionary response is too large.');
  let payload;try{payload=JSON.parse(text);}catch{throw new TypeError('The dictionary response was not valid JSON.');}
  if(payload?.error)throw new Error(String(payload.error.info??'Wiktionary could not find that entry.').slice(0,240));
  return payload;
}

export async function readLimitedResponse(response,limit=1_000_000){
  if(!response?.body?.getReader){const text=await response.text();if(text.length>limit)throw new RangeError('The dictionary response is too large.');return text;}
  const reader=response.body.getReader();const chunks=[];let size=0;
  try{
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError('The dictionary response is too large.');}chunks.push(value);}
  }finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  return new TextDecoder().decode(bytes);
}

const RELATION_HEADINGS=Object.freeze({
  en:{synonyms:['synonyms'],antonyms:['antonyms']},es:{synonyms:['sinónimos','sinonimos'],antonyms:['antónimos','antonimos']},fr:{synonyms:['synonymes'],antonyms:['antonymes','antonymes']},
  de:{synonyms:['synonyme'],antonyms:['antonyme']},pt:{synonyms:['sinónimos','sinonimos'],antonyms:['antónimos','antonimos']},it:{synonyms:['sinonimi'],antonyms:['antonimi']},
  nl:{synonyms:['synoniemen'],antonyms:['antoniemen']},ru:{synonyms:['синонимы'],antonyms:['антонимы']},ja:{synonyms:['類義語','同義語'],antonyms:['対義語','反義語']},ko:{synonyms:['동의어'],antonyms:['반의어']},
  zh:{synonyms:['同义词','同義詞'],antonyms:['反义词','反義詞']},ar:{synonyms:['مترادفات'],antonyms:['أضداد','متضادات']},hi:{synonyms:['समानार्थी'],antonyms:['विलोम']},tr:{synonyms:['eş anlamlılar','eş anlamlı sözcükler'],antonyms:['zıt anlamlılar','karşıt anlamlılar']},
  sv:{synonyms:['synonymer'],antonyms:['antonymer']},pl:{synonyms:['synonimy'],antonyms:['antonimy']},el:{synonyms:['συνώνυμα'],antonyms:['αντώνυμα']},vi:{synonyms:['từ đồng nghĩa'],antonyms:['từ trái nghĩa']},
  id:{synonyms:['sinonim'],antonyms:['antonim']},th:{synonyms:['คำพ้องความหมาย'],antonyms:['คำตรงข้าม']},uk:{synonyms:['синоніми'],antonyms:['антоніми']},fa:{synonyms:['مترادف‌ها','مترادف ها'],antonyms:['متضادها']},
  bg:{synonyms:['синоними'],antonyms:['антоними']},ca:{synonyms:['sinònims'],antonyms:['antònims']},ms:{synonyms:['sinonim'],antonyms:['antonim']},sw:{synonyms:['visawe'],antonyms:['kinyume']},
  fil:{synonyms:['kasingkahulugan'],antonyms:['kasalungat']},ta:{synonyms:['இணைச்சொற்கள்'],antonyms:['எதிர்ச்சொற்கள்']},bn:{synonyms:['সমার্থক শব্দ'],antonyms:['বিপরীতার্থক শব্দ']},ur:{synonyms:['مترادفات'],antonyms:['متضادات']},
  mr:{synonyms:['समानार्थी शब्द'],antonyms:['विरुद्धार्थी शब्द']},ha:{synonyms:['ma’anoni iri ɗaya','maʼanoni iri daya'],antonyms:['kishiyoyi']},am:{synonyms:['ተመሳሳይ ቃላት'],antonyms:['ተቃራኒ ቃላት']},gu:{synonyms:['સમાનાર્થી'],antonyms:['વિરુદ્ધાર્થી']},nb:{synonyms:['synonymer'],antonyms:['antonymer']},te:{synonyms:['పర్యాయపదాలు'],antonyms:['వ్యతిరేకపదాలు']},
});

function normalizeSectionHeading(value){return String(value??'').replace(/\[edit\]/giu,'').replace(/\s+/gu,' ').trim().toLocaleLowerCase();}

export function extractWiktionaryRelations(payload,languageName,locale,DOMParserClass=globalThis.DOMParser){
  if(!payload||payload.error||typeof payload.parse?.text?.['*']!=='string'||!DOMParserClass)throw new TypeError('The thesaurus response could not be read.');
  const document=new DOMParserClass().parseFromString(payload.parse.text['*'],'text/html');
  const languageHeading=[...document.querySelectorAll('h2')].find((element)=>(element.querySelector('.mw-headline')?.textContent??element.textContent).replace(/\[edit\]/giu,'').trim()===languageName);
  const headings=RELATION_HEADINGS[String(locale??'en').split('-')[0]]??RELATION_HEADINGS.en;
  const result={title:String(payload.parse.title??''),synonyms:[],antonyms:[]};
  if(!languageHeading)return Object.freeze({...result,synonyms:Object.freeze([]),antonyms:Object.freeze([])});
  const seen={synonyms:new Set(),antonyms:new Set()};
  let sibling=languageHeading.parentElement?.nextElementSibling??languageHeading.nextElementSibling;
  while(sibling&&!/^H2$/u.test(sibling.tagName)&&!sibling.querySelector('h2')){
    for(const heading of sibling.querySelectorAll('h3,h4,h5')){
      const section=Object.keys(headings).find((key)=>headings[key].some((alias)=>normalizeSectionHeading(heading.querySelector('.mw-headline')?.textContent??heading.textContent)===normalizeSectionHeading(alias)));
      if(!section)continue;
      const level=Number(heading.tagName.slice(1));
      let block=heading.parentElement?.nextElementSibling??heading.nextElementSibling;
      while(block){
        const nextHeadings=[...(block.matches?.('h2,h3,h4,h5')?[block]:[]),...block.querySelectorAll?.('h2,h3,h4,h5')??[]];
        if(nextHeadings.some((next)=>Number(next.tagName.slice(1))<=level))break;
        for(const list of block.querySelectorAll?.('ol,ul')??[]){
          if(list.parentElement?.closest('ol,ul'))continue;
          for(const item of list.children){
            if(item.tagName!=='LI')continue;
            const clone=item.cloneNode(true);for(const nested of clone.querySelectorAll('ol,ul,sup,.reference,.mw-editsection'))nested.remove();
            const value=clone.textContent.replace(/\s+/gu,' ').trim();const normalized=value.toLocaleLowerCase();
            if(value&&!seen[section].has(normalized)){seen[section].add(normalized);result[section].push(value.slice(0,240));}
            if(result[section].length>=15)break;
          }
          if(result[section].length>=15)break;
        }
        if(result[section].length>=15)break;
        block=block.nextElementSibling;
      }
    }
    sibling=sibling.nextElementSibling;
  }
  return Object.freeze({title:result.title,synonyms:Object.freeze(result.synonyms),antonyms:Object.freeze(result.antonyms)});
}

const PRONUNCIATION_HEADINGS=Object.freeze({en:['pronunciation'],es:['pronunciación','pronunciacion'],fr:['prononciation'],de:['aussprache'],pt:['pronúncia','pronuncia'],it:['pronuncia'],nl:['uitspraak'],ru:['произношение'],ja:['発音'],ko:['발음'],zh:['发音','發音'],ar:['النطق'],hi:['उच्चारण'],tr:['telaffuz'],sv:['uttal'],pl:['wymowa'],el:['προφορά'],vi:['phát âm'],id:['pelafalan'],th:['การออกเสียง'],uk:['вимова'],fa:['تلفظ'],bg:['произношение'],ca:['pronunciació'],ms:['sebutan'],sw:['matamshi'],fil:['bigkas'],ta:['உச்சரிப்பு'],bn:['উচ্চারণ'],ur:['تلفظ'],mr:['उच्चार'],ha:['lafazi'],am:['አጠራር'],gu:['ઉચ્ચાર'],nb:['uttale'],te:['ఉచ్చారణ']});

export function extractWiktionaryPronunciations(payload,languageName,locale,DOMParserClass=globalThis.DOMParser){
  if(!payload||payload.error||typeof payload.parse?.text?.['*']!=='string'||!DOMParserClass)throw new TypeError('The pronunciation response could not be read.');
  const document=new DOMParserClass().parseFromString(payload.parse.text['*'],'text/html');
  const languageHeading=[...document.querySelectorAll('h2')].find((element)=>(element.querySelector('.mw-headline')?.textContent??element.textContent).replace(/\[edit\]/giu,'').trim()===languageName);
  const aliases=PRONUNCIATION_HEADINGS[String(locale??'en').split('-')[0]]??PRONUNCIATION_HEADINGS.en;const pronunciations=[];const seen=new Set();const recordings=[];const seenFiles=new Set();
  if(!languageHeading)return Object.freeze({title:String(payload.parse.title??''),pronunciations:Object.freeze([]),recordings:Object.freeze([])});
  let sibling=languageHeading.parentElement?.nextElementSibling??languageHeading.nextElementSibling;
  while(sibling&&!/^H2$/u.test(sibling.tagName)&&!sibling.querySelector('h2')){
    for(const heading of sibling.querySelectorAll('h3,h4,h5')){
      const text=normalizeSectionHeading(heading.querySelector('.mw-headline')?.textContent??heading.textContent);
      if(!aliases.some((alias)=>normalizeSectionHeading(alias)===text))continue;
      const level=Number(heading.tagName.slice(1));let block=heading.parentElement?.nextElementSibling??heading.nextElementSibling;
      while(block){
        const nextHeadings=[...(block.matches?.('h2,h3,h4,h5')?[block]:[]),...(block.querySelectorAll?.('h2,h3,h4,h5')??[])];
        if(nextHeadings.some((next)=>Number(next.tagName.slice(1))<=level))break;
        for(const ipa of block.querySelectorAll?.('.IPA')??[]){const value=ipa.textContent.replace(/\s+/gu,' ').trim();if(value&&!seen.has(value)){seen.add(value);pronunciations.push(value.slice(0,160));if(pronunciations.length>=12)break;}}
        for(const audio of block.querySelectorAll?.('audio')??[]){
          const sources=[];
          for(const source of audio.querySelectorAll('source[src]')){
            let parsed;try{parsed=new URL(source.getAttribute('src'),'https://upload.wikimedia.org');}catch{continue;}
            if(parsed.protocol==='https:'&&parsed.hostname==='upload.wikimedia.org'&&!parsed.username&&!parsed.password&&parsed.pathname.startsWith('/wikipedia/commons/'))sources.push(Object.freeze({url:parsed.href,type:source.getAttribute('type')??''}));
          }
          const file=String(audio.getAttribute('data-mwtitle')??'').trim();
          if(!file||!sources.length||seenFiles.has(file))continue;
          seenFiles.add(file);const item=audio.closest('li');const labelClone=item?.cloneNode(true);for(const media of labelClone?.querySelectorAll('audio,.audiofile,.mw-file-element')??[])media.remove();
          const label=(labelClone?.textContent??'').replace(/\s+/gu,' ').trim();
          recordings.push(Object.freeze({file,label:label.slice(0,180),sources:Object.freeze(sources)}));if(recordings.length>=6)break;
        }
        if(pronunciations.length>=12)break;block=block.nextElementSibling;
      }
    }
    sibling=sibling.nextElementSibling;
  }
  return Object.freeze({title:String(payload.parse.title??''),pronunciations:Object.freeze(pronunciations),recordings:Object.freeze(recordings)});
}
