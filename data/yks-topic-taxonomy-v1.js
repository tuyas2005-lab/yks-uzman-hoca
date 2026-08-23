(()=>{
  const topics=[
    {id:'tyt.matematik.uslu-sayilar',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Üslü Sayılar',aliases:['Üslü Sayılar','Üslü İfadeler'],active:true},
    {id:'tyt.matematik.koklu-sayilar',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Köklü Sayılar',aliases:['Köklü Sayılar','Köklü İfadeler'],active:true},
    {id:'tyt.matematik.problemler',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Problemler',aliases:['Problemler'],active:true},
    {id:'tyt.turkce.paragraf',exam:'TYT',subjectId:'turkce',subject:'Türkçe',topic:'Paragraf',aliases:['Paragraf'],active:true},
    {id:'tyt.fizik.hareket',exam:'TYT',subjectId:'fizik',subject:'Fizik',topic:'Hareket',aliases:['Hareket'],active:true}
  ];
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const byId=new Map(topics.map(x=>[x.id,x]));
  function get(id){return byId.get(String(id||'').trim())||null}
  function find({exam,subject,topic}={}){
    const e=String(exam||'').toUpperCase(),s=norm(subject),t=norm(topic);
    return topics.find(x=>x.active&&x.exam===e&&norm(x.subject)===s&&[x.topic,...x.aliases].some(a=>norm(a)===t))||null;
  }
  window.YKSTopicTaxonomyV1={version:1,all:()=>topics.map(x=>({...x,aliases:[...x.aliases]})),get,find,norm};
})();
