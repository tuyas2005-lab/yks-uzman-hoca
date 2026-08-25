import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const pilotCode=fs.readFileSync(new URL('../app-teacher-pilot-v1.js',import.meta.url),'utf8');
const pool=JSON.parse(fs.readFileSync(new URL('../data/catalog/meb-manual-student-pool-1523.json',import.meta.url),'utf8'));

function harness(){
  const state={studyEvents:[]};
  const context={state,console,Date,structuredClone};
  context.window=context;context.globalThis=context;
  context.YKSDataV5={record(event){const row=structuredClone(event);state.studyEvents.push(row);return row}};
  vm.createContext(context);vm.runInContext(pilotCode,context,{filename:'app-teacher-pilot-v1.js'});
  return context;
}

test('Pilot topics resolve exact taxonomy IDs and pool aliases',()=>{
  const h=harness(),P=h.YKSTeacherPilotV1;
  assert.equal(P.resolveTopic('Problemler').id,'tyt.matematik.problemler');
  assert.equal(P.resolveTopic('Üçgenler').id,'tyt.matematik.ucgenler');
  assert.equal(P.resolveTopic('Çokgenler ve Dörtgenler').id,'tyt.matematik.cokgenler-ve-dortgenler');
  assert.equal(P.resolveTopic('Çokgen ve Dörtgenlerin Özellikleri').id,'tyt.matematik.cokgenler-ve-dortgenler');
  assert.equal(P.resolveTopic('tyt.matematik.cokgenler-ve-dortgenler').id,'tyt.matematik.cokgenler-ve-dortgenler');
  assert.equal(P.resolveTopic('Kümeler'),null,'non-pilot topic must not enter the Limited Pilot');
});

test('Pilot pool coverage and difficulty distribution stay exact',()=>{
  const h=harness(),P=h.YKSTeacherPilotV1,ready=pool.filter(x=>x.status==='student-ready'&&x.answerVerified===true&&x.manualCrop===true);
  const expected={
    'tyt.matematik.problemler':{total:162,KOLAY:57,ORTA:67,ZOR:38},
    'tyt.matematik.ucgenler':{total:73,KOLAY:23,ORTA:24,ZOR:26},
    'tyt.matematik.cokgenler-ve-dortgenler':{total:26,KOLAY:9,ORTA:9,ZOR:8}
  };
  for(const [topicId,want] of Object.entries(expected)){
    const rows=ready.filter(x=>P.resolveItem(x)?.id===topicId),actual={total:rows.length,KOLAY:0,ORTA:0,ZOR:0};
    rows.forEach(x=>actual[x.difficulty]++);
    assert.deepEqual(actual,want,topicId);
  }
});

test('Decision and outcome contracts are canonical, zero-count and idempotent',()=>{
  const h=harness(),P=h.YKSTeacherPilotV1;
  const decision=P.buildDecisionEvent({decisionId:'2026-08-25-problemler-r1',sessionId:'2026-08-25-problemler-s1',dateKey:'2026-08-25',topicId:'tyt.matematik.problemler',mode:'diagnostic',reasonCodes:['insufficient-data'],evidence:{measuredCount:0},selection:{questionIds:['q1','q2','q3','q4','q5'],difficultyCounts:{KOLAY:3,ORTA:2,ZOR:0},total:5}});
  assert.equal(decision.source,'teacher-decision');
  assert.equal(decision.questionCount,0);
  assert.equal(decision.topicKey,'tyt.matematik.problemler');
  assert.equal(decision.meta.topicId,decision.topicKey);
  assert.equal(decision.meta.schema,'teacher-decision-v1');
  const first=P.recordOnce(decision),duplicate=P.recordOnce(decision);
  assert.equal(first.duplicate,false);assert.equal(duplicate.duplicate,true);
  assert.equal(h.state.studyEvents.filter(x=>x.id===decision.id).length,1);

  const outcome=P.buildOutcomeEvent({sessionId:decision.meta.sessionId,decisionId:decision.meta.decisionId,dateKey:'2026-08-25',topic:'Problemler',questionIds:['q1','q2','q3','q4','q5'],expectedCount:5,answeredCount:5,correctCount:3,wrongCount:1,unableCount:1,accuracy:60,adaptation:{changed:true,previousMode:'diagnostic',nextMode:'repair'}});
  assert.equal(outcome.source,'teacher-session-outcome');
  assert.equal(outcome.questionCount,0,'outcome must not double-count source results');
  assert.equal(outcome.meta.schema,'teacher-session-outcome-v1');
  assert.ok(outcome.signals.includes('adaptation-observed'));
  const out1=P.recordOnce(outcome),out2=P.recordOnce(outcome);
  assert.equal(out1.duplicate,false);assert.equal(out2.duplicate,true);
  assert.equal(h.state.studyEvents.filter(x=>x.id===outcome.id).length,1);
});

test('Contract rejects missing pilot identity and correlation IDs',()=>{
  const P=harness().YKSTeacherPilotV1;
  assert.throws(()=>P.buildDecisionEvent({decisionId:'d',sessionId:'s',topic:'Kümeler'}),/canonical topic/);
  assert.throws(()=>P.buildDecisionEvent({topic:'Problemler'}),/decisionId and sessionId/);
  assert.throws(()=>P.buildOutcomeEvent({topic:'Problemler'}),/sessionId and decisionId/);
});
