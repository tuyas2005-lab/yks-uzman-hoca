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

function trialRelevant(track,t){
  if(!track)return true;
  const type=String(t?.type||"TYT").toUpperCase();
  if(type==="TYT")return true;
  return track==="SAY"?type==="AYT-SAY":type==="AYT-EA";
}

export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client)return res.status(503).json({error:"OPENAI_API_KEY bulunamadı."});
  const body=req.body||{};
  const track=["SAY","EA"].includes(body.profile?.track||body.track)?(body.profile?.track||body.track):"";
  const trials=(Array.isArray(body.trials)?body.trials:[]).filter(t=>trialRelevant(track,t)).slice(-12);
  if(!trials.length)return res.status(400).json({error:"Koç raporu için seçili alana uygun en az bir deneme girişi gerekli."});
  const recentWrongs=(Array.isArray(body.recentWrongs)?body.recentWrongs:[]).filter(x=>{
    if(!track)return true;const s=String(x?.subject||"");if(!/^AYT\b/i.test(s))return true;
    if(track==="SAY")return /matematik|geometri|fizik|kimya|biyoloji/i.test(s);
    return /matematik|geometri|edebiyat|tarih|coğraf/i.test(s);
  });
  const trackRule=track==="SAY"
    ?"Öğrenci SAYISAL alanda. TYT'nin tüm dersleri ortak ve önemlidir. AYT çalışma planında yalnız Matematik/Geometri ile Fen Bilimleri (Fizik, Kimya, Biyoloji) önceliklendir. AYT Edebiyat, Tarih, Coğrafya veya Sosyal Bilimler-2 için çalışma görevi verme."
    :track==="EA"
      ?"Öğrenci EŞİT AĞIRLIK alanda. TYT'nin tüm dersleri ortak ve önemlidir. AYT çalışma planında yalnız Matematik/Geometri ile Türk Dili ve Edebiyatı-Sosyal Bilimler-1 kapsamındaki Edebiyat, Tarih-1 ve Coğrafya-1 önceliklendir. AYT Fizik, Kimya, Biyoloji veya Sosyal Bilimler-2 için çalışma görevi verme."
      :"Öğrencinin alanı henüz seçilmemiş; alan dışı ders varsayımı yapma.";
  try{
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      reasoning:{effort:"low"},
      max_output_tokens:1200,
      input:[
        {role:"developer",content:`Sen YKS çalışma koçusun. Öğrencinin SADECE verilen gerçek deneme ve çalışma verilerini analiz et. Veri uydurma, sıralama/puan tahmini yapma. 1 deneme varsa bunu başlangıç ölçümü olarak ele al; 2+ denemede trend yorumla. Net hesabı doğru - yanlış/4 mantığıyla yapılmıştır. Rapor Türkçe, kısa, uygulanabilir ve öğrenciyi bunaltmayacak şekilde olsun. Önceliklerde ölçülebilir eylem ver. Hedef gerçekçi olsun; tek denemede büyük sıçrama önerme. Konu ustalığı ve yanlış geçmişi varsa deneme verisiyle birlikte kullan. ${trackRule}`},
        {role:"user",content:JSON.stringify({profile:{...(body.profile||{}),track},trials,topicMastery:body.topicMastery||{},recentWrongs})}
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
