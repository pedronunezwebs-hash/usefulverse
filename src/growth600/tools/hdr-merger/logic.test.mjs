import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeExposureImages } from './logic.mjs';

test('blends registered exposures into finite opaque 8-bit output',()=>{
  const images=[20,100,220].map(value=>({width:1,height:1,data:new Uint8ClampedArray([value,value,value,255])}));
  const result=mergeExposureImages({images,exposures:[-2,0,2],toneStops:0});
  assert.deepEqual([...result.data].slice(0,3),[94,94,94]);
  assert.equal(result.data[3],255);
});

test('preserves transparent output when every source pixel is transparent',()=>{
  const images=Array.from({length:2},()=>({width:1,height:1,data:new Uint8ClampedArray([255,0,0,0])}));
  assert.deepEqual([...mergeExposureImages({images,exposures:[0,0]}).data],[0,0,0,0]);
});

test('rejects image count, mismatched shapes, invalid EV and excessive image size',()=>{
  const one={width:1,height:1,data:new Uint8ClampedArray([0,0,0,255])};
  assert.throws(()=>mergeExposureImages({images:[one],exposures:[0]}));
  assert.throws(()=>mergeExposureImages({images:[one,{...one,width:2}],exposures:[0,0]}));
  assert.throws(()=>mergeExposureImages({images:[one,one],exposures:[0,9]}));
  assert.throws(()=>mergeExposureImages({images:[{width:2049,height:1,data:new Uint8ClampedArray(2049*4)},{width:2049,height:1,data:new Uint8ClampedArray(2049*4)}],exposures:[0,0]}));
});
