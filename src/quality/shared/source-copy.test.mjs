import test from 'node:test';
import assert from 'node:assert/strict';
import { qualitySourceCopy } from './source-copy.mjs';

test('translated example/related text cannot change stable controls or routes', () => {
  const document = {sourceCopy:{examples:[{heading:'Ejemplo',text:'Texto'}],related:[{title:'Fracciones',text:'Texto'}]},nonTranslatableCopy:{examples:[{id:'add',a:'1/2'}],related:[{id:'fraction-calculator'}]}};
  const copy = qualitySourceCopy(document);
  assert.equal(copy.examples[0].id, 'add');
  assert.equal(copy.related[0].id, 'fraction-calculator');
  assert.equal(copy.examples[0].heading, 'Ejemplo');
  assert.equal(document.sourceCopy.examples[0].id, undefined);
  assert.equal(document.sourceCopy.related[0].id, undefined);
  document.sourceCopy.examples[0].id = 'translated';
  document.sourceCopy.related[0].id = 'translated-route';
  assert.equal(qualitySourceCopy(document).examples[0].id, 'add');
  assert.equal(qualitySourceCopy(document).related[0].id, 'fraction-calculator');
  assert.throws(() => qualitySourceCopy({...document, nonTranslatableCopy:{...document.nonTranslatableCopy,related:[{id:'../bad'}]}}), /Invalid stable/u);
  assert.throws(() => qualitySourceCopy({...document, nonTranslatableCopy:{...document.nonTranslatableCopy,examples:[]}}), /mismatch/u);
});
