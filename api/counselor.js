import {ECONOMY_MODEL,getClient,readSkill,setUsageHeaders} from "./_common.js";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const body=req.body||{};
    const skill=readSkill("REHBER_OGRETMEN.md");
    const dialogue=(Array.isArray(body.messages)?body.messages:[]).slice(-8).filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.text==="string").map(m=>({role:m.role,content:m.text.slice(0,1800)}));
    if(!dialogue.length) return res.status(400).json({error:"Sohbet mesajı gerekli."});
    const response=await client.responses.create({
      model:ECONOMY_MODEL,
      store:false,
      reasoning:{effort:"none"},
      max_output_tokens:360,
      input:[
        {role:"developer",content:`Aşağıdaki Rehber Öğretmen kılavuzunu uygula.\n\n${skill}\n\nÖğrencinin uygulamadaki çalışma bağlamı: ${JSON.stringify(body.context||{})}\n\nEk kurallar:\n- Temel amaç öğrenciyi baskı kurmadan derse ve sağlıklı çalışma düzenine döndürmektir.\n- Bu düşük maliyetli sohbet çağrısında web araması yapma; verilen kılavuz ve çalışma bağlamıyla yanıtla.\n- Çoğu yanıt 60-120 kelime olsun.\n- Önce durumu kısa biçimde karşıla, sonra somut bir sonraki adım ver.\n- Klinik tanı, terapi veya ilaç önerisi verme.`},
        ...dialogue
      ]
    });
    setUsageHeaders(res,response,ECONOMY_MODEL,"counselor");
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json({reply:response.output_text?.trim()||"Bunu küçük bir adıma bölelim. Şu an en kolay başlayabileceğin şey ne?"});
  }catch(e){
    console.error("counselor error",e);
    return res.status(500).json({error:e?.message||"Rehber Öğretmen bağlantısında hata oluştu."});
  }
}
