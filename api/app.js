import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import OpenAI from 'openai';

const PREFIX = 'yks-uzman-hoca-v4.7-vercel/';
const MODEL = process.env.OPENAI_MODEL || 'gpt-5';
const officialDomains = ['tymm.meb.gov.tr','mebi.eba.gov.tr','ogmmateryal.eba.gov.tr','osym.gov.tr'];
const counselorDomains = ['orgm.meb.gov.tr','meb.gov.tr','mebi.eba.gov.tr'];

let zipCache;
function zip(){
  if(!zipCache) zipCache = new AdmZip(path.join(process.cwd(),'source.zip'));
  return zipCache;
}
function entry(name){
  const e = zip().getEntry(PREFIX + name.replace(/^\/+/,''));
  return e ? e.getData() : null;
}
function text(name){
  const b = entry(name);
  return b ? b.toString('utf8') : '';
}
function client(){
  return process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;
}
function body(req){
  if(!req.body) return {};
  if(typeof req.body === 'string') { try{return JSON.parse(req.body)}catch{return {}} }
  return req.body;
}
function mime(name){
  const ext = path.extname(name).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'})[ext] || 'application/octet-stream';
}

const solveSchema={
  type:'object',additionalProperties:false,
  required:['subject','exam','topic','curriculum_outcome','difficulty','answer','short_solution','steps','why','tip','distractor','exam_note','similar_question','sources'],
  properties:{
    subject:{type:'string'},exam:{type:'string'},topic:{type:'string'},curriculum_outcome:{type:'string'},
    difficulty:{type:'string',enum:['Kolay','Orta','Zor']},answer:{type:'string'},short_solution:{type:'string'},
    steps:{type:'array',items:{type:'string'}},why:{type:'string'},tip:{type:'string'},distractor:{type:'string'},exam_note:{type:'string'},
    similar_question:{type:'object',additionalProperties:false,required:['question','choices','answer','hint'],properties:{question:{type:'string'},choices:{type:'array',items:{type:'string'}},answer:{type:'string'},hint:{type:'string'}}},
    sources:{type:'array',items:{type:'string'}}
  }
};

async function solve(req,res){
  const c=client();
  if(!c) return res.status(503).json({error:'OPENAI_API_KEY tanımlı değil.'});
  const b=body(req);
  const content=[{type:'input_text',text:`${(b.text||'').trim()||'Görseldeki YKS sorusunu analiz et ve çöz.'}\n\nÖğrenci profili: ${JSON.stringify(b.student||{})}\nKonu performansı: ${JSON.stringify(b.history||{})}`}];
  if(b.image) content.push({type:'input_image',image_url:b.image,detail:'high'});
  const response=await c.responses.create({
    model:MODEL,
    tools:[{type:'web_search',filters:{allowed_domains:officialDomains},search_context_size:'medium'}],
    input:[
      {role:'developer',content:`Aşağıdaki SKILL talimatlarını uygula.\n\n${text('skill/SKILL.md')}\n\nGüncel müfredat veya kazanım doğrulaması gerekiyorsa yalnızca izin verilen resmi MEB/ÖSYM alanlarını kullan. Görüntü belirsizse uydurma. Türkçe ve öğrenci dostu anlat. ÖSYM telifli soruları kaynaktan uzun biçimde kopyalama.`},
      {role:'user',content}
    ],
    text:{format:{type:'json_schema',name:'yks_solution',strict:true,schema:solveSchema}}
  });
  return res.status(200).json(JSON.parse(response.output_text));
}

async function counsel(req,res){
  const c=client();
  if(!c) return res.status(503).json({error:'OPENAI_API_KEY tanımlı değil.'});
  const b=body(req);
  const dialogue=(Array.isArray(b.messages)?b.messages:[]).slice(-14).filter(m=>m&&(m.role==='user'||m.role==='assistant')&&typeof m.text==='string').map(m=>({role:m.role,content:m.text.slice(0,5000)}));
  const response=await c.responses.create({
    model:MODEL,
    tools:[{type:'web_search',filters:{allowed_domains:counselorDomains},search_context_size:'low'}],
    input:[
      {role:'developer',content:`${text('skill/REHBER_OGRETMEN.md')}\n\nÖğrencinin çalışma bağlamı: ${JSON.stringify(b.context||{})}\n\nÖğrenciyi baskı kurmadan derse ve sağlıklı çalışma düzenine döndür. Güncel rehberlik doğrulaması gerekiyorsa yalnızca resmi MEB alanlarını kullan. Yanıt çoğunlukla 80-180 kelime olsun.`},
      ...dialogue
    ]
  });
  return res.status(200).json({reply:response.output_text?.trim()||'Bunu birlikte küçük bir adıma bölelim.'});
}

export default async function handler(req,res){
  try{
    const p=String(req.query.path||'').replace(/^\/+/, '');
    if(p==='api/status') return res.status(200).json({live:!!client(),skill:true,counselor:true,model:MODEL,officialDomains,counselorDomains});
    if(p==='api/app-config') return res.status(200).json({supabaseUrl:process.env.SUPABASE_URL||'',supabasePublishableKey:process.env.SUPABASE_PUBLISHABLE_KEY||''});
    if(p==='api/solve' && req.method==='POST') return await solve(req,res);
    if(p==='api/counselor' && req.method==='POST') return await counsel(req,res);
    if(p.startsWith('api/')) return res.status(404).json({error:'API yolu bulunamadı'});

    const file=p||'index.html';
    const data=entry(file);
    if(!data) return res.status(404).send('Not found');
    res.setHeader('Content-Type',mime(file));
    if(file==='service-worker.js') res.setHeader('Cache-Control','public, max-age=0, must-revalidate');
    else res.setHeader('Cache-Control',file==='index.html'?'no-cache':'public, max-age=3600');
    return res.status(200).send(data);
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e?.message||'Sunucu hatası'});
  }
}
