(()=>{
  if(window.YKSTeacherPilotV1)return;

  const PILOT_ID='pt2-tyt-math-limited-v1';
  const ENGINE_VERSION='teacher-pilot-contract-v1';
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const clone=x=>{try{return structuredClone(x)}catch{return JSON.parse(JSON.stringify(x))}};
  const TOPICS=[
    {
      id:'tyt.matematik.problemler',
      displayTitle:'Problemler',
      poolTopics:['Problemler'],
      aliases:['Problem Çözme','Rutin Olmayan Problemler']
    },
    {
      id:'tyt.matematik.ucgenler',
      displayTitle:'Üçgenler',
      poolTopics:['Üçgenler'],
      aliases:['Eşlik','Benzerlik','Üçgende Alan']
    },
    {
      id:'tyt.matematik.cokgenler-ve-dortgenler',
      displayTitle:'Çokgenler ve Dörtgenler',
      poolTopics:['Çokgen ve Dörtgenlerin Özellikleri'],
      aliases:['Özel Dörtgenler','Çokgenler/Dörtgenler']
    }
  ];

  function resolveTopic(value){
    const values=typeof value==='string'?[value]:[value?.topicId,value?.topicKey,value?.canonicalTopic,value?.topic].filter(Boolean);
    const keys=new Set(values.map(norm).filter(Boolean));
    if(!keys.size)return null;
    return TOPICS.find(topic=>[
      topic.id,topic.displayTitle,...topic.poolTopics,...topic.aliases
    ].some(label=>keys.has(norm(label))))||null;
  }

  function resolveItem(item={}){
    if(String(item.exam||'').toUpperCase()!=='TYT'||norm(item.subject)!=='matematik')return null;
    return resolveTopic(item);
  }

  function baseEvent(input,source,interaction,schema){
    const topic=resolveTopic(input.topicId||input.topicKey||input.topic);
    if(!topic)throw new Error('Teacher pilot canonical topic is required');
    const id=String(input.id||'').trim();
    if(!id)throw new Error(`${source} id is required`);
    return{
      id,
      timestamp:Number(input.timestamp||Date.now()),
      dateKey:String(input.dateKey||new Date(Number(input.timestamp||Date.now())).toLocaleDateString('sv-SE')),
      source,
      exam:'TYT',
      subject:'Matematik',
      topic:topic.displayTitle,
      topicKey:topic.id,
      curriculumOutcome:'',
      result:'unknown',
      difficulty:'',
      interaction,
      questionCount:0,
      signals:[source,...(input.signals||[])],
      meta:{schema,pilotId:PILOT_ID,topicId:topic.id,engineVersion:ENGINE_VERSION}
    };
  }

  function buildDecisionEvent(input={}){
    const decisionId=String(input.decisionId||'').trim(),sessionId=String(input.sessionId||'').trim();
    if(!decisionId||!sessionId)throw new Error('Teacher decisionId and sessionId are required');
    const event=baseEvent({...input,id:`teacher-decision:${decisionId}`},'teacher-decision','decision-issued','teacher-decision-v1');
    event.signals.push(`mode-${String(input.mode||'diagnostic')}`);
    event.meta={...event.meta,decisionId,sessionId,mode:String(input.mode||'diagnostic'),reasonCodes:[...(input.reasonCodes||[])],reasonText:String(input.reasonText||''),evidence:clone(input.evidence||{}),selection:clone(input.selection||{questionIds:[],difficultyCounts:{KOLAY:0,ORTA:0,ZOR:0},total:0}),expected:clone(input.expected||{})};
    return event;
  }

  function buildOutcomeEvent(input={}){
    const sessionId=String(input.sessionId||'').trim(),decisionId=String(input.decisionId||'').trim();
    if(!sessionId||!decisionId)throw new Error('Teacher outcome sessionId and decisionId are required');
    const event=baseEvent({...input,id:`teacher-session-outcome:${sessionId}`},'teacher-session-outcome','session-completed','teacher-session-outcome-v1');
    if(input.adaptation?.changed)event.signals.push('adaptation-observed');
    event.meta={...event.meta,sessionId,decisionId,questionIds:[...(input.questionIds||[])],startedAt:Number(input.startedAt||0),completedAt:Number(input.completedAt||Date.now()),expectedCount:Number(input.expectedCount||0),answeredCount:Number(input.answeredCount||0),correctCount:Number(input.correctCount||0),wrongCount:Number(input.wrongCount||0),unableCount:Number(input.unableCount||0),accuracy:input.accuracy==null?null:Number(input.accuracy),difficultyCounts:clone(input.difficultyCounts||{KOLAY:0,ORTA:0,ZOR:0}),wrongEventIds:[...(input.wrongEventIds||[])],adaptation:clone(input.adaptation||{changed:false}),reward:clone(input.reward||{points:0,awardIds:[],praiseId:''}),sourceHealth:clone(input.sourceHealth||{})};
    return event;
  }

  function recordOnce(event,{dataApi=window.YKSDataV5,state=window.state}={}){
    const existing=(state?.studyEvents||[]).find(x=>x?.id===event.id);
    if(existing)return{event:existing,duplicate:true};
    if(!dataApi?.record)throw new Error('YKSDataV5.record is required');
    return{event:dataApi.record(event,{persistNow:true}),duplicate:false};
  }

  window.YKSTeacherPilotV1={version:1,pilotId:PILOT_ID,engineVersion:ENGINE_VERSION,topics:TOPICS.map(clone),resolveTopic,resolveItem,buildDecisionEvent,buildOutcomeEvent,recordOnce};
})();
