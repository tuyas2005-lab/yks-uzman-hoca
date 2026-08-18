import {SOLVE_MODEL,getClient,setUsageHeaders} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["subject","exam","topic","difficulty","answer","short_solution"],
  properties:{
    subject:{type:"string"},
    exam:{type:"string"},
    topic:{type:"string"},
    difficulty:{type:"string",enum:["Kolay","Orta","Zor"]},
    answer:{type:"string"},
    short_solution:{type:"string"}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  const started=Date.now();
  try{
    const body=req.body||{};
    const text=String(body.text||"").trim();
    const image=typeof body.image==="string"?body.image:"";
    if(!text&&!image) return res.status(400).json({error:"Soru metni veya görseli gerekli."});

    const content=[{type:"input_text",text:text||"Görseldeki YKS sorusunu dikkatle oku. Önce doğru cevabı bul, sonra dersini, sınav türünü ve konusunu belirle; çok kısa bir çözüm yaz."}];
    if(image) content.push({type:"input_image",image_url:image,detail:"auto"});

    const response=await client.responses.create({
      model:SOLVE_MODEL,
      store:false,
      max_output_tokens:360,
      input:[
        {role:"developer",content:`YKS soru çözücüsüsün. Hızlı ama doğru cevap ver.\n- Yalnızca bu istekteki soruyu kullan; önceki sorulardan bilgi taşıma.\n- answer alanında sorunun gerçek doğru cevabını ver; şıklıysa mümkünse şık harfi + içerik.\n- short_solution en fazla 2-3 kısa cümle olsun ve cevabın neden doğru olduğunu açıklasın.\n- subject, exam (TYT/AYT) ve topic sorunun içeriğinden çıkarılsın.\n- difficulty yalnızca Kolay, Orta veya Zor olsun.\n- Görsel okunamıyorsa tahmin etme; short_solution içinde okunamadığını belirt.\n- Öğrenci tonu: ${JSON.stringify(body.student||{})}`},
        {role:"user",content}
      ],
      text:{format:{type:"json_schema",name:"yks_fast_solution",strict:true,schema}}
    });

    const result=JSON.parse(response.output_text);
    const ms=Date.now()-started;
    const usage=setUsageHeaders(res,response,SOLVE_MODEL,"solve");
    console.log("solve ok",{ms,model:SOLVE_MODEL,hasImage:!!image,stage:"fast",costUsd:usage.costUsd});
    res.setHeader("Cache-Control","no-store");
    res.setHeader("Server-Timing",`solve;dur=${ms}`);
    return res.status(200).json(result);
  }catch(e){
    const ms=Date.now()-started;
    console.error("solve error",{ms,error:e});
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz. Platform faturalandırma bölümünden API kredisi ekleyip birkaç dakika sonra yeniden deneyin."});
    if(e?.status===429) return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı. Kısa süre sonra yeniden deneyin."});
    return res.status(500).json({error:e?.message||"Soru çözümünde sunucu hatası oluştu."});
  }
}
