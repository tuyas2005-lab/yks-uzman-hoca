import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const code=fs.readFileSync(new URL('../app-teacher-pilot-v1.js',import.meta.url),'utf8');
function engine(){const state={studyEvents:[]},context={state,console,Date,structuredClone};context.window=context;context.globalThis=context;context.YKSDataV5={record(e){const x=structuredClone(e);state.studyEvents.push(x);return x}};vm.createContext(context);vm.runInContext(code,context);return context.YKSTeacherPilotV1}

test('unified engine covers the full teacher progression',()=>{
  const P=engine(),cases=[
    [{total:0,score:null},'diagnostic'],[{total:2,score:100},'diagnostic'],
    [{total:5,score:20},'foundation'],[{total:5,score:40},'repair'],
    [{total:5,score:90,recentWrong:2},'repair'],[{total:5,score:65},'reinforce'],
    [{total:8,score:85,staleDays:2},'maintain'],[{total:8,score:95,staleDays:2},'challenge'],
    [{total:8,score:95,staleDays:14},'spaced'],[{total:8,score:95,todayCount:10,dailyGoal:10},'complete']
  ];
  for(const [input,want] of cases)assert.equal(P.decideTeacherSession(input).mode,want,JSON.stringify(input));
});

test('daily completion never interrupts an active teacher session',()=>{
  const d=engine().decideTeacherSession({total:5,score:65,todayCount:10,dailyGoal:10,sessionInProgress:true});
  assert.equal(d.mode,'reinforce');
});

test('review memory expands, shortens and reopens deterministically',()=>{
  const P=engine();
  assert.deepEqual({...P.nextReview({dateKey:'2026-08-25',answered:3,correct:3,staleCheck:true,previousIntervalDays:14})},{days:30,reason:'retention-passed',dateKey:'2026-09-24'});
  assert.equal(P.nextReview({dateKey:'2026-08-25',answered:3,correct:2}).days,4);
  assert.equal(P.nextReview({dateKey:'2026-08-25',answered:3,correct:1}).days,1);
  assert.equal(P.nextReview({dateKey:'2026-08-25',answered:1,correct:1,wrongRecovered:true}).days,2);
});

test('completed session memory controls the next session and due review',()=>{
  const P=engine();
  assert.equal(P.resumeMode({previousMode:'diagnostic',nextMode:'reinforce',nextReviewDate:'2026-09-01',today:'2026-08-26',closureComplete:true}),'reinforce');
  assert.equal(P.resumeMode({previousMode:'reinforce',nextMode:'maintain',nextReviewDate:'2026-09-01',today:'2026-08-26',closureComplete:true}),'maintain');
  assert.equal(P.resumeMode({previousMode:'challenge',nextMode:'challenge',nextReviewDate:'2026-09-08',today:'2026-08-26',closureComplete:true}),'maintain');
  assert.equal(P.resumeMode({previousMode:'maintain',nextMode:'challenge',nextReviewDate:'2026-09-08',today:'2026-09-08',closureComplete:true}),'spaced');
  assert.equal(P.resumeMode({previousMode:'challenge',nextMode:'challenge',nextReviewDate:'2026-09-08',today:'2026-08-26',closureComplete:false}),'repair');
});

test('virtual student progresses through repair, reinforcement, challenge and spaced review',()=>{
  const P=engine();
  const first=P.decideTeacherSession({total:5,score:40,recentWrong:2});
  assert.equal(first.mode,'repair');
  assert.equal(P.resumeMode({previousMode:'diagnostic',nextMode:first.mode,nextReviewDate:'2026-08-28',today:'2026-08-26',closureComplete:false}),'repair');

  const repaired=P.transitionMode('repair',P.decideTeacherSession({total:5,score:100}).mode);
  assert.equal(repaired,'reinforce','başarılı onarımın ardından zorluk bir basamak artmalı');
  assert.equal(P.resumeMode({previousMode:'repair',nextMode:repaired,nextReviewDate:'2026-09-09',today:'2026-08-27',closureComplete:true}),'reinforce');

  const reinforced=P.transitionMode('reinforce',P.decideTeacherSession({total:5,score:100}).mode);
  assert.equal(reinforced,'maintain','tek güçlü pekiştirme doğrudan meydan okumaya geçmemeli');
  assert.equal(P.resumeMode({previousMode:'reinforce',nextMode:reinforced,nextReviewDate:'2026-09-10',today:'2026-08-28',closureComplete:true}),'maintain');

  const challenged=P.transitionMode('maintain',P.decideTeacherSession({total:8,score:95,staleDays:1}).mode);
  assert.equal(challenged,'challenge');
  assert.equal(P.resumeMode({previousMode:'maintain',nextMode:challenged,nextReviewDate:'2026-09-11',today:'2026-08-29',closureComplete:true}),'challenge','ayrı zamandaki ikinci güçlü kanıt meydan okumayı açmalı');
  assert.equal(P.resumeMode({previousMode:'maintain',nextMode:challenged,nextReviewDate:'2026-09-11',today:'2026-09-11',closureComplete:true}),'spaced','planlı kontrol günü zorluk artışından önce gelmeli');
});

test('effort rewards do not punish mistakes and praise evidence',()=>{
  const P=engine();
  assert.deepEqual(JSON.parse(JSON.stringify(P.rewardFor({attempt:true}))),{points:2,awards:[{key:'attempt',points:2}],praiseId:'effort-noticed'});
  assert.equal(P.rewardFor({attempt:true,correct:true,hardCorrect:true}).points,7);
  assert.equal(P.rewardFor({attempt:true,unableHonest:true}).points,3);
  assert.equal(P.rewardFor({wrongReviewed:true,errorReason:true,similarCorrect:true,wrongRecovered:true}).points,11);
  assert.equal(P.rewardFor({topicImproved:true}).praiseId,'measurable-growth');
});

test('reward events have deterministic ids and cannot double-award',()=>{
  const P=engine(),e=P.buildRewardEvent({rewardId:'session-1:question-1',sessionId:'session-1',topicId:'tyt.matematik.problemler',dateKey:'2026-08-25',behaviors:{attempt:true,correct:true,mediumCorrect:true}});
  assert.equal(e.id,'teacher-reward:session-1:question-1');assert.equal(e.questionCount,0);assert.equal(e.meta.points,6);assert.equal(P.recordOnce(e).duplicate,false);assert.equal(P.recordOnce(e).duplicate,true);
});

test('mode configurations select controlled source difficulty',()=>{
  const P=engine();
  assert.deepEqual({...P.decideTeacherSession({total:5,score:20}).config.difficultyCounts},{KOLAY:4,ORTA:1,ZOR:0});
  assert.deepEqual({...P.decideTeacherSession({total:8,score:95,staleDays:1}).config.difficultyCounts},{KOLAY:0,ORTA:2,ZOR:3});
  assert.equal(P.decideTeacherSession({total:8,score:95,staleDays:10}).config.count,3);
  const items=[...Array(4)].map((_,i)=>({id:`k${i}`,difficulty:'KOLAY'})).concat([...Array(4)].map((_,i)=>({id:`o${i}`,difficulty:'ORTA'})),[...Array(4)].map((_,i)=>({id:`z${i}`,difficulty:'ZOR'})));
  const foundation=P.selectByDifficulty(items,P.modeConfig.foundation),challenge=P.selectByDifficulty(items,P.modeConfig.challenge);
  assert.deepEqual(Array.from(foundation,x=>x.difficulty),['KOLAY','KOLAY','KOLAY','KOLAY','ORTA']);
  assert.deepEqual(Array.from(challenge,x=>x.difficulty),['ORTA','ORTA','ZOR','ZOR','ZOR']);
  const shortage=P.difficultySelection(items.filter(x=>x.difficulty==='KOLAY'),P.modeConfig.challenge);
  assert.equal(shortage.distributionExact,false);assert.deepEqual({...shortage.shortages},{ORTA:2,ZOR:3});assert.equal(shortage.items.length,0,'challenge kolay sorularla sessizce doldurulmamalı');
  assert.equal(P.transitionMode('repair','challenge'),'reinforce','tek başarılı onarım doğrudan challenge açmamalı');
  assert.equal(P.transitionMode('reinforce','challenge'),'maintain','challenge farklı zamanda güçlü kanıt gerektirmeli');
});

test('pool health warns before a difficulty source is exhausted',()=>{
  const P=engine();
  assert.equal(P.poolHealth({KOLAY:15,ORTA:15,ZOR:15}).overall,'green');
  assert.equal(P.poolHealth({KOLAY:14,ORTA:15,ZOR:15}).overall,'yellow');
  assert.equal(P.poolHealth({KOLAY:8,ORTA:7,ZOR:15}).overall,'orange');
  const critical=P.poolHealth({KOLAY:3,ORTA:2,ZOR:0});
  assert.equal(critical.overall,'red');
  assert.deepEqual(JSON.parse(JSON.stringify(critical.counts)),{KOLAY:3,ORTA:2,ZOR:0});
  assert.deepEqual(Array.from(critical.alerts,x=>[x.difficulty,x.level,x.neededForGreen]),[['KOLAY','orange',12],['ORTA','red',13],['ZOR','red',15]]);
});

test('audit trail reconstructs decision, result, reward and next action',()=>{
  const P=engine(),decision=P.buildDecisionEvent({decisionId:'d1',sessionId:'s1',dateKey:'2026-08-25',topicId:'tyt.matematik.problemler',mode:'diagnostic',reasonCodes:['insufficient-data'],reasonText:'Önce gerçek kaynaklarla ölç.',evidence:{measuredCount:0,score:null,recentWrong:0,recentSignals:0},selection:{questionIds:['q1','q2','q3'],difficultyCounts:{KOLAY:2,ORTA:1,ZOR:0},total:3}}),results=[['q1','correct','answered-source'],['q2','wrong','answered-source'],['q3','unknown','unable']].map(([id,result,interaction],i)=>({id:`result-${id}`,timestamp:10+i,dateKey:'2026-08-25',source:'source-question-result',topicKey:'tyt.matematik.problemler',result,interaction,meta:{catalogId:id,teacherSessionId:'s1',wrongKind:interaction==='unable'?'unable':result==='wrong'?'wrong':''}})),outcome=P.buildOutcomeEvent({sessionId:'s1',decisionId:'d1',dateKey:'2026-08-25',topicId:'tyt.matematik.problemler',questionIds:['q1','q2','q3'],expectedCount:3,answeredCount:3,correctCount:1,wrongCount:1,unableCount:1,accuracy:33,adaptation:{changed:true,previousMode:'diagnostic',nextMode:'repair'},nextReview:{days:1,dateKey:'2026-08-26'}}),reward=P.buildRewardEvent({rewardId:'s1:completed',sessionId:'s1',dateKey:'2026-08-25',topicId:'tyt.matematik.problemler',behaviors:{teacherTaskCompleted:true}}),closure={id:'closure-1',timestamp:20,dateKey:'2026-08-25',source:'wrong-closure',topicKey:'tyt.matematik.problemler',meta:{wrongOf:'result-q2'}};
  const [a]=P.buildAuditTrail([decision,...results,outcome,reward,closure],{topicId:'tyt.matematik.problemler'});
  assert.equal(a.status,'completed');assert.deepEqual(JSON.parse(JSON.stringify(a.result)),{answered:3,correct:1,wrong:1,unable:1,accuracy:33});assert.equal(a.rewardPoints,10);assert.equal(a.closureCount,1);assert.equal(a.adaptation.nextMode,'repair');assert.equal(a.nextReview.dateKey,'2026-08-26');assert.deepEqual(Array.from(a.questionIds),['q1','q2','q3']);
});
