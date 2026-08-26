import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');

function runtime(){
  const window={};
  window.window=window;
  const context=vm.createContext({window,console});
  vm.runInContext(read('data/question-catalog-v1.js'),context,{filename:'data/question-catalog-v1.js'});
  vm.runInContext(read('data/question-catalog-dedupe.js'),context,{filename:'data/question-catalog-dedupe.js'});
  return window.YKSQuestionCatalogV1;
}

const crop=(id,sourceSeries,topic,questionNo)=>({
  id,provider:'MEB_OGM',exam:'TYT',subject:'Matematik',sourceKind:'manual-crop',
  sourceSeries,topic,canonicalTopic:topic,questionNo,difficulty:'ZOR',
  manualCrop:true,answerVerified:true,status:'student-ready',asset:{status:'ready'}
});

test('manual crop packages do not collide only because their question numbers match',()=>{
  const C=runtime();
  C.register([
    crop('old-1','Üslü Paket','uslu-ve-koklu-ifadeler-1',1),
    crop('old-2','Üslü Paket','uslu-ve-koklu-ifadeler-1',2),
    crop('old-3','Üslü Paket','uslu-ve-koklu-ifadeler-1',3)
  ]);
  C.register([1,2,3,4].map(no=>crop(`mutlak-${no}`,'Mutlak Değer Paketi','mutlak-deger',no)));

  const imported=C.all().filter(row=>row.canonicalTopic==='mutlak-deger');
  assert.equal(imported.length,4);
  assert.deepEqual(JSON.parse(JSON.stringify(imported.map(row=>row.questionNo))),[1,2,3,4]);
  assert.equal(C.getDuplicateRecords().length,0);
});

test('same manual package, topic and question number is still rejected as a duplicate',()=>{
  const C=runtime();
  C.register([crop('first','Mutlak Değer Paketi','mutlak-deger',1)]);
  C.register([crop('duplicate','Mutlak Değer Paketi','mutlak-deger',1)]);

  assert.equal(C.all().filter(row=>row.canonicalTopic==='mutlak-deger').length,1);
  assert.equal(C.getDuplicateRecords().length,1);
  assert.equal(C.getDuplicateRecords()[0].reason,'same-source-question');
});
