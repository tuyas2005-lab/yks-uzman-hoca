(()=>{
  if(window.YKSTeacherPilotV1)return;

  const PILOT_ID='pt2-tyt-math-limited-v1';
  const ENGINE_VERSION='teacher-decision-engine-v1';
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

  const MODE_CONFIG={
    diagnostic:{count:5,difficultyCounts:{KOLAY:3,ORTA:2,ZOR:0}},foundation:{count:5,difficultyCounts:{KOLAY:4,ORTA:1,ZOR:0}},repair:{count:5,difficultyCounts:{KOLAY:3,ORTA:2,ZOR:0}},reinforce:{count:5,difficultyCounts:{KOLAY:1,ORTA:4,ZOR:0}},challenge:{count:5,difficultyCounts:{KOLAY:0,ORTA:2,ZOR:3}},spaced:{count:3,difficultyCounts:{KOLAY:0,ORTA:2,ZOR:1}},maintain:{count:3,difficultyCounts:{KOLAY:0,ORTA:2,ZOR:1}},complete:{count:0,difficultyCounts:{KOLAY:0,ORTA:0,ZOR:0}}
  };
  function decideTeacherSession(raw={}){
    const f={total:0,score:null,recentWrong:0,recentSignals:0,staleDays:999,todayCount:0,dailyGoal:10,...raw},total=Math.max(0,Number(f.total||0)),score=f.score==null?null:Number(f.score),recentWrong=Math.max(0,Number(f.recentWrong||0)),recentSignals=Math.max(0,Number(f.recentSignals||0)),staleDays=Math.max(0,Number(f.staleDays??999)),todayCount=Math.max(0,Number(f.todayCount||0)),dailyGoal=Math.max(1,Number(f.dailyGoal||10));
    let mode,reasonCodes;
    if(todayCount>=dailyGoal&&!f.sessionInProgress){mode='complete';reasonCodes=['daily-goal-complete']}
    else if(total<3||score===null){mode='diagnostic';reasonCodes=['insufficient-data']}
    else if(recentWrong>=2||recentSignals>=2){mode='repair';reasonCodes=['repeated-error-signal']}
    else if(score<35){mode='foundation';reasonCodes=['foundation-gap']}
    else if(score<55){mode='repair';reasonCodes=['low-mastery']}
    else if(score<80){mode='reinforce';reasonCodes=['partial-mastery']}
    else if(staleDays>=7&&staleDays<999){mode='spaced';reasonCodes=['review-due']}
    else if(score>=90&&total>=5){mode='challenge';reasonCodes=['strong-current-mastery']}
    else{mode='maintain';reasonCodes=['current-mastery']}
    return{mode,reasonCodes,config:clone(MODE_CONFIG[mode]),evidence:{total,score,recentWrong,recentSignals,staleDays,todayCount,dailyGoal}};
  }
  function nextReview(raw={}){
    const correct=Math.max(0,Number(raw.correct||0)),answered=Math.max(0,Number(raw.answered||0)),ratio=answered?correct/answered:0;let days,reason;
    if(raw.wrongRecovered){days=2;reason='wrong-recovered'}else if(raw.staleCheck&&answered===3&&correct===3){days=Number(raw.previousIntervalDays||14)>=14?30:14;reason='retention-passed'}else if(answered===3&&correct<=1){days=1;reason='review-failed'}else if(answered===3&&correct===2){days=4;reason='partial-retention'}else if(ratio>=.9){days=14;reason='strong-learning'}else if(ratio>=.6){days=7;reason='developing-learning'}else{days=3;reason='new-or-fragile-learning'}
    const from=String(raw.dateKey||new Date(Number(raw.now||Date.now())).toLocaleDateString('sv-SE')),date=new Date(`${from}T12:00:00`);date.setDate(date.getDate()+days);return{days,reason,dateKey:date.toLocaleDateString('sv-SE')};
  }
  const REWARD_POINTS={attempt:2,correct:3,mediumCorrect:1,hardCorrect:2,unableHonest:1,wrongReviewed:2,errorReason:1,similarCorrect:3,wrongRecovered:5,teacherTaskCompleted:10,dailyGoalCompleted:15,threeDayStreak:20,topicImproved:25,retention30Passed:10};
  function rewardFor(raw={}){const awards=[];let points=0;for(const key of Object.keys(REWARD_POINTS))if(raw[key]){const value=REWARD_POINTS[key];awards.push({key,points:value});points+=value}let praiseId='effort-noticed';if(raw.wrongRecovered)praiseId='mistake-recovered';else if(raw.retention30Passed)praiseId='retention-proven';else if(raw.topicImproved)praiseId='measurable-growth';else if(raw.hardCorrect)praiseId='challenge-solved';else if(raw.unableHonest)praiseId='honest-feedback';return{points,awards,praiseId}}
  function difficultySelection(items=[],config={}){const wanted=config.difficultyCounts||{},limit=Math.max(0,Number(config.count||0)),selected=[],used=new Set(),actual={KOLAY:0,ORTA:0,ZOR:0},shortages={},level=x=>String(x?.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I');for(const key of ['KOLAY','ORTA','ZOR']){const need=Math.max(0,Number(wanted[key]||0)),rows=items.filter(x=>level(x)===key).slice(0,need);rows.forEach(x=>{if(!used.has(x.id)){used.add(x.id);selected.push(x);actual[key]++}});if(rows.length<need)shortages[key]=need-rows.length}return{items:selected.slice(0,limit),actualDifficultyCounts:actual,shortages,distributionExact:Object.keys(shortages).length===0&&selected.length===limit,fallbackUsed:false}}
  const selectByDifficulty=(items,config)=>difficultySelection(items,config).items;
  function poolHealth(raw={}){const counts={KOLAY:Math.max(0,Number(raw.KOLAY||0)),ORTA:Math.max(0,Number(raw.ORTA||0)),ZOR:Math.max(0,Number(raw.ZOR||0))},rank={green:0,yellow:1,orange:2,red:3},level=n=>n>=15?'green':n>=8?'yellow':n>=3?'orange':'red',cells=Object.fromEntries(Object.entries(counts).map(([difficulty,remaining])=>[difficulty,{remaining,level:level(remaining)}])),overall=Object.values(cells).sort((a,b)=>rank[b.level]-rank[a.level])[0]?.level||'red',alerts=Object.entries(cells).filter(([,x])=>x.level!=='green').map(([difficulty,x])=>({difficulty,...x,neededForGreen:Math.max(0,15-x.remaining)}));return{counts,cells,total:Object.values(counts).reduce((a,n)=>a+n,0),overall,alerts}}
  function buildAuditTrail(events=[],raw={}){const topicId=String(raw.topicId||''),rows=Array.isArray(events)?events:[],decisions=rows.filter(x=>x?.source==='teacher-decision'&&(!topicId||x.topicKey===topicId||x.meta?.topicId===topicId)).sort((a,b)=>Number(b.timestamp||0)-Number(a.timestamp||0));return decisions.map(decision=>{const dm=decision.meta||{},sessionId=String(dm.sessionId||''),results=rows.filter(x=>x?.source==='source-question-result'&&x.meta?.teacherSessionId===sessionId),outcome=rows.find(x=>x?.source==='teacher-session-outcome'&&x.meta?.sessionId===sessionId)||null,om=outcome?.meta||{},rewards=rows.filter(x=>x?.source==='reward-earned'&&x.meta?.sessionId===sessionId),resultIds=new Set(results.map(x=>x.id)),closures=rows.filter(x=>x?.source==='wrong-closure'&&resultIds.has(x.meta?.wrongOf)),warnings=rows.filter(x=>x?.source==='teacher-pool-warning'&&x.dateKey===decision.dateKey&&(x.topicKey===decision.topicKey||x.meta?.topicId===dm.topicId)),fallback={answered:results.length,correct:results.filter(x=>x.result==='correct').length,wrong:results.filter(x=>x.result==='wrong').length,unable:results.filter(x=>x.interaction==='unable'||x.meta?.wrongKind==='unable').length};return{sessionId,decisionId:String(dm.decisionId||''),dateKey:decision.dateKey,topic:decision.topic,topicId:dm.topicId||decision.topicKey||'',mode:dm.mode||'diagnostic',reasonCodes:[...(dm.reasonCodes||[])],reasonText:String(dm.reasonText||''),evidence:clone(dm.evidence||{}),selection:clone(dm.selection||{}),status:outcome?'completed':results.length?'in-progress':'planned',result:{answered:outcome?Number(om.answeredCount||0):fallback.answered,correct:outcome?Number(om.correctCount||0):fallback.correct,wrong:outcome?Number(om.wrongCount||0):fallback.wrong,unable:outcome?Number(om.unableCount||0):fallback.unable,accuracy:outcome&&om.accuracy!=null?Number(om.accuracy):null},adaptation:clone(om.adaptation||{}),nextReview:clone(om.nextReview||{}),rewardPoints:rewards.reduce((a,x)=>a+Math.max(0,Number(x.meta?.points||0)),0),closureCount:closures.length,questionIds:[...(om.questionIds||dm.selection?.questionIds||[])],sourceHealth:clone(om.sourceHealth||dm.evidence?.sourceHealth||{}),warningSeverities:[...new Set(warnings.map(x=>x.meta?.severity).filter(Boolean))]}})}
  function transitionMode(previous,next){if(previous==='foundation'||previous==='repair')return next==='foundation'||next==='repair'?next:'reinforce';if(previous==='diagnostic'&&['maintain','challenge','spaced'].includes(next))return'reinforce';if(previous==='reinforce'&&next==='challenge')return'maintain';return next}
  function resumeMode(raw={}){const previous=String(raw.previousMode||''),next=String(raw.nextMode||''),today=String(raw.today||''),reviewDate=String(raw.nextReviewDate||''),reviewDue=!!(reviewDate&&today&&today>=reviewDate);if(raw.closureComplete===false)return'repair';if(['diagnostic','foundation','repair'].includes(previous)&&MODE_CONFIG[next])return next;if(previous==='reinforce'){if(['foundation','repair','reinforce'].includes(next))return next;if(reviewDue)return'spaced';return MODE_CONFIG[next]?next:'maintain'}if(reviewDue)return'spaced';if(previous==='maintain'&&next==='challenge')return'challenge';if(['challenge','spaced','maintain'].includes(previous))return'maintain';return MODE_CONFIG[next]?next:''}
  function buildRewardEvent(input={}){const rewardId=String(input.rewardId||'').trim();if(!rewardId)throw new Error('Teacher rewardId is required');const reward=rewardFor(input.behaviors||{}),event=baseEvent({...input,id:`teacher-reward:${rewardId}`},'reward-earned','reward-earned','teacher-reward-v1');event.signals.push(...reward.awards.map(x=>`reward-${x.key}`));event.meta={...event.meta,rewardId,sessionId:String(input.sessionId||''),points:reward.points,awards:reward.awards,praiseId:reward.praiseId};return event}
  function buildPoolWarningEvent(input={}){const warningId=String(input.warningId||'').trim();if(!warningId)throw new Error('Teacher warningId is required');const event=baseEvent({...input,id:`teacher-pool-warning:${warningId}`},'teacher-pool-warning','pool-shortage','teacher-pool-warning-v1');event.signals.push('source-shortage');event.meta={...event.meta,warningId,mode:String(input.mode||''),requested:clone(input.requested||{}),available:clone(input.available||{}),shortages:clone(input.shortages||{}),severity:String(input.severity||'orange')};return event}

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
    event.meta={...event.meta,sessionId,decisionId,questionIds:[...(input.questionIds||[])],startedAt:Number(input.startedAt||0),completedAt:Number(input.completedAt||Date.now()),expectedCount:Number(input.expectedCount||0),answeredCount:Number(input.answeredCount||0),correctCount:Number(input.correctCount||0),wrongCount:Number(input.wrongCount||0),unableCount:Number(input.unableCount||0),accuracy:input.accuracy==null?null:Number(input.accuracy),difficultyCounts:clone(input.difficultyCounts||{KOLAY:0,ORTA:0,ZOR:0}),wrongEventIds:[...(input.wrongEventIds||[])],adaptation:clone(input.adaptation||{changed:false}),reward:clone(input.reward||{points:0,awardIds:[],praiseId:''}),sourceHealth:clone(input.sourceHealth||{}),nextReview:clone(input.nextReview||{})};
    return event;
  }

  function recordOnce(event,{dataApi=window.YKSDataV5,state=window.state}={}){
    const existing=(state?.studyEvents||[]).find(x=>x?.id===event.id);
    if(existing)return{event:existing,duplicate:true};
    if(!dataApi?.record)throw new Error('YKSDataV5.record is required');
    return{event:dataApi.record(event,{persistNow:true}),duplicate:false};
  }

  window.YKSTeacherPilotV1={version:1,pilotId:PILOT_ID,engineVersion:ENGINE_VERSION,topics:TOPICS.map(clone),modeConfig:clone(MODE_CONFIG),rewardPoints:clone(REWARD_POINTS),resolveTopic,resolveItem,decideTeacherSession,transitionMode,resumeMode,nextReview,rewardFor,difficultySelection,selectByDifficulty,poolHealth,buildAuditTrail,buildRewardEvent,buildPoolWarningEvent,buildDecisionEvent,buildOutcomeEvent,recordOnce};
})();
