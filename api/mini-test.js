import {SOLVE_MODEL,getClient,readSkill,setUsageHeaders} from "./_common.js";

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

const norm=s=>String(s||"").toLocaleLowerCase("tr-TR").replace(/[^a-z0-9çğıöşü]+/g," ").trim();
const allowed={
  SAY:["matematik","geometri","fizik","kimya","biyoloji"],
  EA:["matematik","geometri","türk dili ve edebiyatı","edebiyat","tarih","tarih 1","coğrafya","coğrafya 1"]
};
function aytAllowed(track,subject){
  if(!track||!allowed[track])return true;
  const s=norm(subject).replace(/^ayt\s+/,"");
  return allowed[track].some(x=>s===norm(x)||s.includes(norm(x))||norm(x).includes(s));
}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY tanımlı değil."});
  const started=Date.now();
  try{
    const body=req.body||{};
    const track=["SAY","EA"].includes(body.track||body.profile?.track)?(body.track||body.profile?.track):"";
    const mode=["smart","topic","wrong"].includes(body.mode)?body.mode:"smart";
    const count=[3,5,10].includes(Number(body.count))?Number(body.count):5;
    const difficulty=String(body.difficulty||"Dengeli");
    const weakTopics=Array.isArray(body.weakTopics)?body.weakTopics.slice(0,8):[];
    const wrongTopics=Array.isArray(body.wrongTopics)?body.wrongTopics.slice(0,8):[];
    const recentTopics=Array.isArray(body.recentTopics)?body.recentTopics.slice(0,8):[];
    const selection=body.selection||{};
    if(track&&String(selection.exam||"").toUpperCase()==="AYT"&&!aytAllowed(track,selection.subject||"")){
      return res.status(400).json({error:`Seçilen AYT dersi ${track==="SAY"?"Sayısal":"Eşit Ağırlık"} alanında YKS çalışma kapsamı dışında.`});
    }
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

    const trackRule=track==="SAY"
      ?"ALAN KURALI: Öğrenci SAYISAL. TYT'nin bütün dersleri ortaktır ve kullanılabilir. AYT sorusu üretilecekse yalnız Matematik/Geometri, Fizik, Kimya veya Biyoloji alanından üret. AYT Türk Dili ve Edebiyatı, Tarih, Coğrafya ve Sosyal Bilimler-2 üretme."
      :track==="EA"
        ?"ALAN KURALI: Öğrenci EŞİT AĞIRLIK. TYT'nin bütün dersleri ortaktır ve kullanılabilir. AYT sorusu üretilecekse yalnız Matematik/Geometri veya Türk Dili ve Edebiyatı-Sosyal Bilimler-1 kapsamındaki Edebiyat, Tarih-1 ve Coğrafya-1 alanlarından üret. AYT Fizik, Kimya, Biyoloji ve Sosyal Bilimler-2 üretme."
        :"ALAN KURALI: Öğrenci henüz Sayısal/Eşit Ağırlık alanı seçmemiş; verilen konu ve seçimlere sadık kal.";

    const response=await client.responses.create({
      model:SOLVE_MODEL,store:false,max_output_tokens:count===10?5200:3200,
      input:[
        {role:"developer",content:`YKS Uzman Hoca mini test üreticisisin. Aşağıdaki skill kurallarını uygula.\n\n${skill}\n\nMini test kuralları:\n- Tam olarak ${count} adet çoktan seçmeli soru üret.\n- Her soruda A, B, C, D, E olmak üzere tam 5 seçenek olsun. choices dizisine yalnızca seçenek metnini yaz; A) gibi harf ekleme.\n- answer yalnızca A/B/C/D/E harfi olsun.\n- Sorular özgün olsun; ÖSYM, MEBİ veya OGM sorularını birebir ya da yakın kopyalama.\n- MEB kazanım mantığına uy, ÖSYM/YKS soru tarzını örnek al.\n- Görsel/şekil gerektiren soru üretme; soru ekranda yalnız metinle çözülebilsin.\n- Belirsiz veya birden fazla doğru cevabı olan soru üretme.\n- explanation öğrencinin test bittikten sonra okuyacağı kısa çözüm olsun.\n- curriculum_outcome kısa ve anlaşılır bir kazanım ifadesi olsun.\n- tip tek cümlelik sınav püf noktası olsun.\n- ${trackRule}\n- ${difficultyRule}\n- ${modeRule}`},
        {role:"user",content:`${count} soruluk mini testi şimdi üret. Test başlığı ve neden bu konuların seçildiğini açıklayan çok kısa rationale da ver.`}
      ],
      text:{format:{type:"json_schema",name:"yks_mini_test",strict:true,schema}}
    });
    const result=JSON.parse(response.output_text||"{}");
    if(!Array.isArray(result.questions)||result.questions.length!==count){
      return res.status(502).json({error:`Mini test ${count} soru olarak üretilemedi. Lütfen yeniden deneyin.`});
    }
    if(track&&result.questions.some(q=>String(q.exam||"").toUpperCase()==="AYT"&&!aytAllowed(track,q.subject||""))){
      return res.status(502).json({error:"Mini test alan filtresine uymayan AYT sorusu üretti. Lütfen yeniden deneyin."});
    }
    const ms=Date.now()-started;
    const usage=setUsageHeaders(res,response,SOLVE_MODEL,"mini-test");
    console.log("mini-test ok",{ms,model:SOLVE_MODEL,mode,count,difficulty,track:track||"unset",costUsd:usage.costUsd});
    res.setHeader("Cache-Control","no-store");
    res.setHeader("Server-Timing",`miniTest;dur=${ms}`);
    return res.status(200).json(result);
  }catch(e){
    console.error("mini-test error",{ms:Date.now()-started,error:e});
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi yetersiz."});
    return res.status(500).json({error:e?.message||"Mini test hazırlanamadı."});
  }
}
