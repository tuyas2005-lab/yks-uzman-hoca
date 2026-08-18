import teacherLesson from "./teacher-lesson.js";
export default async function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({ok:false});
  const fakeReq={method:"POST",body:{exam:"TYT",subject:"Matematik",topic:"Köklü Sayılar",mastery:42,recentWrongCount:2}};
  const fakeRes={code:200,status(c){this.code=c;return this},setHeader(){},json(data){return res.status(this.code||200).json({ok:(this.code||200)<400,title:data?.title||null,points:data?.key_points?.length||0,choices:data?.check_choices?.length||0,answer:data?.check_answer||null,error:data?.error||null})}};
  return teacherLesson(fakeReq,fakeRes);
}
