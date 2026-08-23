import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const taxonomyCode=fs.readFileSync(new URL('../data/yks-topic-taxonomy-v1.js',import.meta.url),'utf8');
const dataCode=fs.readFileSync(new URL('../app-data-v5.js',import.meta.url),'utf8');

function node(){return{appendChild(){},querySelector(){return null},querySelectorAll(){return[]},closest(){return null},addEventListener(){}}}
function harness(seed=[]){
  const state={studyEvents:structuredClone(seed),meta:{v5DemoCleaned:true},profile:{track:''}};
  const document={head:node(),body:node(),createElement:node,addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}};
  const context={state,document,console,Date,structuredClone,localStorage:{setItem(){}},setTimeout(){return 0},save(){}};
  context.window=context;context.globalThis=context;
  vm.createContext(context);vm.runInContext(taxonomyCode,context);vm.runInContext(dataCode,context);
  return context;
}
const base=(actionId='a1',extra={})=>({actionId,exam:'TYT',subjectId:'matematik',topicId:'tyt.matematik.koklu-sayilar',resource:'345',total:20,correct:14,wrong:4,blank:2,...extra});

{
  const h=harness(),result=h.YKSDataV5.recordTopicTest(base());
  assert.equal(result.ok,true);assert.equal(result.event.result,'unknown');
  assert.deepEqual({...h.YKSDataV5.measurementOf(result.event)},{questionCount:20,evaluatedCount:20,answeredCount:18,correct:14,wrong:4,blank:2,net:13,accuracy:.7});
  assert.equal(result.event.meta.net,undefined);assert.equal(result.event.meta.accuracy,undefined);assert.equal(result.event.meta.blankRate,undefined);
  assert.equal(result.event.meta.resource,'345');assert.equal(result.event.meta.resourceKey,'345');
}
{
  const h=harness(),before=h.state.studyEvents.length,result=h.YKSDataV5.recordTopicTest(base('bad',{blank:3}));
  assert.equal(result.ok,false);assert.ok(result.errors.includes('counts'));assert.equal(h.state.studyEvents.length,before);
  const invalid=[
    base('exam',{exam:'LGS'}),base('topic',{topicId:'tyt.matematik.bilinmeyen'}),base('resource',{resource:''}),
    base('total',{total:501,correct:495}),base('negative',{correct:-1,wrong:19}),base('duration',{durationMinutes:1441}),
    base('future',{dateKey:'2999-01-01'}),base('resource-long',{resource:'x'.repeat(121)}),base('name-long',{testName:'x'.repeat(121)})
  ];
  for(const input of invalid)assert.equal(h.YKSDataV5.recordTopicTest(input).ok,false);
  assert.equal(h.state.studyEvents.length,before);
}
{
  const h=harness(),first=h.YKSDataV5.recordTopicTest(base('same')),second=h.YKSDataV5.recordTopicTest(base('same'));
  assert.equal(first.event.id,'topic-test:same');assert.equal(second.duplicate,true);assert.equal(h.state.studyEvents.filter(x=>x.source==='topic-test').length,1);
}
{
  const h=harness();h.YKSDataV5.recordTopicTest(base('one'));h.YKSDataV5.recordTopicTest(base('two'));
  assert.equal(h.state.studyEvents.filter(x=>x.source==='topic-test').length,2);
}
{
  const h=harness();h.YKSDataV5.recordTopicTest(base('today'));
  assert.equal(h.YKSDataV5.getLearningModel().todayCount,20);
}
{
  const h=harness(),past='2026-08-22';h.YKSDataV5.recordTopicTest(base('past',{dateKey:past}));
  if(h.YKSDataV5.todayKey()!==past)assert.equal(h.YKSDataV5.getLearningModel().todayCount,0);
}
{
  const h=harness(),saved=h.YKSDataV5.recordTopicTest(base('deleted')).event;
  h.YKSDataV5.patch(saved.id,{meta:{deletedAt:new Date().toISOString(),deletedReason:'user'}});
  const model=h.YKSDataV5.getLearningModel();assert.equal(model.questionCount,0);assert.equal(model.todayCount,0);assert.equal(model.topics.length,0);
}
{
  const h=harness(),event=h.YKSDataV5.recordTopicTest(base('wrongs')).event;
  assert.equal(event.meta.wrongRecord,undefined);assert.equal(event.meta.retryOf,undefined);assert.equal(event.result,'unknown');
  assert.equal(h.YKSDataV5.getLearningModel().studyEvents.filter(x=>x.result==='wrong').length,0);
}
{
  const legacy={id:'legacy-1',timestamp:1_800_000_000_000,dateKey:'2026-08-20',source:'measurement',exam:'TYT',subject:'Matematik',topic:'Köklü Sayılar',result:'wrong',questionCount:1,meta:{}};
  const h=harness([legacy]),m=h.YKSDataV5.measurementOf(h.state.studyEvents[0]);
  assert.equal(m.questionCount,1);assert.equal(m.wrong,1);assert.equal(m.net,-.25);assert.equal(m.accuracy,0);
}
{
  const legacy={id:'legacy-2',timestamp:1_800_000_000_000,dateKey:'2026-08-20',source:'measurement',exam:'TYT',subject:'Matematik',topic:'Köklü Sayılar',result:'correct',questionCount:1,meta:{}};
  const h=harness([legacy]);h.YKSDataV5.recordTopicTest(base('mixed'));const model=h.YKSDataV5.getLearningModel();
  assert.equal(model.questionCount,21);assert.equal(model.correct,15);assert.equal(model.wrong,4);assert.equal(model.blank,2);assert.equal(model.net,14);
  assert.equal(model.topics.length,1);assert.equal(model.topics[0].total,21);
}
{
  const h=harness();assert.deepEqual({...h.YKSDataV5.normalizeResource('Bilgi Sarmal')},{title:'Bilgi Sarmal',key:'bilgi-sarmal',publisher:'Bilgi Sarmal'});
  assert.deepEqual({...h.YKSDataV5.normalizeResource('Yerel Yayın')},{title:'Yerel Yayın',key:'custom:yerel-yayın',publisher:'Diğer'});
}
{
  const h=harness(),event=h.YKSDataV5.recordTopicTest(base('topic')).event;
  assert.equal(event.meta.topicId,'tyt.matematik.koklu-sayilar');assert.equal(event.topicKey,'tyt.matematik.koklu-sayilar');
  const legacy=h.YKSDataV5.record({source:'measurement',exam:'TYT',subject:'Matematik',topic:'Köklü Sayılar',result:'correct',questionCount:1},{persistNow:false});
  assert.equal(legacy.topicKey,'köklü sayılar');
}

console.log('TOPIC TEST ENTRY TEST MATRIX: PASS');
