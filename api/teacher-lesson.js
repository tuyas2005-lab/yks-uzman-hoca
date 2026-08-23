import {ECONOMY_MODEL,getClient,readSkill,setUsageHeaders} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["title","overview","key_points","common_mistake","example_question","example_solution","check_question","check_choices","check_answer","check_explanation"],
  properties:{
    title:{type:"string"},
    overview:{type:"string"},
    key_points:{type:"array",minItems:3,maxItems:3,items:{type:"string"}},
    common_mistake:{type:"string"},
    example_question:{type:"string"},
    example_solution:{type:"string"},
    check_question:{type:"string"},
    check_choices:{type:"array",minItems:5,maxItems:5,items:{type:"string"}},
    check_answer:{type:"string",enum:["A","B","C","D","E"]},
    check_explanation:{type:"string"}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  const body=req.body||{};
  const topic=String(body.topic||"").trim();
  const subject=String(body.subject||"").trim();
  const exam=String(body.exam||"TYT").trim();
  const rawEvidence=body.topicTestEvidence&&typeof body.topicTestEvidence==="object"?body.topicTestEvidence:null;
  const topicTestEvidence=rawEvidence?{totalTests:Number(rawEvidence.totalTests||0),totalQuestions:Number(rawEvidence.totalQuestions||0),correct:Number(rawEvidence.correct||0),wrong:Number(rawEvidence.wrong||0),blank:Number(rawEvidence.blank||0),net:Number(rawEvidence.net||0),accuracy:rawEvidence.accuracy===null?null:Number(rawEvidence.accuracy),lastTestAt:String(rawEvidence.lastTestAt||""),lastTest:rawEvidence.lastTest?{questionCount:Number(rawEvidence.lastTest.questionCount||0),correct:Number(rawEvidence.lastTest.correct||0),wrong:Number(rawEvidence.lastTest.wrong||0),blank:Number(rawEvidence.lastTest.blank||0),accuracy:Number(rawEvidence.lastTest.accuracy||0)}:null,recentTests:(Array.isArray(rawEvidence.recentTests)?rawEvidence.recentTests:[]).slice(0,3).map(x=>({dateKey:String(x.dateKey||""),questionCount:Number(x.questionCount||0),correct:Number(x.correct||0),wrong:Number(x.wrong||0),blank:Number(x.blank||0),accuracy:Number(x.accuracy||0)})),trend:String(rawEvidence.trend||"insufficient-data")}:null;
  if(!topic) return res.status(400).json({error:"Konu gerekli."});
  const started=Date.now();
  try{
    const skill=readSkill("SKILL.md");
    const response=await client.responses.create({
      model:ECONOMY_MODEL,
      store:false,
      reasoning:{effort:"none"},
      max_output_tokens:760,
      input:[
        {role:"developer",content:`Sen YKS Uzman Hoca içindeki Kişisel Öğretmensin. Öğrenciyi 5 dakikada konuya geri döndüren çok kısa, öğretici bir tekrar hazırlarsın.\n\n${skill}\n\nKurallar:\n- Türkçe yaz.\n- Güncel MEB kazanım mantığına uygun ol.\n- Uzun ders anlatımı yapma; yalnız sınavda işe yarayan öz bilgi ver.\n- key_points tam 3 kısa madde olsun.\n- common_mistake tek ve somut bir hata olsun.\n- example_question kısa olsun, example_solution 2-4 cümleyi geçmesin.\n- check_question özgün ve 5 seçenekli olsun. Seçenekleri A), B) diye etiketleme; yalnız seçenek metinlerini döndür.\n- check_answer yalnız A, B, C, D veya E olsun.\n- Kullanıcıya ait başarı yüzdesini akademik tanı gibi yorumlama; yalnız çalışma önceliği olarak kullan.\n- topicTestEvidence toplu performans sinyalidir, kesin mastery değildir. Soru hacmi, son tarih, tekrar sayısı ve trendi birlikte değerlendir.\n- Tek testten kesin başarı/başarısızlık hükmü verme. Aggregate wrong sayısını belirli yanlış sorular veya Yanlışlarım kaydı gibi sunma.\n- Verilmeyen kaynak, test veya soru ayrıntısı uydurma; öneriyi yapıcı ve somut tut.`},
        {role:"user",content:JSON.stringify({exam,subject,topic,mastery:body.mastery,recentWrongCount:body.recentWrongCount,topicTestEvidence})}
      ],
      text:{format:{type:"json_schema",name:"personal_teacher_lesson",strict:true,schema}}
    });
    const result=JSON.parse(response.output_text);
    const usage=setUsageHeaders(res,response,ECONOMY_MODEL,"teacher");
    console.log("teacher lesson ok",{ms:Date.now()-started,model:ECONOMY_MODEL,topic,costUsd:usage.costUsd});
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(result);
  }catch(e){
    console.error("teacher lesson error",{ms:Date.now()-started,error:e});
    return res.status(500).json({error:e?.message||"Hızlı tekrar hazırlanamadı."});
  }
}
