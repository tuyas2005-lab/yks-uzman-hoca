# AGENTS.md
# YKS Uzman Hoca — Codex Çalışma Anayasası

## 1. PROJE NEDİR?

Bu repository, "YKS Uzman Hoca" isimli kişisel YKS çalışma ve öğrenme uygulamasıdır.

Repository:
tuyas2005-lab/yks-uzman-hoca

Uygulama ağırlıklı olarak tablet ve mobil kullanım için geliştirilmektedir.

Temel amaç yalnızca soru çözen bir uygulama yapmak değildir.

Amaç:

- öğrencinin çalışma geçmişini anlamak,
- güçlü ve zayıf konularını tespit etmek,
- yanlışlarını takip etmek,
- kişiselleştirilmiş çalışma önerileri oluşturmak,
- resmi ÖSYM sorularını ve MEB kaynaklarını kullanmak,
- kişisel öğretmen gibi davranmak,
- YKS koçluğu yapmak,
- rehber öğretmen desteği vermek,
- zaman içinde öğrenciyi tanıyan bir öğrenme sistemi oluşturmaktır.

Bu nedenle uygulamanın merkezinde yalnız UI değil, ÖĞRENCİ ÖĞRENME MODELİ vardır.

---

# 2. PROJENİN KARAR MEKANİZMASI

Bu projede görev dağılımı nettir.

## Ürün sahibi

Yaşar Güler.

Nihai ürün kararları kullanıcıya aittir.

## Ürün mimarisi / ürün beyni

ChatGPT.

ChatGPT:

- yeni özellikleri tasarlar,
- kullanıcı deneyimini belirler,
- sistem mimarisini değerlendirir,
- pedagojik mantığı belirler,
- geliştirme sırasını belirler,
- Codex için teknik görev talimatlarını hazırlar,
- Codex'in yaptığı değişiklikleri ve raporlarını değerlendirir.

## Yazılım uygulayıcısı

Codex.

Codex'in görevi:

> ChatGPT tarafından hazırlanmış teknik görevi mevcut repository üzerinde güvenli, temiz ve test edilmiş biçimde uygulamaktır.

Codex ürün yöneticisi değildir.

Codex kendiliğinden yeni özellik eklememeli, tasarım değiştirmemeli veya ürün davranışını yeniden yorumlamamalıdır.

Bir görev verilmişse kapsamın dışına çıkılmamalıdır.

---

# 3. TEMEL ÇALIŞMA PRENSİBİ

Her geliştirme şu akışla yapılır:

Yaşar + ChatGPT
↓
ürün kararı
↓
ChatGPT teknik görev hazırlar
↓
Yaşar görevi Codex'e verir
↓
Codex kodu inceler
↓
Codex uygular
↓
Codex test eder
↓
Codex değişiklik raporu üretir
↓
Yaşar raporu ChatGPT'ye verir
↓
ChatGPT sonucu değerlendirir
↓
bir sonraki görev belirlenir

Codex bu döngüyü değiştirmemelidir.

---

# 4. CODEX'İN ANA KURALI

İlk önce kodu anlamadan kod yazma.

Bir görev geldiğinde önce:

1. İlgili dosyaları belirle.
2. Mevcut veri akışını incele.
3. Eski ve yeni sürüm katmanlarını kontrol et.
4. Aynı işlevi yapan birden fazla modül olup olmadığını araştır.
5. Değişikliğin başka ekranlara etkisini değerlendir.
6. Ondan sonra uygulamaya geç.

Semptom düzeltmek yerine mümkün olduğunda kök nedeni düzelt.

---

# 5. MİMARİ PRENSİP

YKS Uzman Hoca zaman içinde geliştirilmiş bir projedir.

Bu nedenle repository içinde aynı özelliğin:

- eski sürümü,
- yeni sürümü,
- patch'i,
- fix'i,
- override'ı

aynı anda bulunabilir.

Örneğin:

app-x.js
app-x-v2.js
app-x-v3.js
app-x-fix.js

gibi yapılar bulunabilir.

Yeni geliştirme yapılırken yeni bir patch dosyası eklemek otomatik tercih değildir.

Önce şu soru sorulmalıdır:

> Mevcut mimari sadeleştirilebilir mi?

Tercih sırası:

1. mevcut doğru modülü iyileştirmek,
2. eski ve gereksiz katmanı kaldırmak,
3. tek source-of-truth oluşturmak,
4. ancak gerçekten gerekli ise yeni modül eklemek.

Patch üstüne patch eklemekten kaçınılmalıdır.

---

# 6. "GÖLGE UYGULAMA" YASAĞI

Projede geçmişte şu mimari problemi yaşanmıştır:

Eski/demo HTML önce kullanıcıya gösteriliyor,
daha sonra JavaScript yeni ekranı oluşturuyor,
eski içerik gizleniyor veya kaldırılıyordu.

Bu yaklaşım yasaktır.

Kullanıcıya:

- eski ekran,
- demo ekran,
- fake istatistik,
- fake çalışma verisi,
- sonradan kaybolacak placeholder UI

gösterilmemelidir.

Bir modül henüz hazır değilse:

"Bölüm hazırlanıyor…"

gibi temiz bir loading state kullanılabilir.

Gerçek ekran hazır olduğunda tek seferde gösterilmelidir.

---

# 7. DEMO VERİ YASAĞI

Production UI içinde gerçek öğrenci verisi varmış gibi görünen sabit örnek değerler kullanılmamalıdır.

Örneğin:

7 / 10 soru
%69 başarı
13 toplam soru
4 aktif gün
+4.75 net
Köklü Sayılar en zayıf konu

gibi sabit değerler production ekranında gerçek veri gibi gösterilmemelidir.

Gerçek veri yoksa arayüz bunu açıkça belirtmelidir.

Örnek:

"Henüz yeterli veri yok."

veya

"İlk mini testinden sonra burada analiz göreceksin."

---

# 8. ÖĞRENCİ VERİSİ TEK KAYNAKTAN GELMELİ

Uygulamada zamanla farklı veri yapıları oluşmuş olabilir:

state
sessions
studyEvents
topicMastery
miniTests
activityLog
fieldArchive
YKSDataV5
learning model

Yeni özellik geliştirirken aynı verinin yeni bir kopyasını oluşturma.

Önce mevcut veri modelini araştır.

Mümkün olduğunca merkezi öğrenme modeli kullanılmalıdır.

Hedef:

Tek öğrenci
→ tek öğrenme modeli
→ tüm ekranlar aynı öğrenciyi görür.

Mini Testler, Kişisel Öğretmen, Koç, Yanlışlarım ve İstatistikler birbirinden bağımsız veri adaları oluşturmamalıdır.

---

# 9. ÖĞRENME MODELİ PROJENİN ÇEKİRDEĞİDİR

Uygulamanın uzun vadeli beyni öğrencinin öğrenme modelidir.

Bu model mümkün olduğunca şu sinyalleri anlamalıdır:

- hangi ders çalışıldı,
- hangi konu çalışıldı,
- soru doğru/yanlış,
- öğrencinin yanlış nedeni,
- zorluk seviyesi,
- çözüm süresi,
- takıldığı adım,
- tekrar çözüm sonucu,
- mini test performansı,
- resmi ÖSYM soru performansı,
- deneme performansı,
- zaman içindeki gelişim,
- unutma / tekrar ihtiyacı.

Yeni özellik tasarlarken:

> Bu özellik öğrenme modeline hangi anlamlı veriyi ekliyor?

sorusu düşünülmelidir.

---

# 10. RESMİ KAYNAK MİMARİSİ

YKS Uzman Hoca resmi eğitim kaynaklarını önceliklendirir.

Temel kaynaklar:

- ÖSYM
- MEB
- MEBİ
- OGM Materyal
- güncel MEB müfredatı

Soru katalogları ve resmi soru metadata yapıları hassas bölgelerdir.

Bu dosyalarda gereksiz değişiklik yapılmamalıdır.

Özellikle:

data/question-catalog*
data/catalog/*
source-map*
source readiness
dedupe
policy

gibi alanlar yalnız görev doğrudan bunlarla ilgiliyse değiştirilmelidir.

---

# 11. CLAUDE QUESTION LIBRARY ALANI

Repository'de soru kütüphanesi üzerinde başka bir çalışma akışı bulunabilir.

Claude tarafından oluşturulan soru kütüphanesi / katalog branch'leri ayrı sorumluluk alanıdır.

Codex verilen görev açıkça soru kataloğu ile ilgili değilse:

- Claude soru branch'ine müdahale etmemeli,
- katalog sorularını yeniden yazmamalı,
- answerKey değiştirmemeli,
- ÖSYM metadata değiştirmemeli,
- source crop yapılarını gereksiz yere değiştirmemelidir.

---

# 12. UI / UX PRENSİPLERİ

YKS Uzman Hoca profesyonel bir öğrenci uygulaması gibi görünmelidir.

UI için temel ilkeler:

- sade,
- hızlı,
- modern,
- tablet uyumlu,
- mobil uyumlu,
- öğrenciyi yormayan,
- bilgi yoğunluğunu kontrollü kullanan,
- gereksiz animasyon içermeyen,
- anlamlı loading state kullanan,
- tutarlı navigasyona sahip

bir tasarım korunmalıdır.

Bir ekran yeniden tasarlanırken önce mevcut tasarım dili incelenmelidir.

Codex kendi tasarım dilini projeye dayatmamalıdır.

---

# 13. TABLET ÖNCELİĞİ

Uygulama özellikle tablet kullanımına uygundur.

Değişiklikler kontrol edilirken en az şu ekran davranışları düşünülmelidir:

- geniş masaüstü,
- tablet,
- mobil.

Mobil düzeltmesi masaüstünü bozmamalı,
masaüstü düzeltmesi tableti bozmamalıdır.

---

# 14. PERFORMANS

İlk açılış süresi önemlidir.

Ağır modüller gereksiz yere startup sırasında yüklenmemelidir.

Lazy-load kullanılabilir.

Ancak lazy-load nedeniyle eski UI gösterilmemelidir.

Tercih edilen davranış:

App shell
↓
çekirdek öğrenci modeli
↓
ana ekran
↓
ihtiyaç halinde ilgili modül

Büyük soru katalogları yalnız gerektiğinde yüklenmelidir.

---

# 15. SERVICE WORKER / PWA

Bu uygulama PWA olarak kullanılmaktadır.

Service Worker değişikliklerinde özellikle dikkat edilmelidir.

Eski JavaScript veya CSS'nin cache nedeniyle kullanıcıya gösterilmesi kabul edilmez.

Çevrimiçiyken kritik uygulama kodunda güncel sürüm öncelikli olmalıdır.

Offline kullanım korunmalıdır.

Service Worker değiştirildiğinde:

- CACHE versiyonu değerlendirilmelidir,
- eski cache temizliği kontrol edilmelidir,
- HTML,
- CSS,
- JavaScript

davranışı test edilmelidir.

---

# 16. KOD TEMİZLİĞİ

Bir kod dosyasını değiştirirken:

gereksiz global değişken,
aynı işi yapan ikinci fonksiyon,
tekrarlanan event listener,
aynı ekranı iki kez render eden zincir,
MutationObserver ile sürekli DOM temizleme,
setTimeout ile UI düzeltme hack'i

oluşturmaktan kaçınılmalıdır.

Özellikle şu anti-pattern'e dikkat:

render old UI
↓
wait
↓
delete old UI
↓
render new UI

Bunun yerine:

prepare
↓
render final UI

kullanılmalıdır.

---

# 17. MEVCUT DAVRANIŞI KORUMA

Bir görevin amacı A özelliğini düzeltmekse B, C ve D özelliklerini yeniden tasarlama.

Minimum gerekli değişiklik prensibi uygulanmalıdır.

Ancak mevcut kodda görevi doğrudan etkileyen eski veya gereksiz katman varsa güvenle sadeleştirilebilir.

---

# 18. VERİ KAYBI YASAĞI

Kullanıcının mevcut:

- çalışma geçmişi,
- soru geçmişi,
- mini test sonuçları,
- denemeleri,
- profil bilgileri,
- yanlış kayıtları,
- öğrenme verileri

mümkün olduğunca korunmalıdır.

Schema değişikliği yapılacaksa migration düşünülmelidir.

localStorage veya Supabase verisi sessizce sıfırlanmamalıdır.

---

# 19. SUPABASE

Supabase kullanılan alanlarda:

- client-side service-role key kullanılmaz,
- RLS korunur,
- kullanıcı yalnız kendi verisini görmelidir,
- auth ve sync davranışı bozulmamalıdır.

Görev Supabase ile ilgili değilse auth mimarisi gereksiz yere değiştirilmemelidir.

---

# 20. BRANCH ÇALIŞMA PRENSİBİ

Doğrudan main üzerinde büyük değişiklik yapma.

Tercihen:

main
↓
feature/fix branch
↓
uygulama
↓
test
↓
diff kontrolü
↓
PR
↓
merge

kullanılmalıdır.

Branch adı yapılan işi açıkça ifade etmelidir.

Örnek:

codex/fix-stats-data-source

codex/teacher-learning-model

codex/mini-test-flow

---

# 21. TEST ZORUNLULUĞU

"Dosyayı değiştirdim" görev tamamlandı anlamına gelmez.

Mümkün olan her görevde şunları kontrol et:

- syntax hatası,
- runtime error,
- console error,
- ilgili ekranın açılması,
- navigasyon,
- mobil/tablet davranışı,
- diğer ekranlarda regresyon,
- production build.

Değişiklik UI ile ilgiliyse mümkünse gerçek tarayıcı davranışını kontrol et.

---

# 22. GÖREV DIŞI HATA BULURSAN

Görev sırasında başka bir sorun görürsen:

sessizce büyük kapsamlı düzeltme yapma.

Raporla.

Format:

"Ek gözlem:
X bölümünde Y problemi fark edildi.
Mevcut görevin kapsamına dahil etmedim.
Önerilen sonraki çalışma: Z."

Kritik ve doğrudan mevcut değişikliği engelleyen bir sorun ise gerekli minimum düzeltme yapılabilir.

---

# 23. CODEX KENDİLİĞİNDEN ÜRÜN KARARI VEREMEZ

Şunları kendi başına değiştirme:

- uygulamanın ana navigasyonu,
- pedagojik yaklaşım,
- kişisel öğretmen davranışı,
- YKS koçu stratejisi,
- öğrenci değerlendirme algoritması,
- yeni kullanıcı akışı,
- ekran isimleri,
- ürün özelliklerinin kaldırılması.

Bunlar ChatGPT + ürün sahibi tarafından belirlenir.

---

# 24. HER GÖREV SONUNDA ZORUNLU RAPOR

Codex her çalışma sonunda aşağıdaki formatta rapor vermelidir.

## CODEX GERİ BİLDİRİM RAPORU

### 1. Görev
Bana verilen görevin kısa özeti.

### 2. İncelediğim yapı
İlgili dosyalar ve mevcut mimarinin kısa açıklaması.

### 3. Kök neden
Sorun varsa gerçek nedeni.

### 4. Yaptığım değişiklikler
Dosya bazında yapılan değişiklikler.

### 5. Değiştirilen dosyalar
Tam dosya listesi.

### 6. Özellikle dokunmadığım alanlar
Risk nedeniyle veya görev dışı olduğu için değiştirilmemiş kritik alanlar.

### 7. Testler
Yapılan testler ve sonuçları.

### 8. Regresyon kontrolü
Başka hangi ekranların etkilenmediği kontrol edildi.

### 9. Deployment / PR
Varsa branch, commit, PR ve deployment bilgileri.

### 10. Bilinen riskler
Varsa açıkça yaz.

### 11. Ek gözlemler
Görev sırasında fark edilen ancak kapsam dışı bırakılan problemler.

### 12. ChatGPT'nin değerlendirmesi gereken konu
Bir sonraki mimari veya ürün kararını gerektiren durum varsa açıkça belirt.

Bu rapor kullanıcı tarafından ChatGPT'ye geri verilecektir.

Bu nedenle kısa ama teknik açıdan yeterli olmalıdır.

---

# 25. GÖREV TAMAMLAMA KRİTERİ

Bir görev ancak şu koşullarda tamamlanmış sayılır:

- verilen hedef gerçekleştirildi,
- ilgili kod incelendi,
- gereksiz paralel mimari oluşturulmadı,
- mevcut veri korunuyor,
- uygulama açılıyor,
- ilgili ekran çalışıyor,
- temel regresyon kontrolü yapıldı,
- Codex geri bildirim raporu oluşturuldu.

---

# 26. SON PRENSİP

Bu proje hızlı büyüyen bir prototip olmaktan çıkıp gerçek bir ürün mimarisine dönüşmektedir.

Her yeni görevde amaç yalnız:

"çalışıyor mu?"

olmamalıdır.

Şu üç soru birlikte sorulmalıdır:

1. Doğru çalışıyor mu?
2. Mimari olarak temiz mi?
3. Bir sonraki geliştirmeyi kolaylaştırıyor mu?

Kodun uzun vadede sürdürülebilir olması kısa vadeli patch'ten daha önemlidir.

---

## GITHUB / VERCEL YETKİ KURALI

Codex GitHub üzerinde çalışabilir ancak:

- main branch'e doğrudan commit veya push yapma.
- Her geliştirme için `codex/<feature-name>` branch kullan.
- Değişiklikleri yalnız çalışma branch'ine commit/push et.
- PR aç.
- Kullanıcı veya ChatGPT açıkça onay vermeden PR'ı merge etme.
- Production deploy'u manuel başlatma.
- Production deployment yalnız main merge sonrası mevcut Vercel Git
  entegrasyonu üzerinden otomatik oluşmalıdır.
- Vercel proje ayarlarını, environment variables, domain veya production
  deployment ayarlarını görev açıkça istemiyorsa değiştirme.
- Vercel credential/token isteme veya saklama.
- Preview deployment oluşursa durumunu raporla.
- Production'a geçiş için açık onay bekle.

---
