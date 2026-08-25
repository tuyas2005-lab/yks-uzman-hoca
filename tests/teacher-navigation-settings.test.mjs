import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');

test('teacher guidance is visually separated as a teacher instruction',()=>{
  const policy=read('app-personal-teacher-policy-v3.js');
  const ui=read('app-personal-teacher-v2.js');
  assert.match(policy,/Öğretmeninin bugünkü talimatı/);
  assert.match(policy,/pt2-guidance/);
  assert.match(ui,/\.pt2-guidance\{/);
  assert.match(ui,/font-size:15px/);
});

test('teacher-directed source flow returns to teacher in one action',()=>{
  const nav=read('app-teacher-source-nav.js');
  const loader=read('app-home-links.js');
  assert.match(nav,/closest\('#mtsSetBack'\)/);
  assert.match(nav,/closest\('#sqBack,#sqReturn'\)/);
  assert.match(nav,/window\.go\?\.\('teacher'\)/);
  assert.match(nav,/teacherDirected:true/);
  assert.match(loader,/app-teacher-source-nav\.js\?v=1/);
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
