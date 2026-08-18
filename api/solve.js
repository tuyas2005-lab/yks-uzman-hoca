import {MODEL,getClient,readSkill,officialDomains} from "./_common.js";

const schema={
  type:"object",
  additionalProperties:false,
  required:["subject","exam","topic","curriculum_outcome","difficulty","answer","short_solution","steps","why","tip","distractor","exam_note","sources"],
  properties:{
    subject:{type:"string"}, exam:{type:"string"}, topic:{type:"string"}, curriculum_outcome:{type:"string"},
    difficulty:{type:"string",enum:["Kolay","Orta","Zor"]}, answer:{type:"string"}, short_solution:{type:"string"},
    steps:{type:"array",maxItems:5,items:{type:"string"}}, why:{type:"string"}, tip:{type:"string"}, distractor:{type:"string"},
    exam_note:{type:"string"}, sources:{type:"array",items:{type:"string"}}
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
    const verifySources=body.verifySources===true;
    if(!text&&!image) return res.status(400).json({error:"Soru metni veya görseli gerekli."});

    const content=[{type:"input_text",text:text||"Görseldeki YKS sorusunu dikkatle oku, dersini ve konusunu belirle, doğru cevabı bul ve kısa çözüm üret."}];
    if(image) content.push({type:"input_image",image_url:image,detail:"auto"});

    const skill=readSkill("SKILL.md");
    const request={
      model:MODEL,
      store:false,
      reasoning:{effort:"minimal"},
      max_output_tokens:1000,
      input:[
        {role:"developer",content:`YKS Uzman Hoca yaklaşımını uygula. Aşağıdaki skill ana kurallardır.\n\n${skill}\n\nBu çağrı için hız kuralları:\n- Önce soruyu doğru sınıflandır: ders, TYT/AYT, konu ve kazanım yalnızca bu sorudan çıkarılsın.\n- Önceki soru, örnek veya ekran varsayımlarını kullanma.\n- Doğru cevabı ve gerekli çözümü kısa üret. Gereksiz açıklama yapma.\n- steps en fazla 5 kısa adımdır.\n- tip, distractor ve exam_note birer kısa cümle olsun.\n- Resmî kaynak doğrulaması açıkça istenmediyse web araması yapma ve sources boş dizi olsun.\n- Görüntü okunamıyorsa tahmin etme.\n- Öğrenci tonu: ${JSON.stringify(body.student||{})}`},
        {role:"user",content}
      ],
      text:{format:{type:"json_schema",name:"yks_solution",strict:true,schema}}
    };
    if(verifySources){
      request.tools=[{type:"web_search",filters:{allowed_domains:officialDomains},search_context_size:"low"}];
      request.tool_choice="auto";
      request.max_tool_calls=1;
    }

    const response=await client.responses.create(request);
    const result=JSON.parse(response.output_text);
    const ms=Date.now()-started;
    console.log("solve ok",{ms,model:MODEL,hasImage:!!image,verified:verifySources});
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
