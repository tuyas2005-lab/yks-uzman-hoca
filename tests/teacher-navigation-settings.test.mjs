import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');

test('teacher guidance is visually separated as a teacher instruction',()=>{
  const policy=read('app-personal-teacher-policy-v3.js');
  const ui=read('app-personal-teacher-v2.js');
  assert.match(policy,/Öğretmeninden bugünkü not/);
  assert.match(policy,/pt2-guidance/);
  assert.match(ui,/\.pt2-guidance\{/);
  assert.match(ui,/font-size:15px/);
});

test('effort points are promoted beside the daily plan without a duplicate note',()=>{
  const policy=read('app-personal-teacher-policy-v3.js');
  const ui=read('app-personal-teacher-v2.js');
  assert.match(policy,/class="pt2-hero-side"/);
  assert.match(policy,/class="pt2-reward"/);
  assert.match(policy,/Emek Puanı/);
  assert.doesNotMatch(policy,/insertAdjacentElement\('afterend',card\)/);
  assert.match(ui,/\.pt2-reward\{/);
  assert.match(ui,/linear-gradient\(145deg,#fff9cf/);
  assert.match(ui,/@media\(max-width:600px\).*\.pt2-hero-side\{display:grid/);
});

test('teacher-facing copy sounds human while raw statistics stay in evaluation',()=>{
  const policy=read('app-personal-teacher-policy-v3.js');
  assert.match(policy,/bazı sorularda takıldığını görüyorum; bu çok normal/);
  assert.match(policy,/sana ne eksik ne de fazla çalışma vereyim/);
  assert.match(policy,/Hazırsan şimdi seni biraz zorlayacağım/);
  assert.match(policy,/rawName=String\(state\.profile\?\.name/);
  assert.doesNotMatch(policy,/return`\$\{f\.topic\}: \$\{score\}/);
  assert.match(policy,/Öğretmenin Değerlendirmesi/);
});

test('teacher-directed source flow returns to teacher in one action',()=>{
  const nav=read('app-teacher-source-nav.js');
  const loader=read('app-home-links.js');
  assert.match(nav,/closest\('#mtsSetBack'\)/);
  assert.match(nav,/window\.go\?\.\('teacher'\)/);
  assert.match(nav,/teacherDirected:true/);
  assert.doesNotMatch(nav,/closest\('#sqBack,#sqReturn'\)/);
  assert.match(loader,/app-teacher-source-nav\.js\?v=3/);
});

test('last teacher question finalizes the set before returning to teacher',()=>{
  const nav=read('app-teacher-source-nav.js');
  assert.match(nav,/closest\('#sqReturn'\)/);
  assert.match(nav,/getElementById\('mtsFinish'\)/);
  assert.match(nav,/completedSetButton\.click\(\)/);
  assert.match(nav,/setTimeout\(returnTeacher,70\)/);
});

test('source solve buttons have a tactile blue 3D treatment',()=>{
  const nav=read('app-teacher-source-nav.js');
  assert.match(nav,/#tests \[data-mts-open\]/);
  assert.match(nav,/linear-gradient\(180deg/);
  assert.match(nav,/color:#fff/);
  assert.match(nav,/box-shadow:0 5px 0/);
  assert.match(nav,/:active\{transform:translateY\(4px\)/);
});

test('settings persistence owner loads directly on profile and saves goal without track blocking',()=>{
  const settings=read('app-profile-consistency.js');
  const loader=read('app-home-links.js');
  assert.match(loader,/makeGroup\('settings',\['profile'\]/);
  assert.match(loader,/app-profile-consistency\.js\?v=3/);
  assert.match(settings,/p\.goal=goal/);
  assert.match(settings,/btn\.onclick=null/);
  assert.doesNotMatch(settings,/YKS alanını seçmeden ayarlar kaydedilemez/);
});

test('completed teacher session presents a strong next-task action',()=>{
  const policy=read('app-personal-teacher-policy-v3.js');
  const ui=read('app-personal-teacher-v2.js');
  assert.match(policy,/d\.sessionDone&&d\.mode!=='complete'/);
  assert.match(policy,/Sıradaki Konuya Geç →/);
  assert.match(policy,/Bugünkü Çalışmayı Tamamla →/);
  assert.match(policy,/completedTeacherTopics/);
  assert.match(policy,/state\.teacher\.daily=null/);
  assert.match(policy,/todayQ>=goal/);
  assert.match(ui,/\.pt2-next\{/);
  assert.match(ui,/min-height:54px/);
  assert.match(policy,/id&&!done\?`<button/,'completed task rows must not render action buttons');
  assert.match(policy,/buildTopicProgressEvidence/);
  assert.match(policy,/decideTopicRoute/);
  assert.match(policy,/route\.action==='open-next-topic'/);
  assert.match(policy,/İki ayrı gündeki güçlü çalışman/);
});

test('home has one clear teacher entry and no duplicated teacher plan',()=>{
  const home=read('index.html');
  const policy=read('app-personal-teacher-policy-v3.js');
  const loader=read('app-home-links.js');
  assert.match(home,/Kişisel Öğretmenin/);
  assert.match(home,/Öğretmenle Çalış →/);
  assert.doesNotMatch(home,/Hocandan Bugünkü Öneri|Öneriyi Aç|id="teacherTip"|id="dailyPlan"/);
  assert.doesNotMatch(loader,/app-home-teacher-flow\.js/);
  assert.doesNotMatch(policy,/Başka bir konu seç|data-pt3-topic/);
});
