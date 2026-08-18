import {SOLVE_MODEL,getClient,readSkill} from "./_common.js";

const questionSchema={
  type:"object",additionalProperties:false,
  required:["question","choices","answer","explanation","subject","exam","topic","curriculum_outcome","difficulty","tip"],
  properties:{
    question:{type:"string"},
    choices:{type:"array",minItems:5,maxItems:5,items:{type:"string"}},
    answer:{type:"string",enum:["A","B","C","D","E"]},
    explanation:{type:"string"},
    subject:{type:"string"},exam:{type:"string"},topic:{type:"string"},curriculum_outcome:{type:"string"},
    difficulty:{type:"string",enum:["Kolay","Orta","Zor"]},tip:{type:"string"}
  }
};
const schema={
  type:"object",additionalProperties:false,required:["title","rationale","questions"],
  properties:{
    title:{type:"string"},rationale:{type:"string"},
    questions:{type:"array",minItems:3,maxItems:10,items:questionSchema}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY tanımlı değil."});
  const started=Date.now();
  try{
    const body=req.body||{};
    const mode=["smart","topic","wrong"].includes(body.mode)?body.mode:"smart";
    const count=[3,5,10].includes(Number(body.count))?Number(body.count):5;
    const difficulty=String(body.difficulty||"Dengeli");
    const weakTopics=Array.isArray(body.weakTopics)?body.weakTopics.slice(0,8):[];
    const wrongTopics=Array.isArray(body.wrongTopics)?body.wrongTopics.slice(0,8):[];
    const recentTopics=Array.isArray(body.recentTopics)?body.recentTopics.slice(0,8):[];
    const selection=body.selection||{};
    const skill=readSkill("SKILL.md");

    const modeRule=mode==="topic"
      ?`KONU SEÇİMLİ TEST: Sınav=${selection.exam||"TYT"}, ders=${selection.subject||"Matematik"}, konu=${selection.topic||"Temel Kavramlar"}. Bütün sorular bu ders ve konudan gelsin.`
      :mode==="wrong"
        ?`YANLIŞLARDAN TEST: Öğrencinin yakın zamanda yanlış yaptığı konu başlıkları: ${JSON.stringify(wrongTopics)}. Sorular bu başlıkları tekrar ölçsün; eski soruları kopyalama, aynı kazanımı yeni kurguyla ölç.`
        :`AKILLI TEST: Zayıf konular=${JSON.stringify(weakTopics)}, yakın yanlış konuları=${JSON.stringify(wrongTopics)}, yakın çalışılan konular=${JSON.stringify(recentTopics)}. ${count===5?"Yaklaşık 3 soru zayıf konulardan, 1 soru yanlış yapılan konudan, 1 soru unutmayı önlemek için diğer yakın konulardan gelsin.":"Soruların yaklaşık yarısı zayıf konulardan, üçte biri yanlış yapılan konulardan, kalanı eski/yakın konulardan gelsin."}`;

    const difficultyRule=difficulty==="Dengeli"
      ?"Zorluk dengeli olsun: yaklaşık %20 kolay, %60 orta, %20 zor."
      :difficulty==="YKS Düzeyi"?"Sorular gerçek YKS temposuna yakın, ağırlıkla orta ve zor düzeyde olsun."
      :`Bütün sorular mümkün olduğunca ${difficulty} düzeyinde olsun.`;

    const response=await client.responses.create({
      model:SOLVE_MODEL,store:false,max_output_tokens:count===10?5200:3200,
      input:[
        {role:"developer",content:`YKS Uzman Hoca mini test üreticisisin. Aşağıdaki skill kurallarını uygula.\n\n${skill}\n\nMini test kuralları:\n- Tam olarak ${count} adet çoktan seçmeli soru üret.\n- Her soruda A, B, C, D, E olmak üzere tam 5 seçenek olsun. choices dizisine yalnızca seçenek metnini yaz; A) gibi harf ekleme.\n- answer yalnızca A/B/C/D/E harfi olsun.\n- Sorular özgün olsun; ÖSYM, MEBİ veya OGM sorularını birebir ya da yakın kopyalama.\n- MEB kazanım mantığına uy, ÖSYM/YKS soru tarzını örnek al.\n- Görsel/şekil gerektiren soru üretme; soru ekranda yalnız metinle çözülebilsin.\n- Belirsiz veya birden fazla doğru cevabı olan soru üretme.\n- explanation öğrencinin test bittikten sonra okuyacağı kısa çözüm olsun.\n- curriculum_outcome kısa ve anlaşılır bir kazanım ifadesi olsun.\n- tip tek cümlelik sınav püf noktası olsun.\n- ${difficultyRule}\n- ${modeRule}`},
        {role:"user",content:`${count} soruluk mini testi şimdi üret. Test başlığı ve neden bu konuların seçildiğini açıklayan çok kısa rationale da ver.`}
      ],
      text:{format:{type:"json_schema",name:"yks_mini_test",strict:true,schema}}
    });
    const result=JSON.parse(response.output_text||"{}");
    if(!Array.isArray(result.questions)||result.questions.length!==count){
      return res.status(502).json({error:`Mini test ${count} soru olarak üretilemedi. Lütfen yeniden deneyin.`});
    }
    const ms=Date.now()-started;
    console.log("mini-test ok",{ms,model:SOLVE_MODEL,mode,count,difficulty});
    res.setHeader("Cache-Control","no-store");
    res.setHeader("Server-Timing",`miniTest;dur=${ms}`);
    return res.status(200).json(result);
  }catch(e){
    console.error("mini-test error",{ms:Date.now()-started,error:e});
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi yetersiz."});
    return res.status(500).json({error:e?.message||"Mini test hazırlanamadı."});
  }
}
