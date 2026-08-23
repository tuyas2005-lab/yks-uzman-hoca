import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
function runtime(){
  const window={};
  const context=vm.createContext({window,console,setTimeout(fn){fn();return 1},clearTimeout(){}});
  window.window=window;
  vm.runInContext(read('data/yks-topic-taxonomy-v1.js'),context);
  vm.runInContext(read('data/question-catalog-v1.js'),context);
  vm.runInContext(read('data/catalog/meb-3-adim-tyt-math-sprint-1.js'),context);
  vm.runInContext(read('app-source-map-meb-3-adim-tyt-math-sprint-1.js'),context);
  return window.YKSQuestionCatalogV1.all().filter(x=>x.provider==='MEB');
}

test('MEB 3 Adım curated pool has 24 deterministic ready questions',()=>{
  const rows=runtime();
  assert.equal(rows.length,24);
  assert.equal(new Set(rows.map(x=>x.id)).size,24);
  assert.equal(new Set(rows.map(x=>`${x.collection}|${x.chapter}|${x.step}|${x.questionNo}`)).size,24);
  assert.ok(rows.every(x=>x.studentReady&&x.manualReview===false&&x.answerVerified));
  assert.ok(rows.every(x=>x.asset?.status==='ready'&&x.asset?.url&&x.asset?.crop));
});

test('step and difficulty are balanced per canonical topic',()=>{
  const rows=runtime();
  for(const topic of ['ebob-ekok','polinomlar','carpanlara-ayirma','ikinci-dereceden-denklemler']){
    const xs=rows.filter(x=>x.canonicalTopicId===`tyt.matematik.${topic}`);
    assert.equal(xs.length,6);
    assert.equal(JSON.stringify(xs.map(x=>x.step).sort((a,b)=>a-b)),JSON.stringify([1,1,2,2,3,3]));
    assert.equal(JSON.stringify(xs.map(x=>x.difficulty).sort()),JSON.stringify(['KOLAY','KOLAY','ORTA','ORTA','ZOR','ZOR']));
  }
});

test('official answer keys and source pages are present for every selected question',()=>{
  const rows=runtime();
  assert.ok(rows.every(x=>/^[ABCDE]$/.test(x.answerKey)));
  assert.ok(rows.every(x=>Number.isInteger(x.access?.page)&&x.access.page>0));
  assert.ok(rows.every(x=>x.verification?.answerKey==='official'&&x.verification?.crop));
});
