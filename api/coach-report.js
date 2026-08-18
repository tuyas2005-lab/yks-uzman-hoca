import {MODEL,getClient} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["headline","summary","strengths","priorities","next_trial","weekly_plan","coach_note"],
  properties:{
    headline:{type:"string"},
    summary:{type:"string"},
    strengths:{type:"array",maxItems:3,items:{type:"string"}},
    priorities:{type:"array",minItems:1,maxItems:3,items:{
      type:"object",additionalProperties:false,required:["title","why","action"],
      properties:{title:{type:"string"},why:{type:"string"},action:{type:"string"}}
    }},
    next_trial:{
      type:"object",additionalProperties:false,required:["target_net","focus","strategy"],
      properties:{target_net:{type:"string"},focus:{type:"string"},strategy:{type:"string"}}
    },
    weekly_plan:{type:"array",minItems:3,maxItems:5,items:{type:"string"}},
    coach_note:{type:"string"}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client)return res.status(503).json({error:"OPENAI_API_KEY bulunamadı."});
  const body=req.body||{};
  const trials=Array.isArray(body.trials)?body.trials.slice(-12):[];
  if(!trials.length)return res.status(400).json({error:"Koç raporu için en az bir deneme girişi gerekli."});
  try{
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      reasoning:{effort:"low"},
      max_output_tokens:1200,
      input:[
        {role:"developer",content:`Sen YKS çalışma koçusun. Öğrencinin SADECE verilen gerçek deneme ve çalışma verilerini analiz et. Veri uydurma, sıralama/puan tahmini yapma. 1 deneme varsa bunu başlangıç ölçümü olarak ele al; 2+ denemede trend yorumla. Net hesabı doğru - yanlış/4 mantığıyla yapılmıştır. Rapor Türkçe, kısa, uygulanabilir ve öğrenciyi bunaltmayacak şekilde olsun. Önceliklerde ölçülebilir eylem ver. Hedef gerçekçi olsun; tek denemede büyük sıçrama önerme. Konu ustalığı ve yanlış geçmişi varsa deneme verisiyle birlikte kullan.`},
        {role:"user",content:JSON.stringify({profile:body.profile||{},trials,topicMastery:body.topicMastery||{},recentWrongs:body.recentWrongs||[]})}
      ],
      text:{format:{type:"json_schema",name:"yks_coach_report",strict:true,schema}}
    });
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(JSON.parse(response.output_text));
  }catch(e){
    console.error("coach report error",e);
    return res.status(500).json({error:e?.message||"Koç raporu oluşturulamadı."});
  }
}
