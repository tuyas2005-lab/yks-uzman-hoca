import {ECONOMY_MODEL,getClient,readSkill,setUsageHeaders} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["curriculum_outcome","steps","why","tip","distractor","exam_note","sources"],
  properties:{
    curriculum_outcome:{type:"string"},
    steps:{type:"array",maxItems:5,items:{type:"string"}},
    why:{type:"string"},
    tip:{type:"string"},
    distractor:{type:"string"},
    exam_note:{type:"string"},
    sources:{type:"array",items:{type:"string"}}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  const started=Date.now();
  try{
    const body=req.body||{};
    const s=body.solution||{};
    if(!s.answer&&!s.short_solution) return res.status(400).json({error:"Çözüm özeti gerekli."});
    const skill=readSkill("SKILL.md");
    const response=await client.responses.create({
      model:ECONOMY_MODEL,
      store:false,
      reasoning:{effort:"none"},
      max_output_tokens:560,
      input:[
        {role:"developer",content:`YKS Uzman Hoca metodolojisini uygula. Bu çağrı ana cevabı değiştirmek için değil, öğrenci isterse öğretici ayrıntıları tamamlamak içindir.\n\n${skill}\n\nKurallar:\n- Verilen answer ve short_solution ile çelişme; yalnız bariz bir tutarsızlık görürsen why içinde kısa uyarı yaz.\n- curriculum_outcome güncel MEB kazanımını sade öğrenci diliyle ifade et.\n- steps en fazla 5 kısa adım olsun.\n- why, tip, distractor ve exam_note kısa ve öğrenci dostu olsun.\n- Resmî web doğrulaması yapılmadığı için sources boş dizi olsun.`},
        {role:"user",content:JSON.stringify({exam:s.exam,subject:s.subject,topic:s.topic,difficulty:s.difficulty,answer:s.answer,short_solution:s.short_solution})}
      ],
      text:{format:{type:"json_schema",name:"yks_enrichment",strict:true,schema}}
    });
    const result=JSON.parse(response.output_text);
    const ms=Date.now()-started;
    const usage=setUsageHeaders(res,response,ECONOMY_MODEL,"details");
    console.log("enrich ok",{ms,model:ECONOMY_MODEL,costUsd:usage.costUsd});
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(result);
  }catch(e){
    const ms=Date.now()-started;
    console.error("enrich error",{ms,error:e});
    return res.status(500).json({error:e?.message||"Çözüm ayrıntıları hazırlanamadı."});
  }
}
