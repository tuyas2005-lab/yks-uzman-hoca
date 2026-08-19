(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a23aadc3ad297424820_yks_ayt_2026_kitapcik_kt12.pdf';
  const base=(id,subject,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 AYT Temel Soru Kitapçığı',year:2026,exam:'AYT',subject,topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-ayt-fiz-01','Fizik','Newton Yasaları ve Denge',['kuvvet dengesi','makara','ip gerilmesi','normal kuvvet'],['newton','denge','makara','kuvvet','şekilli'],'Orta-Zor',true,1,38,'A'),
    base('osym-2026-ayt-fiz-02','Fizik','İki Boyutta Hareket ve Bağıl Hareket',['bağıl hız','düşey atış','yatay hareket'],['bağıl hareket','atışlar','hız'],'Orta',false,2,38,'C'),
    base('osym-2026-ayt-fiz-03','Fizik','İş ve Enerji',['mekanik enerji','eğik düzlem','yer çekimi işi','hareket süresi'],['iş enerji','eğik düzlem','hız','şekilli'],'Orta-Zor',true,3,38,'D'),
    base('osym-2026-ayt-fiz-04','Fizik','Tork ve Denge',['tork','dönme ekseni','kuvvet kolu'],['tork','kapı','kuvvet','şekilli'],'Orta',true,4,39,'A'),
    base('osym-2026-ayt-fiz-05','Fizik','Elektrik Alan ve Yüklü Parçacıklar',['düzgün elektrik alan','yüklü damla','potansiyel fark'],['elektrik alan','yağ damlası','millikan','şekilli'],'Zor',true,5,39,'C'),
    base('osym-2026-ayt-fiz-06','Fizik','Manyetik Akı',['manyetik akı','alan-yüzey açısı','yüzey alanı'],['manyetik alan','manyetik akı','yüzey','şekilli'],'Orta-Zor',true,6,40,'C'),
    base('osym-2026-ayt-fiz-07','Fizik','Alternatif Akım ve Rezonans',['RLC devresi','rezonans','sığaç','bobin'],['alternatif akım','rlc','rezonans','devre','şekilli'],'Orta',true,7,40,'B'),
    base('osym-2026-ayt-fiz-08','Fizik','Çembersel Hareket',['merkezcil kuvvet','tepe noktası','normal kuvvet'],['çembersel hareket','merkezcil kuvvet','otomobil','şekilli'],'Orta',true,8,40,'A'),
    base('osym-2026-ayt-fiz-09','Fizik','Açısal Momentum',['çizgisel momentum','açısal momentum','vektörel nicelik'],['momentum','açısal momentum','çembersel hareket'],'Orta',false,9,40,'A'),
    base('osym-2026-ayt-fiz-10','Fizik','Basit Harmonik Hareket',['sarkaç','denge konumu','sürat değişimi'],['basit harmonik hareket','sarkaç','hız','şekilli'],'Orta',true,10,41,'E'),
    base('osym-2026-ayt-fiz-11','Fizik','Doppler Olayı',['ses dalgaları','bağıl hareket','gözlenen frekans'],['doppler','ses','ambulans','frekans','şekilli'],'Orta-Zor',true,11,41,'B'),
    base('osym-2026-ayt-fiz-12','Fizik','Atom Modelleri',['rutherford','bohr','modern atom teorisi','tarihsel gelişim'],['atom modelleri','rutherford','bohr','modern fizik'],'Orta',false,12,41,'C'),
    base('osym-2026-ayt-fiz-13','Fizik','Fotoelektrik Olay',['eşik enerjisi','foton enerjisi','dalga boyu','durdurucu potansiyel'],['fotoelektrik','foton','eşik enerjisi'],'Zor',false,13,41,'B'),
    base('osym-2026-ayt-fiz-14','Fizik','Dalgaların Teknolojide Kullanımı',['mekanik dalga','görüntüleme sistemleri','sonar'],['dalgalar','sonar','görüntüleme'],'Kolay-Orta',false,14,41,'E'),

    base('osym-2026-ayt-kim-15','Kimya','Atomun Kuantum Modeli',['elektron dizilimi','kuantum sayıları','krom atomu'],['kuantum','elektron dizilimi','cr'],'Orta-Zor',false,15,42,'C'),
    base('osym-2026-ayt-kim-16','Kimya','Gazlarda Difüzyon',['graham yasası','molar kütle','difüzyon hızı'],['gazlar','difüzyon','graham'],'Orta',false,16,42,'C'),
    base('osym-2026-ayt-kim-17','Kimya','Gazlar ve Stokiyometri',['ideal gaz','mol-hacim','tepkime hesaplamaları'],['gazlar','stokiyometri','ideal gaz'],'Orta',false,17,42,'B'),
    base('osym-2026-ayt-kim-18','Kimya','Çözeltilerde Derişim',['molarite','iyon derişimi','karıştırma','buharlaştırma'],['çözelti','molarite','iyon derişimi'],'Orta',false,18,42,'E'),
    base('osym-2026-ayt-kim-19','Kimya','Tepkime Entalpisi',['standart oluşum entalpisi','bağ enerjisi','ısı alışverişi'],['entalpi','termokimya','bağ enerjisi'],'Orta',false,19,42,'D'),
    base('osym-2026-ayt-kim-20','Kimya','Tepkime Hızı ve Enerji Profili',['aktivasyon enerjisi','çok basamaklı tepkime','hız belirleyen basamak'],['tepkime hızı','aktivasyon enerjisi','grafik','şekilli'],'Orta-Zor',true,20,43,'E'),
    base('osym-2026-ayt-kim-21','Kimya','Asit-Baz Dengeleri',['zayıf asit','pH','Ka','iyonlaşma dengesi'],['asit baz','ph','ka','denge'],'Orta',false,21,43,'D'),
    base('osym-2026-ayt-kim-22','Kimya','Kimyasal Denge',['Kp','gaz dengesi','kısmi basınç'],['kimyasal denge','kp','gaz'],'Orta-Zor',false,22,43,'B'),
    base('osym-2026-ayt-kim-23','Kimya','Elektrokimya',['galvanik hücre','anot-katot','tuz köprüsü','hücre potansiyeli'],['elektrokimya','pil','tuz köprüsü','şekilli'],'Zor',true,23,43,'D'),
    base('osym-2026-ayt-kim-24','Kimya','Organik Moleküllerde Hibritleşme',['hibritleşme','sigma bağı','pi bağı','açık formül'],['organik kimya','hibritleşme','sigma','pi','şekilli'],'Orta-Zor',true,24,44,'C'),
    base('osym-2026-ayt-kim-25','Kimya','Organik ve Anorganik Bileşikler',['organik bileşik','anorganik bileşik','bileşik sınıflandırma'],['organik','anorganik','bileşik'],'Kolay-Orta',false,25,44,'B'),
    base('osym-2026-ayt-kim-26','Kimya','Alkenler ve Organik Tepkimeler',['alken adlandırma','katılma tepkimeleri','doymamış hidrokarbon'],['alken','organik tepkimeler','adlandırma','şekilli'],'Orta-Zor',true,26,44,'C'),
    base('osym-2026-ayt-kim-27','Kimya','Alkin Tepkimeleri',['asetilen','su katılması','aldehit'],['alkin','asetilen','katılma tepkimesi'],'Orta',false,27,44,'D'),

    base('osym-2026-ayt-biy-28','Biyoloji','Kas Sistemi ve Sarkomer',['sarkomer','aktin-miyozin','kasılma','bantlar'],['kas','sarkomer','aktin','miyozin','şekilli'],'Orta',true,28,45,'B'),
    base('osym-2026-ayt-biy-29','Biyoloji','Üreme Sistemi ve Oogenez',['oogenez','birincil oosit','ikincil oosit','mayoz'],['oogenez','oosit','mayoz'],'Orta',false,29,45,'C'),
    base('osym-2026-ayt-biy-30','Biyoloji','Boşaltım Sistemi',['nefron','üre','glomerulus','toplama kanalı'],['böbrek','nefron','üre'],'Orta',false,30,45,'E'),
    base('osym-2026-ayt-biy-31','Biyoloji','Endokrin Sistem - Melatonin',['melatonin','epifiz','biyolojik saat'],['hormon','melatonin','epifiz'],'Kolay-Orta',false,31,45,'D'),
    base('osym-2026-ayt-biy-32','Biyoloji','Dolaşım Sistemi - Kalp',['kalp anatomisi','kulakçık','karıncık','kapakçık'],['kalp','dolaşım','kapakçık'],'Orta',false,32,45,'D'),
    base('osym-2026-ayt-biy-33','Biyoloji','Popülasyon Ekolojisi',['popülasyon büyüklüğü','göç','doğum-ölüm','rekabet'],['popülasyon','ekoloji','büyüklük'],'Orta',false,33,46,'A'),
    base('osym-2026-ayt-biy-34','Biyoloji','Türler Arası İlişkiler',['mutualizm','komünite','türler arası etkileşim'],['mutualizm','komünite','ekoloji'],'Orta',false,34,46,'E'),
    base('osym-2026-ayt-biy-35','Biyoloji','DNA ve RNA',['nükleik asitler','nükleotit polimeri','dna-rna ortak özellikleri'],['dna','rna','nükleik asit'],'Kolay-Orta',false,35,46,'A'),
    base('osym-2026-ayt-biy-36','Biyoloji','DNA Kalıplı Sentez',['replikasyon','transkripsiyon','enzimler','kalıp zincir'],['dna','sentez','replikasyon','transkripsiyon','şekilli'],'Orta-Zor',true,36,46,'C'),
    base('osym-2026-ayt-biy-37','Biyoloji','Fotosentez ve Kloroplast',['kloroplast','tilakoit','stroma','calvin döngüsü','fotoliz'],['fotosentez','kloroplast','calvin','şekilli'],'Orta',true,37,46,'D'),
    base('osym-2026-ayt-biy-38','Biyoloji','Oksijenli Solunum',['oksidatif fosforilasyon','substrat düzeyinde fosforilasyon','kemiozmoz'],['solunum','atp','kemiozmoz'],'Orta',false,38,47,'E'),
    base('osym-2026-ayt-biy-39','Biyoloji','Bitkilerde Su Kaybı - Hidatod',['hidatod','gutasyon','bitkilerde boşaltım'],['hidatod','gutasyon','bitki'],'Kolay-Orta',false,39,47,'D'),
    base('osym-2026-ayt-biy-40','Biyoloji','Bitkilerde Taşıma - Ksilem ve Floem',['ksilem','floem','iletim dokuları'],['ksilem','floem','taşıma'],'Orta',false,40,47,'A')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
