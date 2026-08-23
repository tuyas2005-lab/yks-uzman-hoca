import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../app-core.js',import.meta.url),'utf8');
const dataCode=fs.readFileSync(new URL('../app-data-v5.js',import.meta.url),'utf8');
const solveApi=fs.readFileSync(new URL('../api/solve.js',import.meta.url),'utf8');

assert.equal((html.match(/class="quick"/g)||[]).length,3,'Hızlı Başla üç kart olmalı');
assert.match(html,/data-go="upload"[^>]*>[\s\S]*?<b>Soru Çöz<\/b><small>Fotoğrafla veya yazarak sorunu çöz<\/small>/);
assert.doesNotMatch(html,/id="write"/,'legacy Soru Yaz ekranı render edilmemeli');
assert.match(html,/id="cameraInput"[^>]*capture="environment"/,'kamera input capture=environment kullanmalı');
assert.match(html,/id="fileInput"[^>]*accept="image\/\*"/,'galeri/file input görsel kabul etmeli');
assert.match(html,/id="questionText"[^>]*placeholder="Sorunu buraya yaz veya yapıştır\.\.\."/);
assert.match(core,/if\(solveInFlight\)return/,'çift gönderim kilidi bulunmalı');
assert.match(core,/Bir soru fotoğrafı seç veya sorunu yaz\./,'boş form mesajı tam olmalı');
assert.match(solveApi,/Bir soru fotoğrafı seç veya sorunu yaz\./,'API doğrulaması UI ile aynı olmalı');

function fakeNode(){
  return{
    textContent:'',innerHTML:'',className:'',onclick:null,
    classList:{add(){},remove(){},toggle(){}},
    appendChild(){},insertAdjacentElement(){},
    querySelector(){return null},querySelectorAll(){return[]},closest(){return null}
  };
}

const state={
  profile:{track:''},sessions:[],activityLog:[],trials:[],studyEvents:[],
  fieldArchive:{sessions:[],trials:[]},meta:{},dataV5:{schemaVersion:5,activeSolveEventId:''}
};
const document={
  head:{appendChild(){}},createElement:fakeNode,addEventListener(){},getElementById(){return null}
};
const context={
  state,document,console,Date,Math,Map,Set,String,Number,Array,Object,JSON,
  structuredClone,localStorage:{setItem(){}},setTimeout(){return 0},
  lastLiveResult:{exam:'TYT',subject:'Matematik',topic:'Temel Matematik',difficulty:'Kolay'},
  async liveSolve(){return true},save(){return true}
};
context.window=context;
context.globalThis=context;
vm.createContext(context);
vm.runInContext(dataCode,context,{filename:'app-data-v5.js'});

await context.liveSolve({text:'2 + 2 kaçtır?'});
await context.liveSolve({image:'data:image/png;base64,AAA'});
await context.liveSolve({text:'Şekildeki açıyı bul.',image:'data:image/png;base64,BBB'});

const solveEvents=state.studyEvents.filter(event=>['text-question','photo-question'].includes(event.source));
assert.equal(solveEvents.length,3,'her başarılı solve tek StudyEvent üretmeli');
assert.deepEqual(solveEvents.map(event=>event.meta.inputType),['text','image','image+text']);
assert.deepEqual(solveEvents.map(event=>event.source),['text-question','photo-question','photo-question'],'legacy source etiketleri korunmalı');

console.log('SORU COZ 2.0 TEST MATRIX: PASS');
