import {MODEL,getClient} from "./_common.js";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const s=req.body?.solution||{};
    const step=String(req.body?.step||"").trim();
    const mode=String(req.body?.mode||"simple");
    if(!s.subject||!s.topic||!step) return res.status(400).json({error:"Açıklanacak çözüm adımı bulunamadı."});
    const modeText=mode==="example"?"Bu adımı küçük ve somut bir örnekle açıkla.":mode==="other"?"Bu adımı mümkünse başka bir düşünme yolu veya alternatif yöntemle açıkla.":"Bu adımı çok daha basit, kısa ve öğrenci dostu biçimde açıkla.";
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      reasoning:{effort:"minimal"},
      max_output_tokens:350,
      input:[
        {role:"developer",content:`YKS öğrencisine yalnızca seçtiği çözüm adımını açıkla. Ders: ${s.exam||''} ${s.subject}. Konu: ${s.topic}. Kazanım: ${s.curriculum_outcome||s.topic}. Sorunun doğru cevabı: ${s.answer||''}. Kısa çözüm: ${String(s.short_solution||'').slice(0,700)}. ${modeText} Başka soruya veya başka konuya geçme. Türkçe yaz ve en fazla 5 kısa cümle kullan.`},
        {role:"user",content:`Takıldığım adım: ${step}`}
      ]
    });
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json({explanation:String(response.output_text||"").trim()});
  }catch(e){
    console.error("explain error",e);
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz."});
    if(e?.status===429) return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı."});
    return res.status(500).json({error:e?.message||"Bu adım açıklanamadı."});
  }
}
