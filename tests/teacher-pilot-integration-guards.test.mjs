import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const policy=fs.readFileSync(new URL('../app-personal-teacher-policy-v3.js',import.meta.url),'utf8');
const launch=fs.readFileSync(new URL('../app-personal-teacher-source-launch-v3.js',import.meta.url),'utf8');
const mini=fs.readFileSync(new URL('../app-mini-tests-source.js',import.meta.url),'utf8');
const teacherUi=fs.readFileSync(new URL('../app-personal-teacher-v2.js',import.meta.url),'utf8');
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

test('teacher and mini test preserve usable phone touch layout',()=>{
  assert.match(teacherUi,/\.pt2-task>div:last-child\{grid-column:1\/-1/);
  assert.match(teacherUi,/min-height:44px/);
  assert.match(mini,/\.mts-progress\{align-items:flex-start;flex-direction:column\}/);
  assert.match(mini,/\.mts-open\{width:100%;min-height:44px\}/);
});
