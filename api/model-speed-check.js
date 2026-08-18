import {getClient} from "./_common.js";
export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({ok:false});
  const client=getClient();
  if(!client) return res.status(503).json({ok:false});
  const started=Date.now();
  try{
    const r=await client.responses.create({model:"gpt-4.1-mini",store:false,max_output_tokens:30,input:"Yalnızca OK yaz."});
    return res.status(200).json({ok:true,model:"gpt-4.1-mini",ms:Date.now()-started,reply:String(r.output_text||"").trim()});
  }catch(e){
    return res.status(500).json({ok:false,model:"gpt-4.1-mini",ms:Date.now()-started,error:e?.message||"error"});
  }
}
