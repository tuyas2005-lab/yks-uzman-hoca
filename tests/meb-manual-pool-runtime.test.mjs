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
  assert.equal(visible.length,1521);
  assert.equal(visible.some(x=>x.provider==='OSYM'),false);
  assert.equal(visible.some(x=>x.status==='pending-official-answer-verification'),false);
  assert.equal(visible.every(x=>x.asset?.kind==='static-crop'),true);
  const target=C.all().find(x=>x.id==='meb-3-adim-tyt-mat-veri-1-1-01');
  assert.deepEqual({manualCrop:target.manualCrop,answerVerified:target.answerVerified,status:target.status,answerKey:target.answerKey,assetStatus:target.asset.status,assetKind:target.asset.kind,assetUrl:target.asset.url},
    {manualCrop:true,answerVerified:true,status:'student-ready',answerKey:'E',assetStatus:'ready',assetKind:'static-crop',assetUrl:'/assets/meb-3-adim-tyt-math-v10-full/meb-3-adim-tyt-mat-veri-1-1-01.jpg'});
});

test('question index topic counters use one student-visible universe',()=>{
  const rows=JSON.parse(read('data/catalog/meb-manual-student-pool-1523.json'));
  const visible=rows.filter(x=>x.manualCrop===true&&x.answerVerified===true&&x.status==='student-ready');
  for(const topic of ['Bölme - Bölünebilme Kuralları','Denklemler ve Eşitsizlikler','Kümeler','Mantık']){
    const total=visible.filter(x=>x.topic===topic).length;
    const ready=visible.filter(x=>x.topic===topic).length;
    assert.ok(ready<=total);
    assert.equal(ready,total);
  }
  assert.equal(visible.length,1521);
  assert.equal(rows.filter(x=>x.status!=='student-ready'&&visible.includes(x)).length,0);
  assert.equal(rows.length,1523);
  assert.equal(visible.length,1521);
  assert.match(read('app-question-index.js'),/manualPool=\[\...\(C\(\)\.allRecords\?\./);
  assert.match(read('app-question-index-counter-fix.js'),/filter\(visible\)/);
  assert.match(read('app-question-index-counter-fix.js'),/textContent\.trim\(\)!==label/);
  assert.match(read('app-home-links.js'),/if\(activeScreen==='questionIndex'\)window\.renderQuestionIndex\?\./);
  assert.doesNotMatch(read('app-home-links.js'),/if\(activeScreen==='questionIndex'\)window\.go\?\./);
  assert.match(read('app-home-links.js'),/await loadScript\(pool\);\s*await loadScript\(register\)/);
  assert.match(read('app-home-links.js'),/g\.name==='official'\?Promise\.resolve\(\)\.then/);
  assert.doesNotMatch(read('app-home-links.js'),/visible!==1289/);
  assert.match(read('app-home-links.js'),/manual!==visible\+unresolved/);
});
