import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('question index consolidates duplicate and related topic variants',()=>{
  const s=fs.readFileSync('app-question-index.js','utf8');
  for(const alias of ['veri-1','veri-2','uslu-ve-koklu-ifadeler-1','uslu-ve-koklu-ifadeler-2','sayi-kesir-yas-isci-problemleri-1','sayi-kesir-yas-isci-problemleri-2','temel-kavramlar-sayi-basamaklari-sayi-kumeleri-1','ucgende-eslik-ve-benzerlik']) assert.match(s,new RegExp(alias));
  assert.match(s,/data-qi-topic-key/);
  assert.match(s,/topicGroup\(x\)\.key===f\.topic/);
});
