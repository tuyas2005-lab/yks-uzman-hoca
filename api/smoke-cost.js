import {ECONOMY_MODEL,getClient,setUsageHeaders,usageMeta} from "./_common.js";
export default async function handler(req,res){
  const client=getClient();if(!client)return res.status(503).json({ok:false});
  try{
    const response=await client.responses.create({model:ECONOMY_MODEL,store:false,reasoning:{effort:"none"},max_output_tokens:30,input:"Yalnızca OK yaz."});
    const meta=usageMeta(response,ECONOMY_MODEL,"smoke");setUsageHeaders(res,response,ECONOMY_MODEL,"smoke");
    return res.status(200).json({ok:true,text:response.output_text,meta});
  }catch(e){return res.status(500).json({ok:false,error:e?.message})}
}
