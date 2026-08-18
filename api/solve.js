import {MODEL,getClient,readSkill,officialDomains} from "./_common.js";

const similarSchema={
  type:"object",
  additionalProperties:false,
  required:["question","choices","answer","hint"],
  properties:{
    question:{type:"string"},
    choices:{type:"array",minItems:4,maxItems:5,items:{type:"string"}},
    answer:{type:"string"},
    hint:{type:"string"}
  }
};

const schema={
  type:"object",
  additionalProperties:false,
  required:["subject","exam","topic","curriculum_outcome","difficulty","answer","short_solution","steps","why","tip","distractor","exam_note","similar_question","sources"],
  properties:{
    subject:{type:"string"}, exam:{type:"string"}, topic:{type:"string"}, curriculum_outcome:{type:"string"},
    difficulty:{type:"string",enum:["Kolay","Orta","Zor"]}, answer:{type:"string"}, short_solution:{type:"string"},
    steps:{type:"array",maxItems:6,items:{type:"string"}}, why:{type:"string"}, tip:{type:"string"}, distractor:{type:"string"},
    exam_note:{type:"string"}, similar_question:similarSchema, sources:{type:"array",items:{type:"string"}}
  }
};

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const client=getClient();
  if(!client) return res.status(503).json({error:"OPENAI_API_KEY henüz Vercel'e eklenmedi."});
  try{
    const body=req.body||{};
    const text=String(body.text||"").trim();
    const image=typeof body.image==="string"?body.image:"";
    const verifySources=body.verifySources===true;
    if(!text&&!image) return res.status(400).json({error:"Soru metni veya görseli gerekli."});

    const content=[{type:"input_text",text:text||"Görseldeki YKS sorusunu dikkatle oku, analiz et ve çöz."}];
    if(image) content.push({type:"input_image",image_url:image,detail:"high"});

    const skill=readSkill("SKILL.md");
    const request={
      model:MODEL,
      store:false,
      reasoning:{effort:"low"},
      max_output_tokens:1800,
      input:[
        {role:"developer",content:`Aşağıdaki YKS Uzman Hoca skill talimatlarını eksiksiz uygula.\n\n${skill}\n\nEk kurallar:\n- Soruyu önce doğru oku; görüntü belirsizse uydurma.\n- Öncelik hızlı ve doğru çözümdür. Gereksiz uzun açıklama yapma.\n- Çözüm Türkçe, öğrenci dostu ve kısa olsun; steps en fazla 6 kısa adımdan oluşsun.\n- Kullanıcının gönderdiği soruyu çözebilirsin; resmi kaynaklardan telifli soru metinlerini uzun biçimde kopyalama.\n- similar_question MUTLAKA çözülen soruyla AYNI ders, AYNI konu ve AYNI kazanımı ölçsün. Sadece sayılar, örnek, bağlam veya soru kurgusu değişsin. Başka bir derse ya da konuya geçme. Zorluk mümkün olduğunca aynı olsun.\n- similar_question.answer doğru cevabı, hint cevabı açık etmeyen kısa ipucunu içersin.\n- Resmî kaynak doğrulaması istenmediyse web araması yapma ve sources boş dizi olsun.\n- Öğrenci bağlamı: ${JSON.stringify(body.student||{})}`},
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
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json(result);
  }catch(e){
    console.error("solve error",e);
    if(e?.code==="insufficient_quota") return res.status(429).json({error:"OpenAI API bakiyesi/kotası yetersiz. Platform faturalandırma bölümünden API kredisi ekleyip birkaç dakika sonra yeniden deneyin."});
    if(e?.status===429) return res.status(429).json({error:"OpenAI API geçici kullanım limitine ulaştı. Kısa süre sonra yeniden deneyin."});
    return res.status(500).json({error:e?.message||"Soru çözümünde sunucu hatası oluştu."});
  }
}
