import {ECONOMY_MODEL,getClient,setUsageHeaders,normalizeTrack} from "./_common.js";

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
  const track=normalizeTrack(body);
  if(body.track&&body.profile?.track&&!track){
    return res.status(400).json({error:"Alan bilgisi tutarsız. SAY/EA seçimini yeniden kaydedin."});
  }
  const trials=(Array.isArray(body.trials)?body.trials:[]).filter(t=>trialRelevant(track,t)).slice(-10);
  if(!trials.length)return res.status(400).json({error:"Koç raporu için seçili alana uygun en az bir deneme girişi gerekli."});
  const recentWrongs=(Array.isArray(body.recentWrongs)?body.recentWrongs:[]).slice(-12).filter(x=>{
    if(!track)return true;const s=String(x?.subject||"");if(!/^AYT\b/i.test(s))return true;
    if(track==="SAY")return /matematik|geometri|fizik|kimya|biyoloji/i.test(s);
    return /matematik|geometri|edebiyat|tarih|coğraf/i.test(s);
  });
  const topicTestInsights=(Array.isArray(body.topicTestInsights)?body.topicTestInsights:[]).slice(0,12).map(x=>({topicId:String(x?.topicId||""),exam:String(x?.exam||""),subject:String(x?.subject||""),topic:String(x?.topic||""),totalTests:Number(x?.totalTests||0),totalQuestions:Number(x?.totalQuestions||0),correct:Number(x?.correct||0),wrong:Number(x?.wrong||0),blank:Number(x?.blank||0),net:Number(x?.net||0),accuracy:x?.accuracy===null?null:Number(x?.accuracy),lastTestAt:String(x?.lastTestAt||""),trend:String(x?.trend||"insufficient-data"),recentTests:(Array.isArray(x?.recentTests)?x.recentTests:[]).slice(0,3).map(t=>({dateKey:String(t?.dateKey||""),questionCount:Number(t?.questionCount||0),accuracy:Number(t?.accuracy||0)}))}));
  const trackRule=track==="SAY"
    ?"Öğrenci SAYISAL alanda. TYT'nin tüm dersleri ortak ve önemlidir. AYT planında yalnız Matematik/Geometri ile Fizik, Kimya ve Biyoloji önceliklendir. Alan dışı AYT görevi verme."
    :track==="EA"
      ?"Öğrenci EŞİT AĞIRLIK alanda. TYT'nin tüm dersleri ortak ve önemlidir. AYT planında yalnız Matematik/Geometri ile Edebiyat, Tarih-1 ve Coğrafya-1 önceliklendir. Alan dışı AYT görevi verme."
      :"Öğrencinin alanı henüz seçilmemiş; alan dışı ders varsayımı yapma.";
  try{
    const response=await client.responses.create({
      model:ECONOMY_MODEL,
      store:false,
      reasoning:{effort:"none"},
      max_output_tokens:850,
      input:[
        {role:"developer",content:`Sen YKS çalışma koçusun. SADECE verilen gerçek deneme ve çalışma verilerini analiz et. Veri uydurma, sıralama/puan tahmini yapma. 1 deneme varsa başlangıç ölçümü, 2+ denemede trend yorumu yap. Net hesabı doğru - yanlış/4 mantığıyla yapılmıştır. Türkçe, kısa ve uygulanabilir yaz. Önceliklerde ölçülebilir eylem ver; tek denemede büyük sıçrama önerme. topicTestInsights kesin mastery değil, toplu performans sinyalidir. Öncelik verirken recency, soru hacmi, tekrar sayısı ve trendi birlikte değerlendir; tek 5 soruluk test ile 100 soruluk kanıtı eşit sayma. Aggregate wrong sayısını belirli soru yanlışı veya Yanlışlarım kaydı gibi sunma. Kaydedilmemiş kaynak/test/soru uydurma. ${trackRule}`},
        {role:"user",content:JSON.stringify({profile:{name:body.profile?.name||"Öğrenci",targetNet:body.profile?.targetNet,track},trials,topicMastery:body.topicMastery||{},topicTestInsights,recentWrongs})}
      ],
      text:{format:{type:"json_schema",name:"yks_coach_report",strict:true,schema}}
    });
    setUsageHeaders(res,response,ECONOMY_MODEL,"coach");
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(JSON.parse(response.output_text));
  }catch(e){
    console.error("coach report error",e);
    return res.status(500).json({error:e?.message||"Koç raporu oluşturulamadı."});
  }
}
