import {ECONOMY_MODEL,getClient,readSkill,setUsageHeaders} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["title","overview","key_points","common_mistake","exam_tip"],
  properties:{
    title:{type:"string"},
    overview:{type:"string"},
    key_points:{type:"array",minItems:3,maxItems:3,items:{type:"string"}},
    common_mistake:{type:"string"},
    exam_tip:{type:"string"}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client)return res.status(503).json({error:"OPENAI_API_KEY tanımlı değil."});
  const body=req.body||{};
  const topic=String(body.topic||"").trim(),subject=String(body.subject||"").trim(),exam=String(body.exam||"TYT").trim();
  if(!topic)return res.status(400).json({error:"Konu gerekli."});
  try{
    const skill=readSkill("SKILL.md");
    const response=await client.responses.create({
      model:ECONOMY_MODEL,store:false,reasoning:{effort:"none"},max_output_tokens:520,
      input:[
        {role:"developer",content:`Sen YKS Uzman Hoca içindeki Kişisel Öğretmensin. Öğrenciye yalnız KISA KONU TEKRARI verirsin. Yeni soru, örnek soru, test sorusu veya seçenek ÜRETME. Soru kütüphanesi ayrı ve yalnız gerçek kaynak sorularından oluşur.\n\n${skill}\n\nKurallar:\n- Türkçe yaz.\n- Güncel MEB kazanım mantığına uygun ol.\n- Uzun ders anlatımı yapma.\n- key_points tam 3 kısa madde olsun.\n- common_mistake tek ve somut hata olsun.\n- exam_tip tek cümlelik sınav püf noktası olsun.\n- Hiçbir biçimde soru üretme.`},
        {role:"user",content:JSON.stringify({exam,subject,topic,mastery:body.mastery,recentWrongCount:body.recentWrongCount})}
      ],
      text:{format:{type:"json_schema",name:"teacher_recap",strict:true,schema}}
    });
    const out=JSON.parse(response.output_text||"{}");
    setUsageHeaders(res,response,ECONOMY_MODEL,"teacher-recap");
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(out);
  }catch(e){
    console.error("teacher recap error",e);
    return res.status(500).json({error:e?.message||"Hızlı tekrar hazırlanamadı."});
  }
}
