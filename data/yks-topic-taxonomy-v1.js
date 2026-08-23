(()=>{
  const subjects=[
    {exam:'TYT',subjectId:'turkce',subject:'Türkçe'},
    {exam:'TYT',subjectId:'matematik',subject:'Matematik'},
    {exam:'TYT',subjectId:'fizik',subject:'Fizik'},
    {exam:'TYT',subjectId:'kimya',subject:'Kimya'},
    {exam:'TYT',subjectId:'biyoloji',subject:'Biyoloji'},
    {exam:'TYT',subjectId:'tarih',subject:'Tarih'},
    {exam:'TYT',subjectId:'cografya',subject:'Coğrafya'},
    {exam:'TYT',subjectId:'felsefe',subject:'Felsefe'},
    {exam:'TYT',subjectId:'din',subject:'Din Kültürü ve Ahlak Bilgisi'},
    {exam:'AYT',subjectId:'matematik',subject:'Matematik',tracks:['SAY','EA','SOZ']},
    {exam:'AYT',subjectId:'fizik',subject:'Fizik',tracks:['SAY']},
    {exam:'AYT',subjectId:'kimya',subject:'Kimya',tracks:['SAY']},
    {exam:'AYT',subjectId:'biyoloji',subject:'Biyoloji',tracks:['SAY']},
    {exam:'AYT',subjectId:'edebiyat',subject:'Türk Dili ve Edebiyatı',tracks:['EA','SOZ']},
    {exam:'AYT',subjectId:'tarih1',subject:'Tarih-1',tracks:['EA','SOZ']},
    {exam:'AYT',subjectId:'cografya1',subject:'Coğrafya-1',tracks:['EA','SOZ']},
    {exam:'AYT',subjectId:'tarih2',subject:'Tarih-2',tracks:['SOZ']},
    {exam:'AYT',subjectId:'cografya2',subject:'Coğrafya-2',tracks:['SOZ']},
    {exam:'AYT',subjectId:'felsefe',subject:'Felsefe Grubu',tracks:['SOZ']},
    {exam:'AYT',subjectId:'din',subject:'Din Kültürü ve Ahlak Bilgisi',tracks:['SOZ']}
  ];
  const topics=[
    {id:'tyt.matematik.uslu-sayilar',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Üslü Sayılar',aliases:['Üslü Sayılar','Üslü İfadeler'],active:true},
    {id:'tyt.matematik.koklu-sayilar',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Köklü Sayılar',aliases:['Köklü Sayılar','Köklü İfadeler'],active:true},
    {id:'tyt.matematik.problemler',exam:'TYT',subjectId:'matematik',subject:'Matematik',topic:'Problemler',aliases:['Problemler'],active:true},
    {id:'tyt.turkce.paragraf',exam:'TYT',subjectId:'turkce',subject:'Türkçe',topic:'Paragraf',aliases:['Paragraf'],active:true},
    {id:'tyt.fizik.hareket',exam:'TYT',subjectId:'fizik',subject:'Fizik',topic:'Hareket',aliases:['Hareket'],active:true}
  ];
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const byId=new Map(topics.map(x=>[x.id,x]));
  function subjectList(exam='',{track=''}={}){
    const e=String(exam||'').toUpperCase(),t=String(track||'').toUpperCase();
    return subjects.filter(x=>(!e||x.exam===e)&&(!t||!x.tracks||x.tracks.includes(t))).map(x=>({...x,tracks:x.tracks?[...x.tracks]:[]}));
  }
  function get(id){return byId.get(String(id||'').trim())||null}
  function find({exam,subject,topic}={}){
    const e=String(exam||'').toUpperCase(),s=norm(subject),t=norm(topic);
    return topics.find(x=>x.active&&x.exam===e&&norm(x.subject)===s&&[x.topic,...x.aliases].some(a=>norm(a)===t))||null;
  }
  window.YKSTopicTaxonomyV1={version:1,subjects:subjectList,all:()=>topics.map(x=>({...x,aliases:[...x.aliases]})),get,find,norm};
})();
