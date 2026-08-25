import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../data/yks-topic-taxonomy-v1.js',import.meta.url),'utf8'),context);
const taxonomy=context.window.YKSTopicTaxonomyV1,topics=taxonomy.all(),norm=taxonomy.norm;
const by=(exam,track='',subjectId='')=>taxonomy.all({exam,track,subjectId,active:true});

assert.equal(taxonomy.curriculumVersion,'YKS_CURRENT_2018_2023_MEBI_2026');
assert.equal(topics.length,228);assert.equal(new Set(topics.map(x=>x.id)).size,228);
assert.equal(by('TYT').length,121);assert.equal(by('AYT','SAY').length,67);assert.equal(by('AYT','EA').length,63);

const expected={TYT:{turkce:15,matematik:32,fizik:14,kimya:10,biyoloji:11,tarih:12,cografya:11,felsefe:10,din:6},SAY:{matematik:23,fizik:16,kimya:12,biyoloji:16},EA:{matematik:23,edebiyat:18,tarih1:12,cografya1:10}};
for(const [subjectId,count] of Object.entries(expected.TYT))assert.equal(by('TYT','',subjectId).length,count,`TYT ${subjectId}`);
for(const track of ['SAY','EA'])for(const [subjectId,count] of Object.entries(expected[track]))assert.equal(by('AYT',track,subjectId).length,count,`${track} ${subjectId}`);
assert.deepEqual(Array.from(taxonomy.subjects('TYT'),x=>x.subjectId),Object.keys(expected.TYT));
assert.deepEqual(Array.from(taxonomy.subjects('AYT',{track:'SAY'}),x=>x.subjectId),Object.keys(expected.SAY));
assert.deepEqual(Array.from(taxonomy.subjects('AYT',{track:'EA'}),x=>x.subjectId),Object.keys(expected.EA));

const required=['id','topicId','exam','supportedTrack','subjectId','subject','topic','displayTitle','parentUnit','domain','aliases','curriculumVersion','officialSource','active'],owners=new Map();
for(const topic of topics){
  for(const field of required)assert.notEqual(topic[field],undefined,`${topic.id}.${field}`);
  assert.ok(topic.id.startsWith(`${topic.exam.toLowerCase()}.${topic.subjectId}.`),topic.id);
  assert.ok(topic.displayTitle&&topic.parentUnit&&topic.domain&&topic.officialSource.length,topic.id);
  if(topic.domain==='GEOMETRI')assert.equal(topic.subjectId,'matematik',topic.id);
  for(const alias of [topic.displayTitle,...topic.aliases]){const key=`${topic.exam}|${topic.subjectId}|${norm(alias)}`,owner=owners.get(key);assert.ok(!owner||owner===topic.id,`alias collision: ${key}`);owners.set(key,topic.id)}
}

for(const id of ['tyt.matematik.uslu-sayilar','tyt.matematik.koklu-sayilar','tyt.matematik.problemler','tyt.turkce.paragraf','tyt.fizik.hareket'])assert.equal(taxonomy.get(id).id,id);
assert.equal(taxonomy.find({exam:'TYT',subject:'Matematik',topic:'Denklemler ve Eşitsizlikler'}).id,'tyt.matematik.birinci-dereceden-denklemler-ve-esitsizlikler');
assert.equal(taxonomy.find({exam:'TYT',subject:'Matematik',topic:'Problemler'}).id,'tyt.matematik.problemler');
assert.equal(taxonomy.find({exam:'TYT',subject:'Matematik',topic:'Köklü İfadeler'}).id,'tyt.matematik.koklu-sayilar');
for(const ambiguous of [['AYT','Matematik','Artan-Azalan'],['AYT','Matematik','Maksimum-Minimum'],['AYT','Matematik','Teğet'],['AYT','Biyoloji','Üreme'],['AYT','Coğrafya-1','Ticaret']])assert.equal(taxonomy.find({exam:ambiguous[0],subject:ambiguous[1],topic:ambiguous[2]}),null);
assert.equal(by('TYT','','biyoloji').some(x=>x.id.includes('protein-sentezi')),false);
for(const id of ['ayt.biyoloji.nukleik-asitler-ve-dna-replikasyonu','ayt.biyoloji.protein-sentezi','ayt.biyoloji.biyoteknoloji'])assert.ok(taxonomy.get(id));
assert.ok(taxonomy.get('tyt.felsefe.xx-yuzyil-felsefesi'));
assert.equal(by('AYT','EA','tarih1').some(x=>norm(x.displayTitle).includes('cagdas turk ve dunya tarihi')),false);

console.log('FINAL TOPIC TAXONOMY INTEGRITY: PASS');
