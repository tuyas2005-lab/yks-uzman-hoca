import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const policy=fs.readFileSync(new URL('../app-personal-teacher-policy-v3.js',import.meta.url),'utf8');
const launch=fs.readFileSync(new URL('../app-personal-teacher-source-launch-v3.js',import.meta.url),'utf8');
const mini=fs.readFileSync(new URL('../app-mini-tests-source.js',import.meta.url),'utf8');
const teacherUi=fs.readFileSync(new URL('../app-personal-teacher-v2.js',import.meta.url),'utf8');
const sourceViewer=fs.readFileSync(new URL('../app-source-question-viewer.js',import.meta.url),'utf8');
const teacherWrongScope=fs.readFileSync(new URL('../app-teacher-wrong-scope.js',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-home-links.js',import.meta.url),'utf8');

test('empty student starts from a canonical pilot topic',()=>{
  assert.match(policy,/topic:'Problemler',topicKey:'tyt\.matematik\.problemler'/);
  assert.match(policy,/filter\(x=>window\.YKSTeacherPilotV1\?\.resolveTopic/);
  assert.match(loader,/makeGroup\('official',\['tests','questionIndex','teacher'\]/,'Teacher açıldığında gerçek katalog da yüklenmeli');
  assert.doesNotMatch(policy,/!window\.getStudentStrategy\|\|!window\.YKSQuestionCatalogV1/,'policy katalog tamamlanana kadar eski rendererda kalmamalı');
});

test('teacher query resolves pool alias before catalog selection and blocks non-pilot topics',()=>{
  assert.match(launch,/poolTopic=pilot\.poolTopics\?\.\[0\]\|\|pilot\.displayTitle/);
  assert.match(launch,/if\(!pilot\)return\{items:\[\],count:0/);
  assert.match(launch,/if\(!p\.count\|\|!p\.distributionExact\)return/);
  assert.match(launch,/function sourceHealth\(ctx\)/);
  assert.match(launch,/getSolvedIds/);
  assert.match(launch,/P\.resolveItem\?\.\(x\)\?\.id===pilot\.id/);
  assert.match(launch,/if\(h\.overall==='green'\)\{current\?\.remove\(\);return\}/);
  assert.match(launch,/Bu konuda kaynak azalıyor/);
  assert.match(launch,/neededForGreen/);
});

test('mini test consumes exact teacher item ids instead of repicking',()=>{
  assert.match(mini,/teacherTask\.itemIds\.map\(id=>map\.get\(id\)\)/);
  assert.match(mini,/current\.every\(x=>task\.itemIds\?\.includes\(x\.id\)\)/);
  assert.match(mini,/function renderTeacherTaskOrHome\(\)/);
  assert.match(mini,/autoStartedTeacherSession===task\.sessionId&&activeQuery&&current\.length/);
  assert.match(mini,/startSet\(\{exam:selection\.exam,subject:selection\.subject,year:'latest',topic:selection\.topic\},selection\.count\)/);
});

test('same daily plan uses a deterministic launch revision',()=>{
  assert.match(launch,/revision=hash\(`/);
  assert.doesNotMatch(launch,/sessionId=.*Date\.now/);
});

test('source health warning stays hidden while healthy and preserves open state when shown',()=>{
  assert.match(launch,/current\?\.dataset\.pt3Signature===signature/);
  assert.match(launch,/const wasOpen=!!current\?\.open/);
  assert.match(launch,/card\.open=wasOpen/);
});

test('student teacher page contains only real-question and real-wrong actions',()=>{
  assert.doesNotMatch(policy,/Hızlı Tekrar|Hızlı Onarım|Kısa Pekiştirme|pt2Recap|teacher-recap/);
  assert.match(policy,/Gerçek sorular ve gerçek yanlışlar/);
  assert.match(policy,/return !!\(d\.testDone&&d\.wrongDone\)/);
  assert.doesNotMatch(policy,/Koç payı|Karar Kanıtları|ürün sahibi|auditHtml/);
  assert.match(policy,/performanceHtml\?`<details/);
  assert.match(teacherUi,/window\.__teacherPolicyPending=true/);
  assert.match(teacherUi,/Kişisel Öğretmen hazırlanıyor/);
  assert.match(policy,/window\.__teacherPolicyPending=false/);
});

test('teacher and mini test preserve usable phone touch layout',()=>{
  assert.match(teacherUi,/\.pt2-task>div:last-child\{grid-column:1\/-1/);
  assert.match(teacherUi,/min-height:44px/);
  assert.match(teacherUi,/#teacher \.back\{width:44px;height:44px/);
  assert.match(teacherUi,/\.pt2-details>details>summary\{[^}]*min-height:44px/);
  assert.match(teacherUi,/\.pt2-audit-grid,\.pt2-health-grid\{grid-template-columns:1fr\}/);
  assert.match(mini,/\.mts-progress\{align-items:flex-start;flex-direction:column\}/);
  assert.match(mini,/\.mts-open\{width:100%;min-height:44px\}/);
  assert.match(mini,/#tests \.back\{width:44px;height:44px/);
  assert.match(mini,/\.mts-form select\{height:44px/);
  assert.match(teacherWrongScope,/\.tws-reason\{min-height:44px/);
  assert.match(sourceViewer,/#sourceQuestion \.back\{width:44px;height:44px/);
});

test('every teacher question result renders points and praise immediately',()=>{
  assert.match(sourceViewer,/function rewardFeedback\(event,kind\)/);
  assert.match(sourceViewer,/Emek Puanı/);
  assert.match(sourceViewer,/Öğretmenin:/);
});

test('teacher wrong task completes only after real four-evidence closure',()=>{
  assert.match(teacherWrongScope,/rows\.every\(x=>x\.meta\?\.wrongClosed===true\)/);
  assert.match(teacherWrongScope,/getWrongLearningEvidence/);
  assert.match(teacherWrongScope,/data-tws-reason/);
  assert.match(teacherWrongScope,/markWrongLearningEvidence/);
  assert.doesNotMatch(teacherWrongScope,/wrongDone=rows\.every\(x=>seen\.has\(x\.id\)\)/);
});

test('teacher persists session memory and observes student initiated mini tests',()=>{
  assert.match(mini,/state\.teacher\.topicMemory\[task\.topicId\]/);
  assert.match(mini,/studentInitiated:!teacherSet/);
  assert.match(mini,/previousIntervalDays/);
  assert.match(mini,/retention30Passed/);
  assert.match(mini,/state\.teacher\.lastPraise=\{\.\.\.completionReward\.meta/);
  assert.match(policy,/resumeMode/);
  assert.match(policy,/Kendi çözdüğün Mini Test/);
  assert.match(policy,/Sonraki kontrol/);
  assert.match(policy,/source==='teacher-session-outcome'/);
  assert.match(policy,/derivedFromOutcome:true/);
  assert.match(policy,/selfAt>Number\(memory\?\.studentEvidenceAt\|\|memory\?\.lastCompletedAt\|\|0\)/);
  assert.match(policy,/studentInitiated:true/);
  assert.match(policy,/newerOpenWrong/);
  assert.match(policy,/reopenedByWrongId/);
  assert.match(policy,/transitionMode\?\.\(previous,raw\?\.mode/);
  assert.match(policy,/Kapanmamış yanlış varsa öğretmen tarihi beklemez/);
  assert.match(policy,/modeInfo\[nextMemoryMode\]/);
  assert.doesNotMatch(policy,/Öğretmen karar geçmişi — ürün sahibi/);
  assert.match(policy,/d\.decisionEvidence=/);
  assert.match(policy,/d\.reasonText=reason\(f,d\)/);
  assert.match(teacherWrongScope,/mem\.closureComplete=!!d\.wrongDone/);
});
