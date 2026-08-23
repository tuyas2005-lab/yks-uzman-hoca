import {ECONOMY_MODEL,SOLVE_MODEL,getClient,usageMeta} from "./_common.js";

const solutionSchema={
  type:"object",additionalProperties:false,
  required:["subject","exam","topic","difficulty","answer","short_solution"],
  properties:{
    subject:{type:"string"},exam:{type:"string"},topic:{type:"string"},
    difficulty:{type:"string",enum:["Kolay","Orta","Zor"]},
    answer:{type:"string"},short_solution:{type:"string"}
  }
};

const verificationSchema={
  type:"object",additionalProperties:false,
  required:["independentAnswer","consistent","candidateCorrect","explanationSupportsAnswer","verifiedAnswer","verifiedShortSolution","reason","confidence"],
  properties:{
    independentAnswer:{type:"string"},
    consistent:{type:"boolean"},candidateCorrect:{type:"boolean"},explanationSupportsAnswer:{type:"boolean"},
    verifiedAnswer:{type:"string"},verifiedShortSolution:{type:"string"},reason:{type:"string"},
    confidence:{type:"string",enum:["high","medium","low"]}
  }
};

const UNVERIFIED_ANSWER="Doğrulanamadı";
const UNVERIFIED_SOLUTION="Bu sorunun cevabını güvenilir biçimde doğrulayamadım.";

function parseJson(response){
  const output=String(response?.output_text||"").trim();
  if(!output)throw new Error("Model yapılandırılmış yanıt döndürmedi.");
  return JSON.parse(output);
}
function questionContent(text,image,imageDetail="auto"){
  const content=[{type:"input_text",text:text||"Görseldeki YKS sorusunu dikkatle oku. Önce doğru cevabı bul, sonra dersini, sınav türünü ve konusunu belirle; çok kısa bir çözüm yaz."}];
  if(image)content.push({type:"input_image",image_url:image,detail:imageDetail});
  return content;
}

function leadingChoice(value){
  return String(value||"").match(/^\s*([A-E])(?:\s*[\)\].:\-]|\s*$)/iu)?.[1]?.toLocaleLowerCase("tr-TR")||"";
}

function isBareChoice(value){
  return /^\s*[A-E]\s*$/iu.test(String(value||""));
}

function assignedNumber(value){
  const match=String(value||"").normalize("NFKC").toLocaleLowerCase("tr-TR")
    .match(/^\s*[a-zçğıöşü]+\s*=\s*([+-]?\d+(?:[.,]\d+)?(?:\s*\/\s*[+-]?\d+(?:[.,]\d+)?)?)\s*$/u);
  return match?match[1].replace(/\s+/g,"").replace(",","."):"";
}

export function normalizeAnswer(value){
  return String(value||"").normalize("NFKC").toLocaleLowerCase("tr-TR")
    .replace(/^\s*(?:doğru\s+)?cevap\s*[:\-]?\s*/u,"")
    .replace(/^\s*[a-e]\s*[\)\].:\-]\s*/u,"")
    .replace(/[\s\p{P}\p{S}]+/gu,"");
}

export function answersEquivalent(left,right){
  const a=normalizeAnswer(left),b=normalizeAnswer(right);
  if(!a||!b)return false;
  if(a===b)return true;
  const leftChoice=leadingChoice(left),rightChoice=leadingChoice(right);
  if(leftChoice&&rightChoice)return leftChoice===rightChoice&&(isBareChoice(left)||isBareChoice(right));
  const leftAssigned=assignedNumber(left),rightAssigned=assignedNumber(right);
  if(leftAssigned&&leftAssigned===String(right||"").trim().replace(",","."))return true;
  if(rightAssigned&&rightAssigned===String(left||"").trim().replace(",","."))return true;
  return false;
}

export function hasDirectAnswerContradiction(answer,shortSolution){
  const choice=leadingChoice(answer);
  if(!choice)return false;
  const explanation=String(shortSolution||"").normalize("NFKC").toLocaleLowerCase("tr-TR");
  const saysWrong=[`${choice} yanlış`,`${choice} seçeneği yanlış`,`${choice} doğru değildir`,`${choice} seçeneği doğru değildir`,`${choice} elenir`];
  if(saysWrong.some(part=>explanation.includes(part)))return true;
  const stated=explanation.match(/(?:doğru\s+cevap|cevap|sonuç)\s*[:\-]?\s*([a-e])(?:\b|\s*[\)\].:\-])/iu)?.[1];
  return !!stated&&stated.toLocaleLowerCase("tr-TR")!==choice;
}

export function verificationIsReliable(verification={}){
  const independentAnswer=String(verification.independentAnswer||"").trim();
  const verifiedAnswer=String(verification.verifiedAnswer||"").trim();
  const verifiedShortSolution=String(verification.verifiedShortSolution||"").trim();
  return (verification.confidence==="high"||verification.confidence==="medium")&&!!independentAnswer&&!!verifiedAnswer&&
    !!verifiedShortSolution&&answersEquivalent(independentAnswer,verifiedAnswer)&&
    !hasDirectAnswerContradiction(verifiedAnswer,verifiedShortSolution);
}

export function candidateIsConsistent(candidate={},verification={}){
  return verificationIsReliable(verification)&&verification.consistent===true&&verification.candidateCorrect===true&&
    verification.explanationSupportsAnswer===true&&answersEquivalent(candidate.answer,verification.verifiedAnswer)&&
    !hasDirectAnswerContradiction(candidate.answer,candidate.short_solution);
}

function controlledUncertainty(candidate={}){
  return{...candidate,answer:UNVERIFIED_ANSWER,short_solution:UNVERIFIED_SOLUTION};
}

export function selectFinalSolution(candidate={},verification={},corrected=null){
  const candidateConsistent=candidateIsConsistent(candidate,verification);
  if(!verificationIsReliable(verification))return{solution:controlledUncertainty(candidate),candidateConsistent:false,finalConsistent:false,corrected:false,uncertain:true,source:"uncertainty"};
  if(candidateConsistent)return{solution:candidate,candidateConsistent:true,finalConsistent:true,corrected:false,uncertain:false,source:"candidate"};

  const verifiedAnswer=String(verification.verifiedAnswer||"").trim(),verifiedShortSolution=String(verification.verifiedShortSolution||"").trim();
  const verifierUsable=!!verifiedAnswer&&!!verifiedShortSolution&&!hasDirectAnswerContradiction(verifiedAnswer,verifiedShortSolution);
  const correctedUsable=!!corrected?.answer&&!!corrected?.short_solution&&answersEquivalent(corrected.answer,verifiedAnswer)&&
    !hasDirectAnswerContradiction(corrected.answer,corrected.short_solution);
  if(correctedUsable)return{solution:{...candidate,answer:corrected.answer,short_solution:corrected.short_solution},candidateConsistent:false,finalConsistent:true,corrected:true,uncertain:false,source:"correction"};
  const threeWayMismatch=!!corrected?.answer&&!answersEquivalent(candidate.answer,verifiedAnswer)&&
    !answersEquivalent(corrected.answer,verifiedAnswer)&&!answersEquivalent(corrected.answer,candidate.answer);
  if(threeWayMismatch)return{solution:controlledUncertainty(candidate),candidateConsistent:false,finalConsistent:false,corrected:false,uncertain:true,source:"uncertainty"};
  if(verifierUsable)return{solution:{...candidate,answer:verifiedAnswer,short_solution:verifiedShortSolution},candidateConsistent:false,finalConsistent:true,corrected:true,uncertain:false,source:"verifier-fallback"};
  return{solution:controlledUncertainty(candidate),candidateConsistent:false,finalConsistent:false,corrected:false,uncertain:true,source:"uncertainty"};
}

function setPipelineUsageHeaders(res,stages){
  const items=stages.filter(stage=>stage.response).map(stage=>usageMeta(stage.response,stage.model,stage.feature));
  const total=items.reduce((sum,item)=>({input:sum.input+item.input,cached:sum.cached+item.cached,output:sum.output+item.output,tokens:sum.tokens+item.total,costUsd:sum.costUsd+item.costUsd}),{input:0,cached:0,output:0,tokens:0,costUsd:0});
  res.setHeader("X-YKS-Feature","solve-consistency");
  res.setHeader("X-YKS-Model",[...new Set(items.map(item=>item.model).filter(Boolean))].join(" + "));
  res.setHeader("X-YKS-Input-Tokens",String(total.input));res.setHeader("X-YKS-Cached-Tokens",String(total.cached));
  res.setHeader("X-YKS-Output-Tokens",String(total.output));res.setHeader("X-YKS-Total-Tokens",String(total.tokens));
  res.setHeader("X-YKS-Cost-USD",String(total.costUsd));
  return total;
}

function safeError(error){return{status:error?.status||null,code:error?.code||null,message:String(error?.message||"Bilinmeyen hata").slice(0,300)}}

export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client)return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  const started=Date.now();
  try{
    const body=req.body||{},text=String(body.text||"").trim(),image=typeof body.image==="string"?body.image:"";
    if(!text&&!image)return res.status(400).json({error:"Bir soru fotoğrafı seç veya sorunu yaz."});

    const candidateStarted=Date.now();
    const candidateResponse=await client.responses.create({
      model:SOLVE_MODEL,store:false,max_output_tokens:360,
      input:[
        {role:"developer",content:`YKS soru çözücüsüsün. Hızlı ama doğru cevap ver.\n- Yalnızca bu istekteki soruyu kullan; önceki sorulardan bilgi taşıma.\n- answer alanında sorunun gerçek doğru cevabını ver; şıklıysa mümkünse şık harfi + içerik.\n- short_solution en fazla 2-3 kısa cümle olsun ve cevabın neden doğru olduğunu açıklasın.\n- answer ile short_solution aynı sonucu savunmalı; bir seçenek yanlışsa onu answer olarak verme.\n- subject, exam (TYT/AYT) ve topic sorunun içeriğinden çıkarılsın.\n- difficulty yalnızca Kolay, Orta veya Zor olsun.\n- Görsel okunamıyorsa tahmin etme; short_solution içinde okunamadığını belirt.\n- Öğrenci tonu: ${JSON.stringify(body.student||{})}`},
        {role:"user",content:questionContent(text,image)}
      ],
      text:{format:{type:"json_schema",name:"yks_fast_solution",strict:true,schema:solutionSchema}}
    });
    const candidate=parseJson(candidateResponse),candidateMs=Date.now()-candidateStarted;

    const verificationStarted=Date.now();
    let verificationResponse=null,verification;
    try{
      const verificationInput=questionContent(text,image,"high");
      verificationInput.push({type:"input_text",text:`ADAY KARŞILAŞTIRMA BÖLÜMÜ — Bu bilgiyi yalnız independentAnswer alanını sabitledikten sonra değerlendir:\n${JSON.stringify({answer:candidate.answer,short_solution:candidate.short_solution})}`});
      verificationResponse=await client.responses.create({
        model:ECONOMY_MODEL,store:false,reasoning:{effort:"low"},max_output_tokens:image?1600:700,
        input:[
          {role:"developer",content:`YKS cevap doğrulayıcısısın. İlk modelin sonucunu onaylamak için değil, soruyu bağımsız yeniden çözmek için çalışırsın.\n1. Candidate bilgisine bakmadan önce soru metnini ve varsa görseli bağımsız çöz; kendi cevabını independentAnswer alanına sabitle.\n2. independentAnswer, sonraki candidate karşılaştırması nedeniyle değiştirilemez.\n3. Matematikte mümkünse aritmetik, denklem çözme, oran-yüzde hesabı, seçenek yerine koyma veya sonuç geri-kontrolü yap.\n4. Geometride çizimin ölçekli olduğunu varsayma; yalnız verilen açı, kenar, paralellik ve zorunlu açı ilişkilerini kullan. Gerekirse seçenekleri tek tek doğrula.\n5. Ancak independentAnswer sabitlendikten sonra candidate answer doğru mu ve short_solution aynı cevabı gerçekten destekliyor mu kontrol et.\n6. verifiedAnswer bağımsız çözümden türemeli ve independentAnswer ile aynı cevabı göstermeli; candidate tarafından değiştirilmemeli.\n7. Doğrudan çelişkide consistent=false olmalı. Örneğin answer E iken açıklama E seçeneğini yanlışlıyorsa tutarlı sayma.\n8. verifiedShortSolution bağımsız cevabı destekleyen en fazla 2-3 kısa cümle olsun.\n9. confidence=high yalnız cevap bağımsız hesap/çıkarımla doğrulandıysa kullan. Gerçekten doğrulayamıyorsan confidence=low kullan; tahmin yürütme.\n10. reason yalnız kısa doğrulama özeti olsun; gizli düşünme zinciri yazma.`},
          {role:"user",content:verificationInput}
        ],
        text:{format:{type:"json_schema",name:"yks_answer_verification",strict:true,schema:verificationSchema}}
      });
      verification=parseJson(verificationResponse);
    }catch(error){
      console.error("solve verify error",safeError(error));
      verification={independentAnswer:"",consistent:false,candidateCorrect:false,explanationSupportsAnswer:false,verifiedAnswer:"",verifiedShortSolution:"",reason:"Doğrulama servisi tamamlanamadı.",confidence:"low"};
    }
    const verificationMs=Date.now()-verificationStarted;

    let correctionResponse=null,corrected=null,correctionMs=0;
    if(!candidateIsConsistent(candidate,verification)&&verificationIsReliable(verification)){
      const correctionStarted=Date.now();
      try{
        const correctionInput=questionContent(text,image,"high");
        correctionInput.push({type:"input_text",text:`İlk çözüm güvenilir bulunmadı. Bağımsız verifier özeti:\n${JSON.stringify({independentAnswer:verification.independentAnswer,verifiedAnswer:verification.verifiedAnswer,verifiedShortSolution:verification.verifiedShortSolution,reason:verification.reason,confidence:verification.confidence})}\nGüvenilmeyen ilk çıktı:\n${JSON.stringify({answer:candidate.answer,short_solution:candidate.short_solution})}`});
        correctionResponse=await client.responses.create({
          model:ECONOMY_MODEL,store:false,reasoning:{effort:"low"},max_output_tokens:image?1200:600,
          input:[
            {role:"developer",content:`YKS sorusu için düzeltilmiş final çözümü üret. Soruyu tekrar bağımsız kontrol et; güvenilmeyen ilk cevabı veya verifier cevabını körlemesine kopyalama. Matematikte sonucu hesap/yerine koyma ile, geometride yalnız verilen zorunlu ilişkilerle doğrula. answer ile short_solution mutlaka aynı sonucu savunmalı. short_solution en fazla 2-3 kısa cümle olsun. Cevap güvenilir biçimde doğrulanamıyorsa answer alanına ${JSON.stringify(UNVERIFIED_ANSWER)}, short_solution alanına ${JSON.stringify(UNVERIFIED_SOLUTION)} yaz.`},
            {role:"user",content:correctionInput}
          ],
          text:{format:{type:"json_schema",name:"yks_corrected_solution",strict:true,schema:solutionSchema}}
        });
        corrected=parseJson(correctionResponse);
      }catch(error){console.error("solve correction error",safeError(error))}
      correctionMs=Date.now()-correctionStarted;
    }

    const decision=selectFinalSolution(candidate,verification,corrected),totalMs=Date.now()-started;
    const usage=setPipelineUsageHeaders(res,[
      {response:candidateResponse,model:SOLVE_MODEL,feature:"solve-candidate"},
      {response:verificationResponse,model:ECONOMY_MODEL,feature:"solve-verify"},
      {response:correctionResponse,model:ECONOMY_MODEL,feature:"solve-correct"}
    ]);
    const diagnostics={
      firstAnswer:String(candidate.answer||""),independentAnswer:String(verification.independentAnswer||""),verifiedAnswer:String(verification.verifiedAnswer||""),finalAnswer:String(decision.solution.answer||""),
      consistent:decision.candidateConsistent,finalConsistent:decision.finalConsistent,corrected:decision.corrected,uncertain:decision.uncertain,
      source:decision.source,confidence:verification.confidence,reason:String(verification.reason||"").slice(0,500),
      timingMs:{firstSolve:candidateMs,verification:verificationMs,correction:correctionMs,total:totalMs},
      usage:{inputTokens:usage.input,cachedTokens:usage.cached,outputTokens:usage.output,totalTokens:usage.tokens,costUsd:usage.costUsd}
    };
    console.log("solve ok",{ms:totalMs,firstSolveMs:candidateMs,verificationMs,correctionMs,model:SOLVE_MODEL,verifierModel:ECONOMY_MODEL,inputType:image&&text?"image+text":image?"image":"text",consistent:diagnostics.consistent,corrected:diagnostics.corrected,uncertain:diagnostics.uncertain,costUsd:usage.costUsd});
    res.setHeader("Cache-Control","no-store");
    res.setHeader("Server-Timing",`solve;dur=${candidateMs}, verify;dur=${verificationMs}, correct;dur=${correctionMs}, total;dur=${totalMs}`);
    return res.status(200).json(body.diagnostics===true?{...decision.solution,verification:diagnostics}:decision.solution);
  }catch(error){
    const ms=Date.now()-started;
    console.error("solve error",{ms,...safeError(error)});
    if(error?.code==="insufficient_quota")return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz. Platform faturalandırma bölümünden API kredisi ekleyip birkaç dakika sonra yeniden deneyin."});
    if(error?.status===429)return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı. Kısa süre sonra yeniden deneyin."});
    return res.status(500).json({error:error?.message||"Soru çözümünde sunucu hatası oluştu."});
  }
}
