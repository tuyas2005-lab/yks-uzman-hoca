(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf';
  const key=['E','A','D','B','E','A','D','B','D','C','A','D','B','E','B','D','A','E','C','E'];
  // data: [prefix, subject, topic, subtopics, visual, needsReview?]
  // needsReview=true: grafik/cizelge/sema'nin ASIL sayisal/yapisal verisi PDF text-extraction'da
  // tamamen kayip - konu adi (topic) yine de makul tahmindir ama kritik veri kaybi nedeniyle
  // isaretlenmistir (soru metni/cevap tahmin edilmedi).
  const data=[
    ['fiz','Fizik','Özkütle',['ebru sanatı','kütle-hacim grafiği','su boya'],true,true],
    ['fiz','Fizik','Net Kuvvet ve Sürtünme',['K L M blokları','statik sürtünme katsayısı'],false,false],
    ['fiz','Fizik','Kaldırma Kuvveti ve Özkütle',['alüminyum demir tahta','batma yüzme']],
    ['fiz','Fizik','Isı ve Sıcaklık',['buzdolabı','elektrik kesintisi','ısı alışverişi']],
    ['fiz','Fizik','Elektrik Akımı ve Direnç',['iletken tel','potansiyel fark akım grafiği','ampul gücü'],true,true],
    ['fiz','Fizik','Yayda Dalga Hareketi',['yay üzerinde dalga','titreşim yönü'],true,false],
    ['fiz','Fizik','Işığın Kırılması',['çukur ayna','yakınsak mercek','tek renkli ışık'],true,false],
    ['kim','Kimya','Çözeltiler ve Derişim',['NaOH çözeltisi','laboratuvar malzemesi','seyreltme']],
    ['kim','Kimya','Atomun Yapısı',['Rutherford atom modeli','çekirdek elektron']],
    ['kim','Kimya','Moleküller Arası Etkileşimler',['indüklenmiş dipol','dipol-dipol','K L maddeleri']],
    ['kim','Kimya','Sıvılar ve Buhar Basıncı',['etanol','buharlaşma hızı','denge buhar basıncı']],
    ['kim','Kimya','Kimyasal Hesaplamalar',['gaz örnekleri çizelgesi','oksijen atomu sayısı','mol Avogadro'],true,true],
    ['kim','Kimya','Çözeltiler ve Derişim',['tuz su karışımı','kütlece yüzde derişim']],
    ['kim','Kimya','Asitlerin Genel Özellikleri',['hidrojen florür','cam aşındırma','pH']],
    ['biy','Biyoloji','Hücre Çekirdeği',['çift katlı zar','olgun hücre çekirdek sayısı']],
    ['biy','Biyoloji','Biyomoleküller - Polimer Yapılar',['glikojen','kitin','nükleik asit','protein']],
    ['biy','Biyoloji','Canlıların Sınıflandırılması',['taksonomi','taksonlar arası akrabalık']],
    ['biy','Biyoloji','Eşeysiz Üreme',['laktik asit bakterisi','tomurcuklanma','sporla üreme']],
    ['biy','Biyoloji','Kalıtım - Soyağacı Analizi',['hemofili','X kromozomu','çekinik alel'],true,true],
    ['biy','Biyoloji','Ekoloji',['besin ağı','ototrof','omnivor','trofik basamak'],true,false]
  ];
  const rows=data.map((d,i)=>{const q=i+1;const nr=d[5]===true;return{id:`osym-2024-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2024 TYT Temel Soru Kitapçığı',year:2024,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'fen bilimleri'],difficulty:'Orta',visual:d[4]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Fen Bilimleri Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
