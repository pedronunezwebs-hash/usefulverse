const MAX_PDF_BYTES = 25 * 1024 * 1024;
const MAX_SIGNATURES = 20;
const DIGESTS = Object.freeze({
  '1.3.14.3.2.26': 'SHA-1',
  '2.16.840.1.101.3.4.2.1': 'SHA-256',
  '2.16.840.1.101.3.4.2.2': 'SHA-384',
  '2.16.840.1.101.3.4.2.3': 'SHA-512',
});
const RSA_SIGNATURES = new Set(['1.2.840.113549.1.1.1','1.2.840.113549.1.1.5','1.2.840.113549.1.1.11','1.2.840.113549.1.1.12','1.2.840.113549.1.1.13']);
const ECDSA_DIGESTS = Object.freeze({'1.2.840.10045.4.3.2':'SHA-256','1.2.840.10045.4.3.3':'SHA-384','1.2.840.10045.4.3.4':'SHA-512'});

function ascii(bytes) {
  let output = '';
  for (let offset = 0; offset < bytes.length; offset += 16384) output += String.fromCharCode(...bytes.subarray(offset, Math.min(bytes.length, offset + 16384)));
  return output;
}
function concat(...arrays) {
  const out = new Uint8Array(arrays.reduce((sum, bytes) => sum + bytes.length, 0));
  let offset = 0;
  for (const bytes of arrays) { out.set(bytes, offset); offset += bytes.length; }
  return out;
}
function equal(a,b) { return a.length === b.length && a.every((value,index)=>value===b[index]); }
function hex(bytes) { return [...bytes].map((value)=>value.toString(16).padStart(2,'0')).join(''); }

function der(bytes, offset = 0) {
  if (offset + 2 > bytes.length) throw new RangeError('Truncated DER value.');
  const tag = bytes[offset];
  let cursor = offset + 1;
  const first = bytes[cursor++];
  let length = 0;
  if (first < 0x80) length = first;
  else {
    const count = first & 0x7f;
    if (!count || count > 4 || cursor + count > bytes.length) throw new RangeError('Invalid DER length.');
    for (let i = 0; i < count; i += 1) length = length * 256 + bytes[cursor++];
  }
  const end = cursor + length;
  if (end > bytes.length) throw new RangeError('DER value extends beyond its buffer.');
  return Object.freeze({ tag, start: offset, valueStart: cursor, end, length, bytes: bytes.subarray(offset,end), value: bytes.subarray(cursor,end) });
}
function children(node, bytes) {
  const list=[];
  let offset=node.valueStart;
  while(offset<node.end){const child=der(bytes,offset);list.push(child);offset=child.end;}
  if(offset!==node.end)throw new RangeError('Malformed DER child sequence.');
  return list;
}
function oid(node) {
  if(node?.tag!==0x06||!node.value.length)throw new RangeError('Expected an ASN.1 object identifier.');
  const first=node.value[0];
  const values=[Math.min(2,Math.floor(first/40)),first-Math.min(2,Math.floor(first/40))*40];
  let value=0;
  for(let i=1;i<node.value.length;i+=1){value=value*128+(node.value[i]&0x7f);if(!(node.value[i]&0x80)){values.push(value);value=0;}}
  if(value)throw new RangeError('Truncated ASN.1 object identifier.');
  return values.join('.');
}
function derChildren(bytes) { const root=der(bytes); if(root.end!==bytes.length)throw new RangeError('Unexpected bytes after DER object.'); return {root,items:children(root,bytes)}; }
function nodeBytes(bytes,node){return bytes.subarray(node.start,node.end);}
function normalizeInteger(value){let offset=0;while(offset<value.length-1&&value[offset]===0)offset+=1;return value.subarray(offset);}
function textValue(node){return new TextDecoder(node.tag===0x1e?'utf-16be':'utf-8',{fatal:false}).decode(node.value);}

function certificateInfo(bytes, certNode) {
  if(certNode.tag!==0x30) return null;
  const certItems=children(certNode,bytes),tbs=certItems[0];
  if(tbs?.tag!==0x30) return null;
  const fields=children(tbs,bytes);
  const start=fields[0]?.tag===0xa0?1:0;
  const serial=fields[start],issuer=fields[start+2],subject=fields[start+4],spki=fields[start+5];
  if(serial?.tag!==0x02||issuer?.tag!==0x30||subject?.tag!==0x30||spki?.tag!==0x30)return null;
  let commonName='';
  try {
    for(const set of children(subject,bytes))for(const attribute of children(set,bytes)){
      const parts=children(attribute,bytes);
      if(oid(parts[0])==='2.5.4.3')commonName=textValue(parts[1]);
    }
  } catch {}
  return {serial:normalizeInteger(serial.value),issuer:nodeBytes(bytes,issuer),spki:nodeBytes(bytes,spki),commonName};
}

function findMessageDigest(attrs, bytes) {
  for(const attribute of children(attrs,bytes)){
    if(attribute.tag!==0x30)continue;
    const fields=children(attribute,bytes);
    if(oid(fields[0])!=='1.2.840.113549.1.9.4')continue;
    const values=children(fields[1],bytes);
    if(values[0]?.tag===0x04)return values[0].value;
  }
  return null;
}

function findSigningTime(attrs,bytes){
  for(const attribute of children(attrs,bytes)){
    const fields=children(attribute,bytes);
    if(oid(fields[0])==='1.2.840.113549.1.9.5'){
      const time=children(fields[1],bytes)[0];
      return time?textValue(time):null;
    }
  }
  return null;
}

function findTimestampToken(unsignedAttrs,bytes){
  if(!unsignedAttrs)return false;
  try{return children(unsignedAttrs,bytes).some((attribute)=>oid(children(attribute,bytes)[0])==='1.2.840.113549.1.9.16.2.14');}catch{return false;}
}

function ecdsaRaw(signature, coordinateBytes) {
  const root=der(signature);
  if(root.tag!==0x30||root.end!==signature.length)throw new RangeError('Invalid ECDSA signature encoding.');
  const [r,s]=children(root,signature);
  if(r?.tag!==0x02||s?.tag!==0x02)throw new RangeError('Invalid ECDSA signature integers.');
  const pad=(integer)=>{const n=normalizeInteger(integer.value);if(n.length>coordinateBytes)throw new RangeError('ECDSA integer exceeds curve size.');const output=new Uint8Array(coordinateBytes);output.set(n,coordinateBytes-n.length);return output;};
  return concat(pad(r),pad(s));
}

function signatureAlgorithm(signatureOid,digestName,spkiBytes){
  if(RSA_SIGNATURES.has(signatureOid))return {importAlgorithm:{name:'RSASSA-PKCS1-v1_5',hash:digestName},verifyAlgorithm:{name:'RSASSA-PKCS1-v1_5'},signatureFormat:'raw'};
  const ecdsaDigest=ECDSA_DIGESTS[signatureOid];
  if(ecdsaDigest!==digestName)throw new RangeError('Unsupported or mismatched signature algorithm.');
  const {items}=derChildren(spkiBytes);
  const spkiAlgorithm=children(items[0],spkiBytes);
  const curveOid=oid(spkiAlgorithm[1]);
  const curves={'1.2.840.10045.3.1.7':['P-256',32],'1.3.132.0.34':['P-384',48],'1.3.132.0.35':['P-521',66]};
  const curve=curves[curveOid];
  if(!curve)throw new RangeError('Unsupported EC curve.');
  return {importAlgorithm:{name:'ECDSA',namedCurve:curve[0]},verifyAlgorithm:{name:'ECDSA',hash:digestName},signatureFormat:curve[1]};
}

export async function verifyPdfCmsSignature(pdfBytes,cmsBytes,{cryptoImpl=globalThis.crypto}={}){
  try{
    const contentRoot=der(cmsBytes);
    if(cmsBytes.subarray(contentRoot.end).some((byte)=>byte!==0))throw new RangeError('CMS padding contains non-zero bytes.');
    cmsBytes=cmsBytes.subarray(0,contentRoot.end);
    const contentItems=children(contentRoot,cmsBytes);
    if(contentRoot.tag!==0x30)throw new RangeError('CMS object is not a SignedData signature.');
    if(oid(contentItems[0])!=='1.2.840.113549.1.7.2'||contentItems[1]?.tag!==0xa0)throw new RangeError('CMS object is not a SignedData signature.');
    const signedData=children(contentItems[1],cmsBytes)[0];
    const signedFields=children(signedData,cmsBytes);
    const certSet=signedFields.find((node)=>node.tag===0xa0);
    const signerSet=[...signedFields].reverse().find((node)=>node.tag===0x31);
    if(!certSet||!signerSet)throw new RangeError('SignedData does not include certificates and a signer.');
    const signers=children(signerSet,cmsBytes);
    if(signers.length!==1)throw new RangeError('This verifier accepts one signer per PDF signature.');
    const signerFields=children(signers[0],cmsBytes);
    const sid=signerFields[1],sidFields=children(sid,cmsBytes);
    if(sid.tag!==0x30||sidFields.length<2||sidFields[1].tag!==0x02)throw new RangeError('Unsupported signer identifier.');
    const certs=children(certSet,cmsBytes).map((node)=>certificateInfo(cmsBytes,node)).filter(Boolean);
    const signer=certs.find((cert)=>equal(cert.serial,normalizeInteger(sidFields[1].value))&&equal(cert.issuer,nodeBytes(cmsBytes,sidFields[0])));
    if(!signer)throw new RangeError('No embedded signer certificate matches this signature.');
    const digestNode=children(signerFields[2],cmsBytes)[0];
    const digestName=DIGESTS[oid(digestNode)];
    if(!digestName)throw new RangeError('Unsupported content digest algorithm.');
    let index=3;
    const attrs=signerFields[index]?.tag===0xa0?signerFields[index++]:null;
    if(!attrs)throw new RangeError('Detached signatures without signed attributes are unsupported.');
    const signatureAlgNode=signerFields[index++];
    const signatureNode=signerFields[index++];
    const unsignedAttrs=signerFields[index]?.tag===0xa1?signerFields[index]:null;
    if(signatureNode?.tag!==0x04)throw new RangeError('Missing CMS signature bytes.');
    const signatureOid=oid(children(signatureAlgNode,cmsBytes)[0]);
    const attrBytes=attrs.bytes.slice();
    attrBytes[0]=0x31;
    const messageDigest=findMessageDigest(attrs,cmsBytes);
    if(!messageDigest)throw new RangeError('Signed attributes do not include messageDigest.');
    const calculated=new Uint8Array(await cryptoImpl.subtle.digest(digestName,pdfBytes));
    const digestMatches=equal(messageDigest,calculated);
    if(!digestMatches)return Object.freeze({verified:false,reason:'The PDF byte-range digest does not match the signed messageDigest.',signer:signer.commonName||null,digestName,signingTime:findSigningTime(attrs,cmsBytes),timestampTokenPresent:findTimestampToken(unsignedAttrs,cmsBytes)});
    const parameters=signatureAlgorithm(signatureOid,digestName,signer.spki);
    const key=await cryptoImpl.subtle.importKey('spki',signer.spki,parameters.importAlgorithm,false,['verify']);
    const signature=parameters.signatureFormat==='raw'?signatureNode.value:ecdsaRaw(signatureNode.value,parameters.signatureFormat);
    const verified=await cryptoImpl.subtle.verify(parameters.verifyAlgorithm,key,signature,attrBytes);
    return Object.freeze({verified,reason:verified?null:'The cryptographic signature did not verify.',signer:signer.commonName||null,digestName,signingTime:findSigningTime(attrs,cmsBytes),timestampTokenPresent:findTimestampToken(unsignedAttrs,cmsBytes)});
  }catch(error){return Object.freeze({verified:false,reason:error instanceof Error?error.message:'Signature data could not be parsed.',signer:null,digestName:null,signingTime:null,timestampTokenPresent:false});}
}

export async function inspectPdfSignatures(input,{cryptoImpl=globalThis.crypto}={}){
  const bytes=input instanceof Uint8Array?input:new Uint8Array(input);
  if(bytes.length<8||bytes.length>MAX_PDF_BYTES||ascii(bytes.subarray(0,5))!=='%PDF-')throw new RangeError('Choose a valid PDF no larger than 25 MiB.');
  const source=ascii(bytes);
  const signatures=[];
  const pattern=/\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/g;
  let match;
  while((match=pattern.exec(source))&&signatures.length<MAX_SIGNATURES){
    const range=match.slice(1).map(Number);
    const [firstOffset,firstLength,secondOffset,secondLength]=range;
    const end=secondOffset+secondLength;
    const structurallyValid=range.every((value)=>Number.isSafeInteger(value)&&value>=0)&&firstOffset===0&&firstLength>0&&secondOffset>firstLength&&secondLength>0&&Number.isSafeInteger(end)&&end<=bytes.length;
    if(!structurallyValid){signatures.push(Object.freeze({byteRange:Object.freeze(range),byteRangeValid:false,cryptographicallyVerified:false,reason:'ByteRange is malformed or outside the PDF.'}));continue;}
    const gap=source.slice(firstLength,secondOffset).match(/^<([0-9A-Fa-f\s]+)>$/);
    if(!gap){signatures.push(Object.freeze({byteRange:Object.freeze(range),byteRangeValid:false,cryptographicallyVerified:false,reason:'The excluded ByteRange gap is not a hex Contents value.'}));continue;}
    const encoded=gap[1].replace(/\s/g,'');
    if(!encoded.length||encoded.length%2){signatures.push(Object.freeze({byteRange:Object.freeze(range),byteRangeValid:false,cryptographicallyVerified:false,reason:'The signature Contents value is malformed.'}));continue;}
    const cmsBytes=new Uint8Array(encoded.match(/.{2}/g).map((pair)=>Number.parseInt(pair,16)));
    const signedBytes=concat(bytes.subarray(firstOffset,firstOffset+firstLength),bytes.subarray(secondOffset,end));
    const verification=await verifyPdfCmsSignature(signedBytes,cmsBytes,{cryptoImpl});
    signatures.push(Object.freeze({byteRange:Object.freeze(range),byteRangeValid:true,coversCurrentFile:end===bytes.length,appendedBytes:end<bytes.length?bytes.length-end:0,cryptographicallyVerified:verification.verified,reason:verification.reason,signer:verification.signer,digestName:verification.digestName,signingTime:verification.signingTime,timestampTokenPresent:verification.timestampTokenPresent,trust:'unknown',revocation:'not checked',timestamp:'not independently validated'}));
  }
  return Object.freeze({fileBytes:bytes.length,signatureCount:signatures.length,signatures:Object.freeze(signatures)});
}
