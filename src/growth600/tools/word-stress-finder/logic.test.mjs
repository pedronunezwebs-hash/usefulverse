import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSpanishWordStress } from './logic.mjs';

test('infers standard stress and divides common Spanish words',()=>{
  assert.deepEqual(analyzeSpanishWordStress('casa').syllables,['ca','sa']);
  assert.equal(analyzeSpanishWordStress('casa').stress,'ca');
  assert.deepEqual(analyzeSpanishWordStress('canción').syllables,['can','ción']);
  assert.equal(analyzeSpanishWordStress('canción').stress,'ción');
  assert.deepEqual(analyzeSpanishWordStress('teléfono').syllables,['te','lé','fo','no']);
  assert.equal(analyzeSpanishWordStress('teléfono').stress,'lé');
  assert.deepEqual(analyzeSpanishWordStress('país').syllables,['pa','ís']);
  assert.equal(analyzeSpanishWordStress('país').stress,'ís');
});

test('reports an accent mark without pretending to detect missing dictionary accents',()=>{
  assert.equal(analyzeSpanishWordStress('casa').hasWrittenAccent,false);
  assert.equal(analyzeSpanishWordStress('canción').markedPositionRequiresAccent,true);
  assert.equal(analyzeSpanishWordStress('teléfono').markedPositionRequiresAccent,true);
  assert.equal(analyzeSpanishWordStress('telefono').markedPositionRequiresAccent,false);
});

test('rejects phrases, punctuation and multiple accent marks',()=>{
  for(const word of ['', 'dos palabras', 'árbol-casa', 'áé', '123'])assert.throws(()=>analyzeSpanishWordStress(word));
});
