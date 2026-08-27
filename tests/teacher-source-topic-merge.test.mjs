import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');

test('numbered source topic variants share one health group',()=>{
  const window={YKSTopicTaxonomyV1:{find:()=>({id:'tyt.matematik.veri',displayTitle:'Veri'}),get:()=>null,all:()=>[]}};
  const context=vm.createContext({window,console,structuredClone:x=>JSON.parse(JSON.stringify(x))});
  window.window=window;
  vm.runInContext(read('app-teacher-pilot-v1.js'),context,{filename:'app-teacher-pilot-v1.js'});
  const rows=[];
  for(const [topic,canonical] of [['Veri - 1','veri-1'],['Veri - 2','veri-2']]){
    for(const difficulty of ['KOLAY','ORTA','ZOR']) for(let i=0;i<8;i++) rows.push({id:canonical+'-'+difficulty+'-'+i,exam:'TYT',subject:'Matematik',provider:'MEB_OGM',manualCrop:true,answerVerified:true,status:'student-ready',asset:{status:'ready'},topic,canonicalTopic:canonical,difficulty});
  }
  const report=window.YKSTeacherPilotV1.buildSourceHealthReport(rows,{minimumPerDifficulty:15,taxonomy:window.YKSTopicTaxonomyV1});
  const veri=report.filter(x=>x.sourceTitle==='Veri');
  assert.equal(veri.length,1);
  assert.deepEqual(JSON.parse(JSON.stringify(veri[0].counts)),{KOLAY:16,ORTA:16,ZOR:16});
  assert.equal(veri[0].healthy,true);
});
