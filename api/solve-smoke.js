import {SOLVE_MODEL,getClient} from "./_common.js";
const schema={type:"object",additionalProperties:false,required:["answer","short_solution"],properties:{answer:{type:"string"},short_solution:{type:"string"}}};
export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({ok:false});
  const client=getClient();if(!client)return res.status(503).json({ok:false});
  const started=Date.now();
  try{
    const r=await client.responses.create({model:SOLVE_MODEL,store:false,max_output_tokens:120,input:[{role:"developer",content:"Kısa ve doğru cevap ver."},{role:"user",content:"2 üzeri 3 kaçtır?"}],text:{format:{type:"json_schema",name:"smoke",strict:true,schema}}});
    return res.status(200).json({ok:true,model:SOLVE_MODEL,ms:Date.now()-started,result:JSON.parse(r.output_text)});
  }catch(e){return res.status(500).json({ok:false,model:SOLVE_MODEL,ms:Date.now()-started,error:e?.message||"error"});}
}
