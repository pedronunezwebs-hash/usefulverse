import Cube from './vendor/cube.js';

const FACE_ORDER=Object.freeze(['U','R','F','D','L','B']);

function permutationParity(values){let parity=0;for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)if(values[i]>values[j])parity^=1;return parity;}

export function readRubiksCubeFaces(input={}){
  const faces=FACE_ORDER.map((face)=>String(input[`face${face}`]??'').replace(/\s/gu,'').toUpperCase());
  if(faces.some((face)=>!/^[URFDLB]{9}$/u.test(face)))throw new RangeError('Enter exactly nine U, R, F, D, L or B letters for every face.');
  for(let index=0;index<FACE_ORDER.length;index++)if(faces[index][4]!==FACE_ORDER[index])throw new RangeError('Keep each face center in its matching U, R, F, D, L or B position.');
  const counts=Object.fromEntries(FACE_ORDER.map((face)=>[face,0]));for(const face of faces)for(const letter of face)counts[letter]++;
  if(FACE_ORDER.some((face)=>counts[face]!==9))throw new RangeError('A valid cube has exactly nine stickers for each center-letter.');
  const cube=Cube.fromString(faces.join(''));
  const validPermutation=(values,size)=>values.length===size&&values.every((value)=>Number.isInteger(value)&&value>=0&&value<size)&&new Set(values).size===size;
  if(!validPermutation(cube.cp,8)||!validPermutation(cube.ep,12))throw new RangeError('The stickers do not form valid cube corners and edges. Check the colors you entered.');
  if(cube.co.some((value)=>!Number.isInteger(value)||value<0||value>2)||cube.co.reduce((sum,value)=>sum+value,0)%3!==0)throw new RangeError('This cube has an impossible corner twist. Recheck the face stickers.');
  if(cube.eo.some((value)=>!Number.isInteger(value)||value<0||value>1)||cube.eo.reduce((sum,value)=>sum+value,0)%2!==0)throw new RangeError('This cube has an impossible edge flip. Recheck the face stickers.');
  if(permutationParity(cube.cp)!==permutationParity(cube.ep))throw new RangeError('This cube has an impossible piece swap. Recheck the face stickers.');
  if(cube.center.some((value,index)=>value!==index))throw new RangeError('The six center stickers must match their face letters.');
  return Object.freeze({state:cube.toJSON(),facelets:faces.join(''),isSolved:cube.isSolved()});
}

export function exampleRubiksCubeFaces(){
  const cube=new Cube();cube.move("R U R' U' F2");const value=cube.asString();
  return Object.freeze(Object.fromEntries(FACE_ORDER.map((face,index)=>[`face${face}`,value.slice(index*9,(index+1)*9)])));
}

export { FACE_ORDER };
