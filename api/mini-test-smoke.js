import miniTest from "./mini-test.js";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({ok:false});
  const fakeReq={method:"POST",body:{mode:"topic",count:3,difficulty:"Dengeli",selection:{exam:"TYT",subject:"Matematik",topic:"Üslü Sayılar"},weakTopics:[],wrongTopics:[],recentTopics:[]}};
  const fakeRes={code:200,status(c){this.code=c;return this},setHeader(){},json(data){return res.status(this.code||200).json({ok:(this.code||200)<400,count:Array.isArray(data?.questions)?data.questions.length:0,sample:data?.questions?.[0]||null,error:data?.error||null})}};
  return miniTest(fakeReq,fakeRes);
}
