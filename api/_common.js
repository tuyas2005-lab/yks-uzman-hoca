import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

export const MODEL = process.env.OPENAI_MODEL || "gpt-5.6";
export const FAST_MODEL = process.env.OPENAI_FAST_MODEL || "gpt-5-mini";
export const SOLVE_MODEL = process.env.OPENAI_SOLVE_MODEL || "gpt-4.1-mini";
export const officialDomains = ["tymm.meb.gov.tr","mebi.eba.gov.tr","ogmmateryal.eba.gov.tr","osym.gov.tr"];
export const counselorDomains = ["orgm.meb.gov.tr","meb.gov.tr","mebi.eba.gov.tr"];

export function getClient(){
  return process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;
}

export function readSkill(filename){
  return fs.readFileSync(path.join(process.cwd(),"skill",filename),"utf8");
}
