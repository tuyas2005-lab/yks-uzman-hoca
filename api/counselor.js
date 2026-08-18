import {MODEL,getClient,readSkill,counselorDomains} from "./_common.js";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const body=req.body||{};
    const skill=readSkill("REHBER_OGRETMEN.md");
    const dialogue=(Array.isArray(body.messages)?body.messages:[]).slice(-14).filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.text==="string").map(m=>({role:m.role,content:m.text.slice(0,5000)}));
    if(!dialogue.length) return res.status(400).json({error:"Sohbet mesajı gerekli."});
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      tools:[{type:"web_search",filters:{allowed_domains:counselorDomains},search_context_size:"low"}],
      input:[
        {role:"developer",content:`Aşağıdaki Rehber Öğretmen kılavuzunu eksiksiz uygula.\n\n${skill}\n\nÖğrencinin uygulamadaki çalışma bağlamı: ${JSON.stringify(body.context||{})}\n\nEk kurallar:\n- Temel amaç öğrenciyi baskı kurmadan derse ve sağlıklı çalışma düzenine döndürmektir.\n- Güncel MEB rehberlik bilgisini doğrulamak gerçekten gerekiyorsa yalnızca izin verilen resmi MEB alanlarında web araması kullan.\n- Sıradan motivasyon sohbetlerinde gereksiz web araması yapma.\n- Çoğu yanıtı 80-180 kelime arasında tut.\n- Önce öğrencinin durumunu kısa biçimde anladığını göster, sonra somut bir sonraki adım ver.\n- Klinik tanı, terapi veya ilaç önerisi verme.`},
        ...dialogue
      ]
    });
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json({reply:response.output_text?.trim()||"Bunu birlikte küçük bir adıma bölelim. Şu an en kolay başlayabileceğin şey ne?"});
  }catch(e){
    console.error("counselor error",e);
    return res.status(500).json({error:e?.message||"Rehber Öğretmen bağlantısında hata oluştu."});
  }
}
