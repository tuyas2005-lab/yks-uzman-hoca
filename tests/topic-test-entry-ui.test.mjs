import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const taxonomyCode=fs.readFileSync(new URL('../data/yks-topic-taxonomy-v1.js',import.meta.url),'utf8');
const dataCode=fs.readFileSync(new URL('../app-data-v5.js',import.meta.url),'utf8');
const uiCode=fs.readFileSync(new URL('../app-topic-test-entry.js',import.meta.url),'utf8');

function fakeNode(){return{appendChild(){},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},closest(){return null}}}
function harness({online=true}={}){
  let saves=0;const state={studyEvents:[],meta:{v5DemoCleaned:true},profile:{track:''}};
  const document={head:fakeNode(),body:fakeNode(),createElement:fakeNode,addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}};
  const context={state,document,console,Date,structuredClone,crypto,localStorage:{setItem(){saves++}},navigator:{onLine:online},setTimeout(){return 0},save(){saves++}};
  context.window=context;context.globalThis=context;vm.createContext(context);vm.runInContext(taxonomyCode,context);vm.runInContext(dataCode,context);vm.runInContext(uiCode,context);
  return{...context,get saves(){return saves}};
}
const input=(actionId='phase-b-1',extra={})=>({actionId,dateKey:'2026-08-23',exam:'TYT',subjectId:'matematik',topicId:'tyt.matematik.koklu-sayilar',resource:'345',testName:'Test 3',durationMinutes:27,total:20,correct:14,wrong:4,blank:2,...extra});

{
  const h=harness(),saved=h.YKSTopicTestEntry.saveInput(input());
  assert.equal(saved.ok,true);assert.equal(h.state.studyEvents.filter(x=>x.source==='topic-test').length,1);
  assert.equal(h.YKSDataV5.measurementOf(saved.event).net,13);
}
{
  const h=harness(),bad=h.YKSTopicTestEntry.saveInput(input('bad',{blank:3}));
  assert.equal(bad.ok,false);assert.equal(h.state.studyEvents.length,0);
}
{
  const h=harness();h.YKSTopicTestEntry.saveInput(input('double'));h.YKSTopicTestEntry.saveInput(input('double'));
  assert.equal(h.state.studyEvents.filter(x=>x.source==='topic-test').length,1);
}
{
  const h=harness(),created=h.YKSTopicTestEntry.saveInput(input('edit')).event,createdAt=created.createdAt;
  const edited=h.YKSTopicTestEntry.saveInput(input('edit',{correct:15,wrong:3}),created.id);
  assert.equal(edited.ok,true);assert.equal(edited.event.id,created.id);assert.equal(edited.event.createdAt,createdAt);assert.equal(h.state.studyEvents.length,1);assert.equal(edited.event.meta.counts.correct,15);
}
{
  const h=harness(),created=h.YKSTopicTestEntry.saveInput(input('delete')).event;
  assert.equal(h.YKSTopicTestEntry.tombstone(created.id).ok,true);assert.equal(h.state.studyEvents[0].meta.deletedReason,'user-delete');assert.equal(h.YKSTopicTestEntry.visibleRecords().length,0);
  assert.equal(h.YKSTopicTestEntry.undo(created.id).ok,true);assert.equal(h.state.studyEvents[0].id,created.id);assert.equal(h.state.studyEvents[0].meta.deletedAt,null);assert.equal(h.YKSTopicTestEntry.visibleRecords().length,1);
}
{
  const h=harness({online:false}),before=h.saves,result=h.YKSTopicTestEntry.saveInput(input('offline'));
  assert.equal(result.ok,true);assert.ok(h.saves>before);assert.equal(h.YKSTopicTestEntry.visibleRecords().length,1);
}
{
  const h=harness(),subjects=h.YKSTopicTestEntry.subjectsFor('TYT'),topics=h.YKSTopicTestEntry.topicOptions('TYT','matematik');
  assert.ok(subjects.some(x=>x.subjectId==='matematik'));assert.ok(topics.some(x=>x.id==='tyt.matematik.koklu-sayilar'&&x.topic==='Köklü Sayılar'));
  assert.equal(h.YKSTopicTestEntry.topicOptions('AYT','matematik').length,0);
  assert.equal(h.YKSTopicTestEntry.saveInput(input('unknown',{exam:'AYT',topicId:''})).ok,false);assert.equal(h.state.studyEvents.length,0);
}

console.log('TOPIC TEST ENTRY UI TEST MATRIX: PASS');
