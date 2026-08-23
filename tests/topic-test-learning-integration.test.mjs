import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const taxonomyCode=fs.readFileSync(new URL('../data/yks-topic-taxonomy-v1.js',import.meta.url),'utf8');
const dataCode=fs.readFileSync(new URL('../app-data-v5.js',import.meta.url),'utf8');
const teacherUi=fs.readFileSync(new URL('../app-personal-teacher-v2.js',import.meta.url),'utf8');
const teacherLaunch=fs.readFileSync(new URL('../app-personal-teacher-source-launch-v3.js',import.meta.url),'utf8');
const teacherApi=fs.readFileSync(new URL('../api/teacher-recap.js',import.meta.url),'utf8');
const coachUi=fs.readFileSync(new URL('../app-yks-coach.js',import.meta.url),'utf8');
const coachApi=fs.readFileSync(new URL('../api/coach-report.js',import.meta.url),'utf8');
const cloudCode=fs.readFileSync(new URL('../app-cloud.js',import.meta.url),'utf8');

function fakeNode(){return{appendChild(){},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}}}
function harness(seed=[]){
  const state={studyEvents:structuredClone(seed),meta:{v5DemoCleaned:true},profile:{track:''}};
  const document={head:fakeNode(),body:fakeNode(),createElement:fakeNode,addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}};
  const context={state,document,console,Date,structuredClone,crypto,localStorage:{setItem(){}},setTimeout(){return 0},save(){}};
  context.window=context;context.globalThis=context;vm.createContext(context);vm.runInContext(taxonomyCode,context);vm.runInContext(dataCode,context);return context;
}
const input=(actionId,dateKey,counts)=>({actionId,dateKey,exam:'TYT',subjectId:'matematik',topicId:'tyt.matematik.koklu-sayilar',resource:'345',total:counts.correct+counts.wrong+counts.blank,...counts});
const day=(offset=0)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d.toLocaleDateString('sv-SE')};

{
  const h=harness([{id:'legacy-today',timestamp:Date.now(),dateKey:day(),source:'measurement',exam:'TYT',subject:'Matematik',topic:'Denklemler',result:'unknown',questionCount:10,meta:{}}]);
  h.YKSDataV5.recordTopicTest(input('daily',day(),{correct:14,wrong:4,blank:2}));
  assert.equal(h.YKSDataV5.getLearningModel().todayCount,30,'daily goal soru adediyle saymalı');
}
{
  const h=harness();h.YKSDataV5.recordTopicTest(input('w1',day(-1),{correct:14,wrong:4,blank:2}));h.YKSDataV5.recordTopicTest(input('w2',day(),{correct:17,wrong:2,blank:1}));
  const x=h.YKSDataV5.getTopicTestInsights()[0];
  assert.deepEqual({tests:x.totalTests,questions:x.totalQuestions,correct:x.correct,wrong:x.wrong,blank:x.blank,net:x.net,accuracy:x.accuracy,trend:x.trend},{tests:2,questions:40,correct:31,wrong:6,blank:3,net:29.5,accuracy:77.5,trend:'improving'});
}
{
  const h=harness();h.YKSDataV5.recordTopicTest(input('u1',day(-1),{correct:10,wrong:0,blank:0}));h.YKSDataV5.recordTopicTest(input('u2',day(),{correct:50,wrong:50,blank:0}));
  assert.equal(h.YKSDataV5.getTopicTestInsights()[0].accuracy,54.5,'basit yüzde ortalaması kullanılmamalı');
}
{
  const h=harness();const event=h.YKSDataV5.recordTopicTest(input('single',day(),{correct:7,wrong:2,blank:1})).event;
  assert.equal(h.YKSDataV5.getTopicTestInsights()[0].trend,'insufficient-data');
  h.YKSDataV5.patch(event.id,{questionCount:10,meta:{counts:{correct:9,wrong:1,blank:0}}});
  assert.equal(h.YKSDataV5.getTopicTestInsights()[0].accuracy,90,'edit insightı anında yenilemeli');
  h.YKSDataV5.patch(event.id,{meta:{deletedAt:new Date().toISOString(),deletedReason:'user-delete'}});
  assert.equal(h.YKSDataV5.getTopicTestInsights().length,0,'tombstone insighttan çıkmalı');
  h.YKSDataV5.patch(event.id,{meta:{deletedAt:null,deletedReason:''}});
  assert.equal(h.YKSDataV5.getTopicTestInsights()[0].accuracy,90,'undo insightı geri getirmeli');
  assert.equal(h.YKSDataV5.getLearningModel().studyEvents.filter(x=>x.result==='wrong').length,0,'aggregate yanlışlar fake question-level wrong üretmemeli');
}
{
  const h=harness([{id:'legacy',timestamp:Date.now(),dateKey:day(),source:'measurement',exam:'TYT',subject:'Türkçe',topic:'Paragraf',result:'correct',questionCount:1,meta:{}}]);
  assert.equal(h.YKSDataV5.getLearningModel().correct,1,'legacy StudyEvent davranışı korunmalı');
}

assert.match(teacherUi,/Konu testi kanıtı:/,'Aktif Teacher UI topic-test özetini göstermeli');
assert.match(teacherLaunch,/topicTestEvidence:insight/,'Teacher source-launch interceptor aynı özeti iletmeli');
assert.match(teacherApi,/toplu performans sinyalidir, kesin mastery değildir/,'Teacher guard bulunmalı');
assert.match(coachUi,/topicTestInsights:topicTestInsights\(\)/,'Coach payload topic-test özeti içermeli');
assert.match(coachApi,/recency, soru hacmi, tekrar sayısı ve trendi/,'Coach karar kuralı bulunmalı');
assert.match(teacherApi,/Aggregate wrong sayısını belirli yanlış sorular/);
assert.match(coachApi,/Aggregate wrong sayısını belirli soru yanlışı/);
assert.match(cloudCode,/state\.studyEvents=mergeStudyEvents\(state\.studyEvents\|\|\[\],remoteEvents\)/,'cloud ledger reconcile aynı StudyEvent kaynağını yenilemeli');

console.log('TOPIC TEST LEARNING INTEGRATION TEST MATRIX: PASS');
