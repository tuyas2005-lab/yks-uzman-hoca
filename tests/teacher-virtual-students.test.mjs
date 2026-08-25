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
});
