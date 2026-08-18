import coachReport from "./coach-report.js";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({ok:false});
  const fakeReq={method:"POST",body:{profile:{targetNet:70,dailyQuestionGoal:30,dailyMinutes:60},trials:[{id:1,name:"TYT Deneme",date:"2026-08-18",type:"TYT",totalNet:55,subjects:{turkce:{net:28,correct:30,wrong:8,blank:2,total:40},sosyal:{net:10,correct:11,wrong:4,blank:5,total:20},matematik:{net:12,correct:14,wrong:8,blank:18,total:40},fen:{net:5,correct:6,wrong:4,blank:10,total:20}},issue:"Süre"}],topicMastery:{"Köklü Sayılar":42,"Problemler":58},recentWrongs:[{subject:"TYT Matematik",topic:"Köklü Sayılar"}]}};
  const fakeRes={code:200,status(c){this.code=c;return this},setHeader(){},json(data){return res.status(this.code||200).json({ok:(this.code||200)<400,headline:data?.headline||null,priorities:data?.priorities?.length||0,plan:data?.weekly_plan?.length||0,error:data?.error||null})}};
  return coachReport(fakeReq,fakeRes);
}
