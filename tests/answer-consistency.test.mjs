import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../api/solve.js',import.meta.url),'utf8');
const pureSource=source
  .replace(/^import[^\n]+\n/,'')
  .split('function setPipelineUsageHeaders')[0]
  .replaceAll('export function ','function ')+`
globalThis.consistencyTestApi={normalizeAnswer,answersEquivalent,hasDirectAnswerContradiction,candidateIsConsistent,selectFinalSolution};`;

const context={console,String,Math,Object,JSON,RegExp};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(pureSource,context,{filename:'api/solve.js'});

const {
  answersEquivalent,
  hasDirectAnswerContradiction,
  candidateIsConsistent,
  selectFinalSolution
}=context.consistencyTestApi;

assert.equal(answersEquivalent('B) 42','42'),true,'etiketli ve etiketsiz eşdeğer cevaplar aynı sayılmalı');
assert.equal(answersEquivalent('12','112'),false,'bir sayının başka bir sayının alt dizesi olması eşdeğerlik sayılmamalı');
assert.equal(answersEquivalent('C) Ankara','C'),true,'aynı şık harfinin açıklamalı ve yalın biçimi eşdeğer sayılmalı');
assert.equal(answersEquivalent('C) Ankara','C) İstanbul'),false,'aynı şık harfindeki çelişen içerikler eşdeğer sayılmamalı');
assert.equal(hasDirectAnswerContradiction('E','E seçeneği yanlıştır; doğru cevap C olmalıdır.'),true,'doğrudan answer/açıklama çelişkisi yakalanmalı');

const stableCandidate={subject:'Matematik',exam:'TYT',topic:'Denklemler',difficulty:'Kolay',answer:'x = 6',short_solution:'2x = 12 olduğundan x = 6 bulunur.'};
const stableVerification={consistent:true,candidateCorrect:true,explanationSupportsAnswer:true,verifiedAnswer:'6',verifiedShortSolution:'2x = 12, dolayısıyla x = 6.',reason:'Yerine koyma sonucu sağlıyor.',confidence:'high'};
assert.equal(candidateIsConsistent(stableCandidate,stableVerification),true);
const stableDecision=selectFinalSolution(stableCandidate,stableVerification);
assert.equal(stableDecision.solution.answer,'x = 6');
assert.equal(stableDecision.corrected,false);

const contradictoryCandidate={subject:'Coğrafya',exam:'TYT',topic:'Harita Bilgisi',difficulty:'Orta',answer:'E',short_solution:'E seçeneği yanlıştır; haritada doğru konum C ile gösterilmiştir.'};
const contradictionVerification={consistent:false,candidateCorrect:false,explanationSupportsAnswer:false,verifiedAnswer:'C',verifiedShortSolution:'Haritadaki işaretli alan C seçeneğindeki konumdur.',reason:'Aday cevap açıklamayla ve haritayla çelişiyor.',confidence:'high'};
const corrected={...contradictoryCandidate,answer:'C',short_solution:'Haritadaki işaretli alan C seçeneğindeki konumdur.'};
const correctedDecision=selectFinalSolution(contradictoryCandidate,contradictionVerification,corrected);
assert.equal(correctedDecision.solution.answer,'C','çelişen ilk cevap final olarak geçmemeli');
assert.equal(correctedDecision.corrected,true);
assert.equal(correctedDecision.source,'correction');
assert.equal(hasDirectAnswerContradiction(correctedDecision.solution.answer,correctedDecision.solution.short_solution),false);

const mismatchedCorrection={...corrected,answer:'D',short_solution:'Doğru seçenek D olur.'};
const fallbackDecision=selectFinalSolution(contradictoryCandidate,contradictionVerification,mismatchedCorrection);
assert.equal(fallbackDecision.solution.answer,'C','verifier ile uyuşmayan correction yerine doğrulanmış cevap kullanılmalı');
assert.equal(fallbackDecision.source,'verifier-fallback');

const uncertainDecision=selectFinalSolution(stableCandidate,{...stableVerification,consistent:false,confidence:'low',verifiedAnswer:'',verifiedShortSolution:''});
assert.equal(uncertainDecision.solution.answer,'Doğrulanamadı');
assert.equal(uncertainDecision.solution.short_solution,'Bu sorunun cevabını güvenilir biçimde doğrulayamadım.');
assert.equal(uncertainDecision.uncertain,true);

assert.equal((source.match(/name:"yks_corrected_solution"/g)||[]).length,1,'pipeline en fazla tek correction pass tanımlamalı');
assert.match(source,/body\.diagnostics===true/,'candidate/verifier ayrıntıları normal öğrenci yanıtına eklenmemeli');

const handlerSource=source
  .replace(/^import[^\n]+\n/,'')
  .replaceAll('export function ','function ')
  .replace('export default async function handler','async function handler')+`
globalThis.consistencyHandler=handler;`;
const handlerContext={
  String,Math,Object,JSON,RegExp,Date,Set,
  ECONOMY_MODEL:'economy-model',SOLVE_MODEL:'fast-model',
  console:{log(){},error(){}},
  usageMeta(response,model,feature){
    const usage=response?.usage||{};
    return{feature,model,input:usage.input_tokens||0,cached:0,output:usage.output_tokens||0,total:usage.total_tokens||0,costUsd:0.000001};
  },
  getClient(){return handlerContext.mockClient}
};
handlerContext.globalThis=handlerContext;
vm.createContext(handlerContext);
vm.runInContext(handlerSource,handlerContext,{filename:'api/solve-handler.js'});

function responseFixture(){
  return[
    {...contradictoryCandidate},
    {...contradictionVerification},
    {...corrected}
  ];
}
function mockClient(fixtures){
  const calls=[];
  return{
    calls,
    responses:{async create(request){
      calls.push(request);
      const output=fixtures.shift();
      assert.ok(output,'beklenmeyen ek model çağrısı yapılmamalı');
      return{output_text:JSON.stringify(output),usage:{input_tokens:20,output_tokens:10,total_tokens:30}};
    }}
  };
}
function mockResponse(){
  return{
    headers:{},statusCode:200,body:null,
    setHeader(name,value){this.headers[name]=value},
    status(code){this.statusCode=code;return this},
    json(value){this.body=value;return value}
  };
}

handlerContext.mockClient=mockClient([{...stableCandidate},{...stableVerification}]);
const stableHandlerResponse=mockResponse();
await handlerContext.consistencyHandler({method:'POST',body:{text:'2x = 12 ise x kaçtır?',diagnostics:true}},stableHandlerResponse);
assert.equal(stableHandlerResponse.statusCode,200);
assert.equal(stableHandlerResponse.body.answer,'x = 6');
assert.equal(stableHandlerResponse.body.verification.consistent,true);
assert.equal(stableHandlerResponse.body.verification.corrected,false);
assert.equal(handlerContext.mockClient.calls.length,2,'tutarlı adayda correction çağrısı yapılmamalı');

handlerContext.mockClient=mockClient(responseFixture());
const studentResponse=mockResponse();
await handlerContext.consistencyHandler({method:'POST',body:{text:'Haritadaki doğru konum hangisidir?'}},studentResponse);
assert.equal(studentResponse.statusCode,200);
assert.equal(studentResponse.body.answer,'C','handler çelişen ilk cevabı öğrenciye göndermemeli');
assert.equal('verification' in studentResponse.body,false,'normal öğrenci response yalnız final çözümü içermeli');
assert.equal(handlerContext.mockClient.calls.length,3,'uyuşmazlıkta yalnız bir correction pass çalışmalı');

handlerContext.mockClient=mockClient(responseFixture());
const diagnosticResponse=mockResponse();
await handlerContext.consistencyHandler({method:'POST',body:{text:'Haritadaki doğru konum hangisidir?',diagnostics:true}},diagnosticResponse);
assert.equal(diagnosticResponse.body.verification.firstAnswer,'E');
assert.equal(diagnosticResponse.body.verification.verifiedAnswer,'C');
assert.equal(diagnosticResponse.body.verification.finalAnswer,'C');
assert.equal(diagnosticResponse.body.verification.consistent,false);
assert.equal(diagnosticResponse.body.verification.finalConsistent,true);

console.log('ANSWER CONSISTENCY TEST MATRIX: PASS');
