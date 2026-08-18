import {MODEL,getClient} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["question","choices","answer","hint"],
  properties:{
    question:{type:"string"},
    choices:{type:"array",minItems:4,maxItems:4,items:{type:"string"}},
    answer:{type:"string"},
    hint:{type:"string"}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const s=req.body?.solution||{};
    if(!s.subject||!s.topic) return res.status(400).json({error:"Önce bir soru çözülmeli."});
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      reasoning:{effort:"low"},
      max_output_tokens:650,
      input:[
        {role:"developer",content:`Bir YKS öğrencisi için TEK bir yeni çoktan seçmeli soru üret.\n- Ders kesinlikle: ${s.exam||''} ${s.subject}\n- Konu kesinlikle: ${s.topic}\n- Kazanım kesinlikle: ${s.curriculum_outcome||s.topic}\n- Zorluk: ${s.difficulty||'Orta'}\n- Başka derse veya konuya geçme.\n- Orijinal soruyu kopyalama; aynı kazanımı farklı örnek, sayı, olay veya bağlamla ölç.\n- 4 seçenek üret. answer alanı choices dizisindeki doğru seçeneğin TAM metni olsun.\n- hint kısa olsun ve cevabı doğrudan söylemesin.\n- Türkçe ve YKS düzeyinde yaz.`},
        {role:"user",content:`Çözülen sorunun kısa çözüm özeti: ${String(s.short_solution||'').slice(0,600)}`}
      ],
      text:{format:{type:"json_schema",name:"similar_question",strict:true,schema}}
    });
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(JSON.parse(response.output_text));
  }catch(e){
    console.error("similar error",e);
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz."});
    if(e?.status===429) return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı."});
    return res.status(500).json({error:e?.message||"Benzer soru oluşturulamadı."});
  }
}
