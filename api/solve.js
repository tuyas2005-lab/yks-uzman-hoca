import {MODEL,getClient,readSkill,officialDomains} from "./_common.js";

const schema={type:"object",additionalProperties:false,required:["subject","exam","topic","curriculum_outcome","difficulty","answer","short_solution","steps","why","tip","distractor","exam_note","sources"],properties:{subject:{type:"string"},exam:{type:"string"},topic:{type:"string"},curriculum_outcome:{type:"string"},difficulty:{type:"string",enum:["Kolay","Orta","Zor"]},answer:{type:"string"},short_solution:{type:"string"},steps:{type:"array",items:{type:"string"}},why:{type:"string"},tip:{type:"string"},distractor:{type:"string"},exam_note:{type:"string"},sources:{type:"array",items:{type:"string"}}}};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const body=req.body||{};
    const text=String(body.text||"").trim();
    const image=typeof body.image==="string"?body.image:"";
    if(!text&&!image) return res.status(400).json({error:"Soru metni veya görseli gerekli."});
    const content=[{type:"input_text",text:text||"Görseldeki YKS sorusunu dikkatle oku, analiz et ve çöz."}];
    if(image) content.push({type:"input_image",image_url:image,detail:"high"});
    const skill=readSkill("SKILL.md");
    const response=await client.responses.create({
      model:MODEL,
      store:false,
      tools:[{type:"web_search",filters:{allowed_domains:officialDomains},search_context_size:"medium"}],
      input:[
        {role:"developer",content:`Aşağıdaki YKS Uzman Hoca skill talimatlarını eksiksiz uygula.\n\n${skill}\n\nEk kurallar:\n- Soruyu önce doğru oku; görüntü belirsizse uydurma.\n- Güncel müfredat/kazanım doğrulaması gerekiyorsa yalnızca izin verilen resmi MEB/ÖSYM alanlarında web araması kullan.\n- Çözüm Türkçe, öğrenci dostu, anlaşılır ve gereksiz uzatılmadan verilsin.\n- Kullanıcının gönderdiği soruyu çözebilirsin; resmi kaynaklardan telifli soru metinlerini uzun biçimde kopyalama.\n- sources alanına yalnızca gerçekten kullandığın resmi URL'leri yaz; web araması kullanmadıysan boş dizi döndür.\n- Öğrenci bağlamı: ${JSON.stringify(body.student||{})}`},
        {role:"user",content}
      ],
      text:{format:{type:"json_schema",name:"yks_solution",strict:true,schema}}
    });
    const result=JSON.parse(response.output_text);
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(result);
  }catch(e){
    console.error("solve error",e);
    if(e?.code==="insufficient_quota"){
      return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz. Platform faturalandırma bölümünden API kredisi ekleyip birkaç dakika sonra yeniden deneyin."});
    }
    if(e?.status===429){
      return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı. Kısa süre sonra yeniden deneyin."});
    }
    return res.status(500).json({error:e?.message||"Soru çözümünde sunucu hatası oluştu."});
  }
}
