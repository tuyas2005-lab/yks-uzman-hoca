import {FAST_MODEL,getClient} from "./_common.js";
export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({ok:false});
  const client=getClient();
  if(!client) return res.status(503).json({ok:false});
  const started=Date.now();
  try{
    const r=await client.responses.create({model:FAST_MODEL,store:false,reasoning:{effort:"low"},max_output_tokens:20,input:"Yalnızca OK yaz."});
    return res.status(200).json({ok:true,model:FAST_MODEL,ms:Date.now()-started,reply:r.output_text});
  }catch(e){
    return res.status(500).json({ok:false,model:FAST_MODEL,error:e?.message||"error"});
  }
}
