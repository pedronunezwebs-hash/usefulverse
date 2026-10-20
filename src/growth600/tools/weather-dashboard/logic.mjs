export const WEATHER_API='https://api.met.no/weatherapi/locationforecast/2.0/compact';
export const WEATHER_CACHE_KEY='usefulverse-weather-session-v1';

export function createMetWeatherRequest(latitude,longitude){
  if(String(latitude??'').trim()===''||String(longitude??'').trim()==='')throw new RangeError('Enter both latitude and longitude.');
  const lat=Number(latitude);const lon=Number(longitude);
  if(!Number.isFinite(lat)||lat< -90||lat>90||!Number.isFinite(lon)||lon< -180||lon>180)throw new RangeError('Enter latitude from −90 to 90 and longitude from −180 to 180.');
  const roundedLatitude=Number(lat.toFixed(2));const roundedLongitude=Number(lon.toFixed(2));
  const url=new URL(WEATHER_API);url.search=new URLSearchParams({lat:String(roundedLatitude),lon:String(roundedLongitude)}).toString();
  return Object.freeze({url:url.href,latitude:roundedLatitude,longitude:roundedLongitude,key:`${roundedLatitude},${roundedLongitude}`});
}

export function getWeatherConditionKey(symbolCode=''){
  const code=String(symbolCode).toLowerCase();
  if(code.includes('thunder'))return 'thunderstorm';
  if(code.includes('snow'))return 'snow';
  if(code.includes('sleet'))return 'sleet';
  if(code.includes('rain'))return 'rain';
  if(code.includes('drizzle'))return 'drizzle';
  if(code.includes('fog'))return 'fog';
  if(code.includes('partlycloudy'))return 'partlyCloudy';
  if(code.includes('cloudy'))return 'cloudy';
  if(code.includes('fair'))return 'mostlyClear';
  if(code.includes('clearsky'))return 'clear';
  return 'unknown';
}

export function readMetForecast(payload,timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'){
  const rows=payload?.properties?.timeseries;
  if(!Array.isArray(rows)||!rows.length||rows.length>500)throw new TypeError('The weather service returned an invalid forecast.');
  const points=rows.map((row)=>{
    const time=Date.parse(row?.time);const details=row?.data?.instant?.details;
    if(!Number.isFinite(time)||!details||!Number.isFinite(details.air_temperature))return null;
    const next=row.data.next_1_hours??row.data.next_6_hours??row.data.next_12_hours;
    return Object.freeze({time,temperature:details.air_temperature,humidity:Number.isFinite(details.relative_humidity)?details.relative_humidity:null,wind:Number.isFinite(details.wind_speed)?details.wind_speed:null,condition:getWeatherConditionKey(next?.summary?.symbol_code),precipitation:Number.isFinite(next?.details?.precipitation_amount)?next.details.precipitation_amount:null});
  }).filter(Boolean);
  if(!points.length)throw new TypeError('The weather service returned no usable forecast points.');
  const now=Date.now();const upcoming=points.filter(({time})=>time>=now-60*60*1000);const current=upcoming[0]??points.at(-1);
  const dateFormatter=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
  const byDay=new Map();for(const point of points){if(point.time<now-12*60*60*1000)continue;const parts=Object.fromEntries(dateFormatter.formatToParts(new Date(point.time)).map(({type,value})=>[type,value]));const date=`${parts.year}-${parts.month}-${parts.day}`;let day=byDay.get(date);if(!day){day={date,min:point.temperature,max:point.temperature,condition:point.condition};byDay.set(date,day);}else{day.min=Math.min(day.min,point.temperature);day.max=Math.max(day.max,point.temperature);}}
  return Object.freeze({updatedAt:rows[0]?.time??new Date(current.time).toISOString(),current,hours:Object.freeze(upcoming.slice(0,12)),days:Object.freeze([...byDay.values()].slice(0,6).map(Object.freeze)),units:Object.freeze({...payload.properties.meta?.units})});
}

export async function readLimitedWeatherResponse(response,limit=1_000_000){
  if(!response?.body?.getReader){const text=await response.text();if(text.length>limit)throw new RangeError('The weather response is too large.');return text;}
  const reader=response.body.getReader();const chunks=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError('The weather response is too large.');}chunks.push(value);}}
  finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return new TextDecoder().decode(bytes);
}

export function parseWeatherCache(raw,now=Date.now()){
  if(typeof raw!=='string'||raw.length>1_100_000)return null;
  try{const value=JSON.parse(raw);if(!value||typeof value.key!=='string'||!Number.isFinite(value.expiresAt)||value.expiresAt<=now||typeof value.forecastJson!=='string')return null;return value;}catch{return null;}
}
