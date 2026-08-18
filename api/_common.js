import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

export const MODEL = process.env.OPENAI_MODEL || "gpt-5.6";
export const ECONOMY_MODEL = process.env.OPENAI_ECONOMY_MODEL || "gpt-5.6-luna";
export const FAST_MODEL = process.env.OPENAI_FAST_MODEL || "gpt-5-mini";
export const SOLVE_MODEL = process.env.OPENAI_SOLVE_MODEL || "gpt-4.1-mini";
export const officialDomains = ["tymm.meb.gov.tr","mebi.eba.gov.tr","ogmmateryal.eba.gov.tr","osym.gov.tr"];
export const counselorDomains = ["orgm.meb.gov.tr","meb.gov.tr","mebi.eba.gov.tr"];

const PRICING={
  "gpt-4.1-mini":{input:0.40,cached:0.10,output:1.60},
  "gpt-5.6-luna":{input:0.20,cached:0.02,output:1.20},
  "gpt-5.6-terra":{input:2.00,cached:0.20,output:12.00},
  "gpt-5.6-sol":{input:5.00,cached:0.50,output:30.00},
  "gpt-5.6":{input:5.00,cached:0.50,output:30.00},
  "gpt-5-mini":{input:0.25,cached:0.025,output:2.00}
};

export function getClient(){
  return process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;
}

export function readSkill(filename){
  return fs.readFileSync(path.join(process.cwd(),"skill",filename),"utf8");
}

function priceFor(model){
  if(PRICING[model])return PRICING[model];
  if(String(model).startsWith("gpt-4.1-mini"))return PRICING["gpt-4.1-mini"];
  if(String(model).startsWith("gpt-5.6-luna"))return PRICING["gpt-5.6-luna"];
  if(String(model).startsWith("gpt-5.6-terra"))return PRICING["gpt-5.6-terra"];
  if(String(model).startsWith("gpt-5.6-sol"))return PRICING["gpt-5.6-sol"];
  return null;
}

export function usageMeta(response,model,feature){
  const u=response?.usage||{};
  const input=Number(u.input_tokens||0);
  const output=Number(u.output_tokens||0);
  const cached=Number(u.input_tokens_details?.cached_tokens||u.cached_input_tokens||0);
  const uncached=Math.max(0,input-cached);
  const p=priceFor(model);
  const costUsd=p?((uncached*p.input)+(cached*p.cached)+(output*p.output))/1_000_000:0;
  return{feature:String(feature||"api"),model:String(model||""),input,cached,output,total:Number(u.total_tokens||input+output),costUsd};
}

export function setUsageHeaders(res,response,model,feature){
  const m=usageMeta(response,model,feature);
  res.setHeader("X-YKS-Feature",m.feature);
  res.setHeader("X-YKS-Model",m.model);
  res.setHeader("X-YKS-Input-Tokens",String(m.input));
  res.setHeader("X-YKS-Cached-Tokens",String(m.cached));
  res.setHeader("X-YKS-Output-Tokens",String(m.output));
  res.setHeader("X-YKS-Cost-USD",String(m.costUsd));
  return m;
}
