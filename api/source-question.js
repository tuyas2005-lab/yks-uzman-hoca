import {SOLVE_MODEL,getClient,setUsageHeaders} from "./_common.js";

const SOURCES={
  "osym-2026-tyt":[
    "https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf",
    "https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf"
  ],
  "osym-2026-ayt":[
    "https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a23aadc3ad297424820_yks_ayt_2026_kitapcik_kt12.pdf",
    "https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf"
  ]
};

const explainSchema={
  type:"object",additionalProperties:false,
  required:["short_solution","steps","why","tip"],
  properties:{
    short_solution:{type:"string"},
    steps:{type:"array",minItems:1,maxItems:6,items:{type:"string"}},
    why:{type:"string"},
    tip:{type:"string"}
  }
};

async function proxyPdf(req,res){
  const key=String(req.query?.key||"");
  const urls=SOURCES[key];
  if(!urls) return res.status(404).json({error:"Kaynak bulunamadı."});
  const range=req.headers.range;
  let lastError=null;
  for(const url of urls){
    try{
      const headers={"User-Agent":"Mozilla/5.0 YKS-Uzman-Hoca/1.0"};
      if(range)headers.Range=range;
      const r=await fetch(url,{headers,redirect:"follow"});
      if(!r.ok&&r.status!==206){lastError=new Error(`Kaynak ${r.status}`);continue}
      const buf=Buffer.from(await r.arrayBuffer());
      res.status(r.status===206?206:200);
      res.setHeader("Content-Type","application/pdf");
      res.setHeader("Cache-Control","public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
      res.setHeader("Accept-Ranges",r.headers.get("accept-ranges")||"bytes");
      const cr=r.headers.get("content-range");if(cr)res.setHeader("Content-Range",cr);
      const cl=r.headers.get("content-length");if(cl)res.setHeader("Content-Length",cl);
      return res.send(buf);
    }catch(e){lastError=e}
  }
  return res.status(502).json({error:lastError?.message||"Resmî PDF kaynağına erişilemedi."});
}

async function explain(req,res){
  const client=getClient();
  if(!client)return res.status(503).json({error:"OPENAI_API_KEY tanımlı değil."});
  const body=req.body||{},image=String(body.image||""),officialAnswer=String(body.officialAnswer||"").trim().toUpperCase();
  if(!image||!officialAnswer)return res.status(400).json({error:"Soru görseli ve resmî cevap gerekli."});
  const meta=body.meta||{};
  const response=await client.responses.create({
    model:SOLVE_MODEL,store:false,max_output_tokens:850,
    input:[
      {role:"developer",content:`Gerçek bir YKS kaynak sorusunu öğrenciye açıklayan öğretmensin. Yeni soru ÜRETME. Bu sorunun doğrulanmış resmî cevap anahtarı ${officialAnswer}. Resmî cevabı tartışma veya değiştirme; çözümü bu cevaba ulaşacak şekilde açıkla. Görsel okunamıyorsa tahmin yürütme ve bunu açıkça belirt. Kısa, öğrenci dostu Türkçe kullan. Soru bağlamı: ${JSON.stringify({exam:meta.exam,subject:meta.subject,topic:meta.topic,year:meta.year,questionNo:meta.questionNo,provider:meta.provider})}`},
      {role:"user",content:[{type:"input_text",text:`Bu gerçek kaynak sorusunun resmî doğru cevabı ${officialAnswer}. Neden bu cevap doğru, adım adım açıkla; ayrıca tek cümlelik sınav püf noktası ver.`},{type:"input_image",image_url:image,detail:"high"}]}
    ],
    text:{format:{type:"json_schema",name:"source_question_explanation",strict:true,schema:explainSchema}}
  });
  const out=JSON.parse(response.output_text||"{}");
  setUsageHeaders(res,response,SOLVE_MODEL,"source-explain");
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json(out);
}

export default async function handler(req,res){
  try{
    if(req.method==="GET"||req.method==="HEAD"){
      if(req.method==="HEAD"){
        const key=String(req.query?.key||"");if(!SOURCES[key])return res.status(404).end();
        res.setHeader("Content-Type","application/pdf");res.setHeader("Accept-Ranges","bytes");res.setHeader("Cache-Control","public, max-age=86400, s-maxage=86400");return res.status(200).end();
      }
      return await proxyPdf(req,res);
    }
    if(req.method==="POST")return await explain(req,res);
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){
    console.error("source-question error",e);
    return res.status(500).json({error:e?.message||"Kaynak soru işlemi başarısız."});
  }
}