import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const closureCode=fs.readFileSync(new URL('../app-wrong-closure-v2.js',import.meta.url),'utf8');
const attemptCode=fs.readFileSync(new URL('../app-source-retake-position.js',import.meta.url),'utf8');
const catalogPolicyCode=fs.readFileSync(new URL('../data/question-catalog-policy-v2.js',import.meta.url),'utf8');
const teacherPilotCode=fs.readFileSync(new URL('../app-teacher-pilot-v1.js',import.meta.url),'utf8');

const item={
  id:'osym-loop-test-1',provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT',year:2026,
  exam:'TYT',subject:'Matematik',topic:'Problemler',subtopics:['Problem çözme'],questionNo:7,
  answerKey:'C',difficulty:'Orta',access:{url:'/official.pdf'},asset:{status:'ready'},visual:false
};

function fakeNode(){
  return{
    dataset:{},style:{},className:'',textContent:'',innerHTML:'',nodeType:1,
    classList:{add(){},remove(){},toggle(){},contains(){return false}},
    appendChild(){},prepend(){},remove(){},insertBefore(){},insertAdjacentElement(){},
    addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},
    matches(){return false},closest(){return null}
  };
}

function createHarness(seed=[]){
  let sequence=0;
  const state={studyEvents:structuredClone(seed)};
  const document={
    head:{appendChild(){}},body:{appendChild(){}},createElement:fakeNode,addEventListener(){},
    getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]}
  };
  const context={
    state,document,console,Date,setTimeout(){return 0},clearTimeout(){},
    MutationObserver:class{observe(){} disconnect(){}},confirm(){return true}
  };
  context.window=context;
  context.globalThis=context;
  context.openSourceQuestion=()=>{};
  context.renderWrongV2=()=>{};
  context.YKSDataV5={
    record(raw){
      sequence+=1;
      const event=structuredClone({...raw,id:raw.id||`event-${seed.length+sequence}`,timestamp:raw.timestamp||1_800_000_000_000+seed.length+sequence});
      state.studyEvents.push(event);
      return event;
    },
    patch(id,changes={}){
      const event=state.studyEvents.find(x=>x.id===id);
      if(!event)return null;
      const previousMeta=event.meta||{};
      Object.assign(event,structuredClone(changes));
      event.meta={...previousMeta,...(structuredClone(changes.meta)||{})};
      return event;
    }
  };
  vm.createContext(context);
  vm.runInContext(teacherPilotCode,context,{filename:'app-teacher-pilot-v1.js'});
  vm.runInContext(closureCode,context,{filename:'app-wrong-closure-v2.js'});
  vm.runInContext(attemptCode,context,{filename:'app-source-retake-position.js'});
  return context;
}

{
  const h=createHarness();
  const polygon={...item,id:'meb-pilot-polygon-1',provider:'MEB_OGM',topic:'Çokgen ve Dörtgenlerin Özellikleri',difficulty:'ORTA'};
  h.state.miniTests={teacherTask:{sessionId:'session-polygon-1',decisionId:'decision-polygon-1',itemIds:[polygon.id]}};
  const event=h.recordSourceQuestionAttempt(polygon,'correct','C',{type:'mini',actionId:'teacher-polygon-correct'});
  assert.equal(event.topicKey,'tyt.matematik.cokgenler-ve-dortgenler','pool topic must be recorded with canonical pilot topicKey');
  assert.equal(event.meta.topicId,event.topicKey,'canonical topic identity must also survive in meta');
  assert.equal(event.meta.teacherTask,true);
  assert.equal(event.meta.teacherSessionId,'session-polygon-1');
  assert.equal(event.meta.teacherDecisionId,'decision-polygon-1');
}

const attempts=state=>state.studyEvents.filter(x=>x.source==='source-question-result');
const openWrongs=state=>state.studyEvents.filter(x=>x.meta?.wrongRecord===true&&!x.meta?.wrongClosed);
const audits=(state,source)=>state.studyEvents.filter(x=>x.source===source);

{
  const h=createHarness();h.state.miniTests={teacherTask:{sessionId:'reward-session',decisionId:'reward-decision',itemIds:[item.id]}};
  h.recordSourceQuestionAttempt(item,'wrong','A',{type:'mini',actionId:'reward-first-wrong'});
  h.recordSourceQuestionAttempt(item,'wrong','B',{type:'wrong',actionId:'reward-retry-wrong'});
  const visibleRewardAttempt=h.recordSourceQuestionAttempt(item,'correct','C',{type:'wrong',actionId:'reward-retry-correct'});
  const rewards=h.state.studyEvents.filter(x=>x.source==='reward-earned');
  assert.equal(rewards.length,3,'her gerçek attempt benzersiz event kimliğiyle ayrı ödül kaydı üretmeli');
  assert.equal(new Set(rewards.map(x=>x.id)).size,3,'retry wrong ve retry correct aynı ödül kimliğini paylaşmamalı');
  assert.ok(rewards.at(-1).meta.awards.some(x=>x.key==='wrongRecovered'),'doğru retry geri kazanım ödülünü kaybetmemeli');
  assert.equal(attempts(h.state).every(x=>Number(x.meta?.teacherReward?.points)>0),true,'her öğretmen attempti görünür puan verisini kendi sonucunda taşımalı');
  assert.equal(attempts(h.state).every(x=>x.meta?.teacherReward?.praiseId),true,'her öğretmen attempti görünür takdir kimliği taşımalı');
  assert.ok(visibleRewardAttempt.meta.teacherReward?.points>0,'çağırana dönen olay nesnesi görünür ödülü hemen taşımalı');
}

{
  const h=createHarness();
  const before=attempts(h.state).length;
  const [first,duplicate]=await Promise.all([
    Promise.resolve().then(()=>h.recordSourceQuestionAttempt(item,'correct','C',{type:'official',actionId:'initial-correct'})),
    Promise.resolve().then(()=>h.recordSourceQuestionAttempt(item,'correct','C',{type:'official',actionId:'initial-correct'}))
  ]);
  assert.equal(first.id,duplicate.id,'aynı UI eylemi aynı attempt kaydını döndürmeli');
  assert.equal(attempts(h.state).length-before,1,'aynı actionId ile eşzamanlı planlanan çağrıların StudyEvent deltası 1 olmalı');
  assert.equal(attempts(h.state).length,1,'ilk doğru yalnız bir source result üretmeli');
  assert.equal(openWrongs(h.state).length,0,'ilk doğru açık yanlış üretmemeli');
  assert.equal(first.meta.correctAnswer,'C','resmî answerKey saklanmalı');
  assert.equal(first.meta.wrongRecord,false,'doğru attempt yanlış kartı olmamalı');

  const beforeIntentionalRetry=attempts(h.state).length;
  const intentionalRetry=h.recordSourceQuestionAttempt(item,'correct','C',{type:'official',actionId:'intentional-correct-retry'});
  assert.equal(attempts(h.state).length-beforeIntentionalRetry,1,'farklı actionId ile bilinçli retry StudyEvent deltasını 1 artırmalı');
  assert.equal(intentionalRetry.meta.retryOf,first.id,'bilinçli retry ilk attempt ile ilişkilendirilmeli');
}

{
  const h=createHarness();
  const original=h.recordSourceQuestionAttempt(item,'wrong','A',{type:'mini',actionId:'initial-wrong'});
  assert.equal(attempts(h.state).length,1,'ilk yanlış yalnız bir source result üretmeli');
  assert.deepEqual(openWrongs(h.state).map(x=>x.id),[original.id],'ilk yanlış canonical açık yanlış olmalı');
  assert.equal(original.meta.wrongKind,'wrong');

  const retryWrong=h.recordSourceQuestionAttempt(item,'wrong','B',{type:'wrong',wrongId:original.id,actionId:'retry-wrong'});
  assert.equal(attempts(h.state).length,2,'yanlış retry yeni attempt olarak korunmalı');
  assert.deepEqual(openWrongs(h.state).map(x=>x.id),[original.id],'yanlış retry canonical yanlışı kapatmamalı veya çoğaltmamalı');
  assert.equal(retryWrong.meta.wrongRecord,false,'retry attempt bağımsız yanlış kartı üretmemeli');
  assert.equal(retryWrong.meta.retryOf,original.id,'retry canonical yanlışa bağlanmalı');

  const retryUnable=h.recordSourceQuestionAttempt(item,'unable','',{type:'wrong',wrongId:original.id,actionId:'retry-unable'});
  assert.equal(attempts(h.state).length,3,'yapamadım retry yeni attempt olarak korunmalı');
  assert.deepEqual(openWrongs(h.state).map(x=>x.id),[original.id],'yapamadım retry canonical yanlışı açık bırakmalı');
  assert.equal(retryUnable.meta.retryOf,original.id);

  h.markWrongLearningEvidence(original.id,{wrongReviewedAt:Date.now(),wrongReason:'İşlem hatası'});
  const similar={...item,id:'meb-manual-similar-2',questionNo:'2'};
  h.recordSourceQuestionAttempt(similar,'correct','C',{type:'mini',actionId:'similar-correct'});
  const retryCorrect=h.recordSourceQuestionAttempt(item,'correct','C',{type:'wrong',wrongId:original.id,actionId:'retry-correct'});
  assert.equal(attempts(h.state).length,5,'benzer soru ve doğru retry ayrı attempt olarak korunmalı');
  assert.equal(retryCorrect.meta.retryOf,original.id);
  assert.equal(openWrongs(h.state).length,0,'yalnız doğru retry canonical yanlışı kapatmalı');
  assert.equal(original.meta.wrongRecord,false);
  assert.equal(original.meta.wrongClosed,true);
  assert.equal(original.meta.wrongCloseMethod,'mastery-evidence');
  assert.equal(audits(h.state,'wrong-closure').length,1,'otomatik kapanış audit olayı üretmeli');
  assert.equal(audits(h.state,'wrong-closure')[0].meta.wrongOf,original.id);

  const attemptsBeforeView=attempts(h.state).length;
  const retryLinksBeforeView=attempts(h.state).filter(x=>x.meta?.retryOf===original.id).length;
  h.YKSDataV5.record({source:'official-question-open',exam:item.exam,subject:item.subject,topic:item.topic,result:'unknown',questionCount:0,meta:{catalogId:item.id,origin:'wrong'}});
  assert.equal(attempts(h.state).length,attemptsBeforeView,'salt kaynak soru görüntüleme attempt sayısını artırmamalı');
  assert.equal(attempts(h.state).filter(x=>x.meta?.retryOf===original.id).length,retryLinksBeforeView,'salt görüntüleme retry ilişkilerini değiştirmemeli');
  assert.equal(original.meta.wrongRecord,false,'kapalı yanlış detayını görüntülemek yanlışı yeniden açmamalı');
  assert.equal(original.meta.wrongClosed,true);

  assert.equal(h.reopenWrongRecord(original.id),true,'manuel tekrar açma çalışmalı');
  assert.deepEqual(openWrongs(h.state).map(x=>x.id),[original.id],'tekrar açılan canonical yanlış listede görünmeli');
  assert.equal(audits(h.state,'wrong-reopen').length,1,'tekrar açma audit olayı üretmeli');

  const persisted=JSON.parse(JSON.stringify(h.state.studyEvents));
  const reloaded=createHarness(persisted);
  const restoredOriginal=reloaded.state.studyEvents.find(x=>x.id===original.id);
  assert.equal(attempts(reloaded.state).length,5,'yenileme sonrası attempt geçmişi korunmalı');
  assert.equal(restoredOriginal.meta.wrongRecord,true,'yenileme sonrası açık yanlış durumu korunmalı');
  assert.equal(restoredOriginal.meta.wrongClosed,false);
  assert.equal(attempts(reloaded.state).filter(x=>x.meta?.retryOf===original.id).length,3,'retry ilişkileri yenileme sonrası korunmalı');

  reloaded.markWrongLearningEvidence(original.id,{wrongReviewedAt:Date.now(),wrongReason:'İşlem hatası',wrongReasonAt:Date.now()});
  reloaded.recordSourceQuestionAttempt({...item,id:'meb-manual-similar-3',questionNo:'3'},'correct','C',{type:'mini',actionId:'similar-correct-after-reopen'});
  const correctAfterReopen=reloaded.recordSourceQuestionAttempt(item,'correct','C',{type:'wrong',wrongId:original.id,actionId:'retry-correct-after-reopen'});
  assert.equal(attempts(reloaded.state).length,7,'reopen sonrası yeni benzer soru ve doğru retry saklanmalı');
  assert.equal(correctAfterReopen.meta.retryOf,original.id);
  assert.equal(openWrongs(reloaded.state).length,0,'reopen sonrası doğru retry canonical yanlışı yeniden kapatmalı');
  assert.equal(restoredOriginal.meta.wrongRecord,false);
  assert.equal(restoredOriginal.meta.wrongClosed,true);
  assert.equal(restoredOriginal.meta.wrongCloseMethod,'mastery-evidence');
  assert.equal(audits(reloaded.state,'wrong-closure').length,2,'reopen sonrası ikinci doğru retry yeni closure audit olayı üretmeli');
}

{
  const h=createHarness();
  const original=h.recordSourceQuestionAttempt(item,'wrong','A',{actionId:'legacy-original'});
  h.YKSDataV5.patch(original.id,{meta:{wrongRecord:false,resolvedByRetake:true}});
  const duplicate=h.YKSDataV5.record({source:'source-question-result',exam:item.exam,subject:item.subject,topic:item.topic,result:'wrong',questionCount:1,meta:{catalogId:item.id,wrongRecord:true,wrongClosed:false,retake:true}});
  const retry=h.recordSourceQuestionAttempt(item,'wrong','B',{type:'wrong',wrongId:original.id,actionId:'legacy-recovery'});
  assert.deepEqual(openWrongs(h.state).map(x=>x.id),[original.id],'eski hatalı kapanmış canonical yanlış geri kazanılmalı');
  assert.equal(original.meta.legacyRetakeRecovered,true);
  assert.equal(duplicate.meta.wrongRecord,false,'eski duplicate retry yanlış kartı normalize edilmeli');
  assert.equal(duplicate.meta.retryOf,original.id);
  assert.equal(retry.meta.retryOf,original.id);
}

{
  const catalog={all:()=>[item]};
  const policyContext={
    state:{studyEvents:[{source:'source-question-result',meta:{catalogId:item.id}}]},
    window:{YKSQuestionCatalogV1:catalog},Set
  };
  vm.createContext(policyContext);
  vm.runInContext(catalogPolicyCode,policyContext,{filename:'data/question-catalog-policy-v2.js'});
  assert.equal(catalog.getSolvedIds().has(item.id),true,'getSolvedIds global lexical state içindeki StudyEvent attemptini görmeli');
}

console.log('SOURCE LEARNING LOOP TEST MATRIX: PASS');
