import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source=fs.readFileSync(new URL('../app-crop-studio.js',import.meta.url),'utf8');

test('crop studio refreshes topic counts when catalog health settles',()=>{
  assert.match(source,/lastSourceSignature/);
  assert.match(source,/buildSourceHealthReport\(C\.all\(\)\)/);
  assert.match(source,/signature!==lastSourceSignature&&!userStarted/);
  assert.match(source,/root\.addEventListener\('click',e=>\{if\(e\.target\.closest\('#cropAdd,#cropExport'\)\)userStarted=true\}\)/);
  assert.doesNotMatch(source,/dataset\.cropFallback\)\)\{render\(\);installPasteTarget\(\)\}/);
});
