import {SOLVE_MODEL,ECONOMY_MODEL,getClient} from "./_common.js";

export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json({live:!!getClient(),model:`${SOLVE_MODEL} + ${ECONOMY_MODEL}`,solveModel:SOLVE_MODEL,economyModel:ECONOMY_MODEL,skill:true,counselor:true,economy:true});
}
