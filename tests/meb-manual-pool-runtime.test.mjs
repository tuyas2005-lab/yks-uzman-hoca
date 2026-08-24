import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const context={window:{},state:{studyEvents:[]},console};
context.window.window=context.window;
vm.createContext(context);
for(const file of [
  'data/question-catalog-v1.js',
  'data/catalog/meb-manual-student-pool-1523.js',
  'data/catalog/meb-manual-student-pool-1523-register.js',
  'data/question-catalog-dedupe.js',
  'data/question-catalog-policy-v2.js'
]) vm.runInContext(read(file),context,{filename:file});

test('runtime catalog keeps legacy records but exposes only ready MEB rows to selection policy',()=>{
  const C=context.window.YKSQuestionCatalogV1;
  assert.ok(C.all().some(x=>x.provider==='OSYM'));
  assert.equal(C.all().filter(x=>x.provider==='MEB_OGM'&&x.sourceKind==='manual-crop').length,1523);
  const visible=C.findNextBatch({exam:'TYT',subject:'Matematik'},2000);
  assert.equal(visible.length,1289);
  assert.equal(visible.some(x=>x.provider==='OSYM'),false);
  assert.equal(visible.some(x=>x.status==='pending-official-answer-verification'),false);
  assert.equal(visible.every(x=>x.asset?.kind==='static-crop'),true);
  const target=C.all().find(x=>x.id==='meb-3-adim-tyt-mat-veri-1-1-01');
  assert.deepEqual({manualCrop:target.manualCrop,answerVerified:target.answerVerified,status:target.status,answerKey:target.answerKey,assetStatus:target.asset.status,assetKind:target.asset.kind,assetUrl:target.asset.url},
    {manualCrop:true,answerVerified:true,status:'student-ready',answerKey:'E',assetStatus:'ready',assetKind:'static-crop',assetUrl:'/assets/meb-3-adim-tyt-math-v10-full/meb-3-adim-tyt-mat-veri-1-1-01.jpg'});
});
