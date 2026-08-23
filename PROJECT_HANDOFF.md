# YKS Uzman Hoca — Project Handoff

Last updated: 2026-08-23

Bu dosya YKS Uzman Hoca projesinin güncel çalışma hafızasıdır.

Yeni ChatGPT sohbetinde veya yeni geliştirme oturumunda bu dosya başlangıç
noktası olarak kullanılmalıdır.

Ancak bu dosyadaki SHA/deployment bilgileri yalnız referans noktasıdır.

Her yeni oturumun ilk işi canlı GitHub/Vercel durumunu yeniden
doğrulamaktır.

Canlı repository durumu ile bu dosya çelişirse canlı repository esas
alınır.

---

# 1. PROJENİN AMACI

YKS Uzman Hoca, öğrencinin telefon ve özellikle tablet üzerinde
kullanacağı kişisel web/PWA YKS çalışma uygulamasıdır.

Native Android uygulaması hedeflenmemektedir.

Amaç yalnız soru çözdürmek değildir.

Uygulama zaman içinde öğrenciyi tanımalı ve:

- çalışma geçmişini anlamalı
- güçlü/zayıf konuları tespit etmeli
- gerçek resmî sorularla seviyesini ölçmeli
- yanlışları takip etmeli
- adaptif testler sunmalı
- çalışma planı oluşturmalı
- rehberlik/motivasyon desteği vermeli
- öğrenme modelini zaman içinde geliştirmelidir

Ana bölümler:

- Soru Çöz
- Mini Testler
- Kişisel Öğretmen
- YKS Koçu
- Rehber Öğretmen
- Yanlışlarım
- Konu Takip
- İstatistikler
- Ayarlar

---

# 2. TEMEL EĞİTİM PRENSİBİ

YKS Uzman Hoca mümkün olduğunca:

- güncel MEB müfredatı
- MEBİ
- OGM Materyal
- ÖSYM çıkmış soruları

üzerinden çalışır.

Resmî soru akışlarında AI yeni soru üretmez.

AI'nın görevi:

- doğru resmî soruyu seçmek
- çözümü açıklamak
- öğrencinin performansını yorumlamak
- bir sonraki pedagojik adımı belirlemektir

Resmî soru:

AI tarafından uydurulmaz.

---

# 3. EKİP / GÖREV DAĞILIMI

## Ürün Sahibi

Yaşar Güler

Görev:

- öğrenci deneyimi
- ürün ihtiyaçları
- nihai ürün kararları
- kullanım geri bildirimi

## ChatGPT

Rol:

Ürün mimarı / ürün beyni / orkestrasyon merkezi.

Görev:

- ürün tasarımı
- sistem mimarisi
- pedagojik kararlar
- geliştirme sırası
- Codex görev paketleri
- Claude görev paketleri
- Gemini QA görevleri
- PR/rapor değerlendirmesi
- nihai teknik karar

ChatGPT uygulama kodunu doğrudan geliştiren ana ajan değildir.

## Codex

Rol:

Yazılım mühendisi.

Görev:

- uygulama/runtime geliştirme
- UI/UX implementasyonu
- test
- branch
- commit
- PR
- Vercel Preview
- regresyon kontrolü

Codex AGENTS.md kurallarına tabidir.

## Claude

Rol:

Soru kütüphanesi uzmanı.

Ana alan:

- ÖSYM/MEB/MEBİ/OGM kataloglama
- question metadata
- answerKey
- topic/subtopic
- visual flag
- source-map
- crop
- soru QA

Claude:

claude/question-library

branch'inde çalışır.

main'e doğrudan push yapmaz.

App/runtime alanına görev açıkça verilmedikçe dokunmaz.

## Gemini

Rol:

Bağımsız QA / Red Team.

Görev:

- Codex çıktısını bağımsız sınamak
- Claude soru/crop çıktısını ikinci göz olarak incelemek
- mobil/tablet/desktop UX kontrolü
- regresyon aramak
- "çalışıyor" denilen sistemi kırmaya çalışmak

Gemini'nin raporu tek başına nihai karar değildir.

ChatGPT raporu değerlendirir.

---

# 4. GELİŞTİRME AKIŞI

Normal uygulama geliştirme akışı:

Ürün sahibi + ChatGPT
→ ürün/mimari kararı
→ ChatGPT Codex görev paketi
→ Codex feature branch
→ kod/test
→ Draft PR
→ Vercel Preview
→ ChatGPT teknik inceleme
→ gerektiğinde Gemini bağımsız QA
→ Codex düzeltme
→ ChatGPT merge onayı
→ squash merge
→ otomatik Vercel Production
→ production smoke test

Production manuel deploy edilmemelidir.

Vercel GitHub entegrasyonu kullanılmalıdır.

---

# 5. GITHUB / VERCEL DURUMU

Repository:

tuyas2005-lab/yks-uzman-hoca

Production:

https://yks-uzman-hoca.vercel.app

Güncel doğrulanmış main:

2886338a58603805a0b85e4e6155622f9eda9604

Commit:

Integrate topic tests into learning insights

Production:

SUCCESS

Production HTTP:

200

Not:

Yeni sohbet/oturumda bu SHA mutlaka yeniden doğrulanmalıdır.

---

# 6. TAMAMLANAN ÖNEMLİ UYGULAMA ÇALIŞMALARI

## Clean Startup / Shadow UI

Eski/demo/gölge ekranların kullanıcıya önce gösterilip sonra
JavaScript ile gizlenmesi büyük ölçüde temizlendi.

Uygulama gerçek UI hazır olmadan legacy ekran göstermemelidir.

## Kaynak Soru Açma / Autocrop

2024–2025 student-ready/preparable kaynak soruların Mini Test üzerinden
açılması sağlandı.

Eski viewer'ın autocrop zincirini bypass etmesi düzeltilmiştir.

## Source Learning Loop

Production main:

ac7508730cd4c115b4605464c424492c63e0b7c6

Akış:

Kaynak Soru
→ StudyEvent
→ yanlış
→ Yanlışlarım
→ retry
→ yalnız doğru retry ile kapanış

Canonical kaynak sonuç writer:

recordSourceQuestionAttempt

Retry ilişkisi:

retryOf

Canonical yanlış kapatma:

app-wrong-closure-v2.js
closeWrongRecord
method: retry-correct

Kurallar:

- retry yanlış açık yanlışı kapatmaz
- retry Yapamadım açık yanlışı kapatmaz
- retry doğru açık yanlışı kapatır
- aynı UI aksiyonu duplicate StudyEvent oluşturmamalıdır
- bilinçli yeni retry yeni attempt olarak kaydedilmelidir
- geçmiş attempt'ler silinmemelidir
- Yanlışlarım'da aynı canonical hata için duplicate açık kart olmamalıdır

## Source Card Catalog Resolver

Mini Test ve resmî kaynak kartları, katalogdan gelen gerçek `id` değerini
canonical `data-catalog-id` olarak render eder.

Tek resolver bu açık kimliği önceliklendirir. Yalnız legacy kartlarda çalışan
fallback; yıl, sınav, ders ve soru numarasını birlikte doğrulamadan eşleşme
yapmaz. Belirsiz eşleşmelerde ilk kaydı seçmek yerine `null` döndürür.

---

# 7. BİLİNEN PWA / CACHE GÖZLEMİ

Production smoke testinde eski bir PWA oturumunda Mini Test ekranının
"hazırlanıyor" durumunda kalabildiği gözlenmiştir.

Temiz/disposable production profilde tekrar edilmemiştir.

Şu an production blocker değildir.

Güvenli refresh sayfası:

https://yks-uzman-hoca.vercel.app/refresh-v5.html

İleride Responsive/PWA çalışmasında yeniden incelenecektir.

---

# 8. SORU KÜTÜPHANESİ DURUMU

## 2024 TYT

Katalog + resmî kaynak + answerKey + page/source-map/crop + uygulama
açılabilirlik çalışmaları büyük ölçüde tamamlanmıştır.

Mini Test yıl filtresi üzerinden öğrenciye açılabilmektedir.

## 2025 TYT

2024 ile aynı student-ready pipeline içinde tamamlanmıştır.

## 2023 TYT

Ana katalog:

120/120

Kitapçıktaki alternatif Felsefe dahil fiziksel toplam:

125

Son doğrulanmış Claude katalog commit:

c621bb2c2aa88e07c1ef5f5f3dd96499f2c6371b

Dağılım:

Türkçe 40
Matematik + Geometri 40
Sosyal 20 ana + 5 alternate
Fen 20

2023 katalog fazı tamamlanmıştır.

### 2023 TYT Fen — kaynak hazırlık durumu

Claude branch:

`claude/question-library`

Son doğrulanmış Claude commit:

`02fb997b2968b63ee3612eb9c3ece38f896c9944`

Doğrulanmış sonuçlar:

- Fen soru sayısı: 20
- Exact PDF page: 20/20
- Source-map: 20/20
- Crop: 20/20
- Visual QA: 20/20 PASS
- `needs-manual-review` flag: 0
- Korunan answerKey: `ADBBACCEBCAEADDAEBED`
- Validator: 660 kayıt, 0 hata, 0 uyarı
- Student-ready: 20/20

Durum:

- Catalog ✅
- Exact page ✅
- Source-map ✅
- Crop geometry ✅
- Visual QA ✅
- Runtime integration ✅
- Student-ready ✅

Production runtime sonucu:

- `osym-2023-tyt` PDF kaynağı API `SOURCES` objesine eklendi.
- `app-source-map-2023-tyt-fen.js` runtime/lazy-load zincirine bağlandı.
- 20/20 Fen sorusu runtime crop testini geçti.
- Fizik 1 ve Biyoloji 19 production source viewer kabul testini geçti.
- Mini Test → TYT → Fizik → 2023 akışı production üzerinde doğrulandı.
- 2024/2025/2026 source regression ve Source Learning Loop PASS.

Önceki runtime blocker çözülmüş ve production doğrulaması tamamlanmıştır.

---

# 9. SOURCE-READY PRENSİBİ

Bir resmî soru yalnız aşağıdakilerin tamamı sağlandığında öğrenciye hazır
kabul edilmelidir:

- gerçek resmî soru
- doğru soru numarası
- doğrulanmış answerKey
- exact PDF page
- doğru source-map
- doğru crop
- tüm seçenekler
- gerekli şekil/grafik/tablo
- okunabilir visual QA

Hazır olmayan resmî sorular Mini Test'e sokulmamalıdır.

app-source-incomplete-policy ve ilgili readiness güvenlikleri sırf daha
fazla soru göstermek için gevşetilmemelidir.

---

# 10. ÜRÜN YOL HARİTASI

## 1 — Source Learning Loop

DURUM:

TAMAMLANDI / PRODUCTION

Kaynak soru → StudyEvent → Yanlışlarım → retry → kapanış.

---

## 2 — Soru Çöz 2.0

DURUM:

TAMAMLANDI / PRODUCTION

Ana sayfadaki:

Soru Yükle
+
Soru Yaz

iki ayrı giriş tek çalışma alanında birleştirildi.

Tek:

Soru Çöz

çalışma alanı oluşturuldu.

Ekran:

- Kameradan Çek
- Galeriden Seç
- soru görseli preview
- soru yaz/yapıştır text alanı
- görsel + öğrenci açıklaması birlikte
- tek AI çözüm akışı

Ana sayfadaki Hızlı Başla bölümünde iki kart yerine tek:

Soru Çöz

kartı bulunur.

Alt metin:

Fotoğrafla veya yazarak sorunu çöz

Sol navigasyondaki Soru Çöz aynı birleşik ekrana gider.

---

## 2.1 — Soru Çöz 2.1 Answer Consistency

DURUM:

TAMAMLANDI / PRODUCTION

Production feature SHA:

d9eb3eab98a10fb24a232b5a298900eeb49bf927

Production feature commit:

Add answer consistency verification

Candidate Solve
→ Independent Verifier
→ Correction gerekirse maksimum 1 pass
→ 3-way mismatch veya düşük güven
→ Controlled Uncertainty

Backlog:

Soru Çöz 2.1 Input Robustness

---

## 2.2 — Konu Bazlı Test Çalışması Girişi

DURUM:

TAMAMLANDI / PRODUCTION

Teslim zinciri:

- Phase A — PR #18: canonical topic-test veri sözleşmesi
- Phase B — PR #19: topic-test giriş UI'ı
- Phase C — PR #20: öğrenme modeli, Kişisel Öğretmen ve YKS Koçu entegrasyonu
- Production merge SHA: 2886338a58603805a0b85e4e6155622f9eda9604

Tamamlanan davranışlar:

- Aynı konuya ait testler soru hacmine göre weighted aggregation ile birleştirilir.
- Tek testte kesin trend üretilmez; yeterli tekrar olduğunda gelişim trendi hesaplanır.
- Topic-test soru sayısı Daily Goal'a event başına +1 yerine gerçek soru adediyle katkı yapar.
- Konu Takip; test sayısı, soru, doğru, yanlış, boş, net, accuracy ve trend kanıtını gösterir.
- Kişisel Öğretmen topic-test evidence'i toplu performans sinyali olarak kullanır.
- YKS Koçu; recency, soru hacmi, tekrar sayısı, accuracy, net ve trendi plan kararına taşır.
- Aggregate weakness ile question-level mistake ayrıdır; toplu yanlış sayısı Yanlışlarım'da sahte soru kartı oluşturmaz.
- Authenticated Vercel Preview üzerinde gerçek Teacher ve Coach AI endpoint acceptance testleri PASS olmuştur.
- Production smoke: kayıt, Daily Goal, Konu Takip, Teacher/Coach runtime zinciri ve Yanlışlarım koruması PASS.

---

## 3 — Kişisel Öğretmen 2.0

DURUM:

ÜRÜN TASARIMI BELİRLENDİ

Yeni konsept:

SÜREKLİ ADAPTİF ÖZEL DERS OTURUMU

Mevcut:

Bugünkü 3 Adım
Hızlı Tekrar
Yanlışları Düzelt

merkezli yapı kaldırılacaktır.

Kişisel Öğretmenin temel görevi:

Öğrenciyi resmî sorularla ölçmek ve bir sonraki en değerli soruyu
seçmek.

### Ders seçimi

Öğrenci önce hangi dersi çalışmak istediğini seçer.

Örnek:

Matematik
Türkçe
Fizik
Kimya
Biyoloji
Tarih
Coğrafya
vb.

Böylece Kişisel Öğretmen o dersin özel ders hocası gibi davranır.

### Konu seçimi

İki mod:

1. Hocam sen seç
2. Belirli bir konu çalışmak istiyorum

Varsayılan:

Hocam sen seç

Öğretmen öğrencinin öğrenme modelinden en uygun konuyu belirler.

### Tek tek adaptif soru

Öğretmen baştan 3/5/10 soruluk sabit test vermek zorunda değildir.

Sorular TEK TEK gelir.

Her cevaptan sonra:

öğrenme modeli
→ cevap
→ zorluk
→ konu/subtopic
→ önceki performans

yeniden değerlendirilir.

Sonra bir sonraki en değerli resmî soru seçilir.

Öğrenci her sorudan sonra:

Sonraki Soruyu Getir

veya

Bugünlük Bu Kadar

diyebilir.

Öğrenci istediği kadar soru çözer.

Öğretmen de yeterli veri toplandığını düşündüğünde:

"Bugün bu konu için yeterli."

diyebilmelidir.

### Ders sonu

Öğretmen kısa özel ders özeti üretir:

- kaç soru
- doğru/yanlış
- güçlü nokta
- zorlanılan alt beceri
- veri güveni
- bir sonraki derste nereden devam edilmeli

Bir sonraki Kişisel Öğretmen oturumunda önceki dersin hafızası
kullanılmalıdır.

### Öğretmenin görev sınırı

Yanlışları yönetmek:

Yanlışlarım bölümünün görevidir.

Çalışma zamanlaması:

YKS Koçu'nun görevidir.

Motivasyon:

Rehber Öğretmenin görevidir.

Kişisel Öğretmen:

akıllı/adaptif resmî soru öğretmenidir.

---

# 11. KİŞİSEL ÖĞRETMEN — SORU HAVUZU PRENSİBİ

Kişisel Öğretmenin zekâsı yalnız algoritmadan değil, soru havuzunun
derinliğinden gelir.

AI yeni soru üretmez.

Öğretmen:

doğrulanmış resmî soru havuzundan adaptif seçim yapar.

Gerekli metadata zamanla şu seviyeye geliştirilmelidir:

- subject
- topic
- subtopic
- kazanım
- soru tipi
- zorluk
- visual
- ölçülen beceri
- similarity group

Amaç:

aynı konu içinde farklı soru yapılarını kullanabilmek.

Öğrenci anlamadığında öğretmen aynı sorunun kopyasını değil,
aynı kazanımı farklı açıdan ölçen başka bir resmî soru getirmelidir.

---

# 12. TEACHER POOL COVERAGE

Yeni soru havuzu metriği:

Teacher Pool Coverage

Amaç:

Her konu / alt konu için Kişisel Öğretmenin elinde kaç student-ready
resmî soru bulunduğunu ölçmek.

Önerilen kaba kalite seviyeleri:

0–2:
kritik yetersiz

3–4:
sınırlı

5–9:
temel adaptif kullanım

10–19:
iyi

20+:
güçlü öğretmen havuzu

Bu metrik ileride internal QA/dashboard olarak kullanılabilir.

---

# 13. OGM / MEBİ SORU HAVUZU GENİŞLETME

DURUM:

PLANLANDI

ÖSYM soruları çekirdek havuz olacaktır.

Konu derinliğini artırmak için:

- OGM Soru Bankası
- OGM 3 Adım Soru Bankaları
- Dört Dörtlük Konu Pekiştirme Testleri
- MEBİ
- diğer resmî MEB kaynakları

kullanılacaktır.

Çalışma modeli:

ChatGPT
→ resmî OGM/MEBİ konu bazlı kaynakları bulur

Kullanıcı
→ gerekli PDF/dosyaları Claude'a yükler

Claude
→ soruları işler
→ answerKey
→ topic/subtopic
→ visual
→ duplicate
→ source/crop/readiness

Pilot başlangıç:

TYT Matematik

Özellikle konu bazlı havuz derinliği oluşturulacaktır.

---

# 14. YENİ GÖRSEL KİMLİK

DURUM:

PLANLANDI

Amaç:

Mevcut düz dashboard görünümünü daha genç, canlı ve premium hale
getirmek.

Prensip:

çocuk uygulaması görünümü OLMAMALI.

Hedef:

- hafif 3D/elevated kartlar
- belirgin kutular
- modern renk paleti
- yumuşak gölgeler
- gradient/light accents
- güçlü görsel hiyerarşi
- tutarlı ikonografi
- mikro animasyonlar
- tablet öncelikli tasarım

Mevcut mor kimlik korunabilir.

Yan renkler:

lavanta
mint
mercan
elektrik mavisi
sıcak sarı

gibi modern vurgu renkleri olabilir.

---

# 15. SOHBET MASKOTU

DURUM:

PLANLANDI

Yeni görsel kimlik ile birlikte uygulama içinde sohbet edilebilen bir
maskot düşünülmektedir.

Maskot yeni bağımsız bir AI sistemi değildir.

Tek doğal sohbet kapısıdır.

Kullanıcı isteğine göre mevcut doğru sisteme bağlanır:

ders sorusu
→ Soru Çöz / Kişisel Öğretmen

çalışma planı
→ YKS Koçu

motivasyon
→ Rehber Öğretmen

performans
→ öğrenme modeli

Maskot dekor değil, işlevsel olmalıdır.

---

# 16. RESPONSIVE / PWA 2.0

DURUM:

PLANLANDI

Telefon, tablet ve desktop davranışı ayrı QA çalışması olarak
incelenecektir.

Hedef:

aynı ürün kimliği
+
ekran boyutuna uygun yerleşim.

Örnek test viewports:

Telefon:
390x844
412x915

Tablet:
768x1024
820x1180
1024x1366

Desktop:
1366x768+
1920x1080

Tablet önemli önceliktir.

Responsive kurallar ileride AGENTS.md içine kalıcı geliştirme standardı
olarak eklenebilir.

---

# 17. PROJE HAFIZASI / HANDOFF PROTOKOLÜ

PROJECT_HANDOFF.md proje hafızasıdır.

Bu dosya:

- önemli production merge
- mimari karar
- önemli Claude soru batch'i
- roadmap değişikliği
- sohbet değiştirmeden önce

gerektiğinde güncellenir.

Her küçük committe güncellemek zorunlu değildir.

Sohbet değiştirmeden önce güncelleme zorunludur.

Yeni ChatGPT sohbetinde kullanıcı şu talimatı verebilir:

"YKS Uzman Hoca projesinin devamıdır.
Önce GitHub repository'sindeki PROJECT_HANDOFF.md ve AGENTS.md
dosyalarını oku.
Hafızadan tahmin yürütme.
Güncel main, claude/question-library, açık Codex PR'ları ve Vercel
production durumunu canlı olarak doğrula.
Devir dosyası ile canlı repo arasında fark varsa canlı repo durumunu
esas al.
Sonra bana 'Projeyi devraldım; güncel durum şu...' şeklinde kısa rapor
ver ve kaldığımız yerden devam et."

---

# 18. GELECEK OTOMASYON FİKRİ

PLANLANDI / HENÜZ KURULMADI

Amaç:

Ürün sahibini ChatGPT ↔ Codex arasında manuel mesaj taşıyan kişi
olmaktan çıkarmak.

Olası mimari:

ChatGPT
→ GitHub Issue
→ codex-ready label
→ yerel Codex Task Runner
→ codex feature branch
→ test
→ Draft PR
→ ChatGPT review
→ Gemini QA
→ merge onayı

İlk pilot:

Codex yeni GitHub Issue algılar
→ yalnız "görevi aldım" işareti
→ kod yazmadan güvenli otomasyon testi

Production merge yetkisi otomatik agent'a verilmemelidir.

---

# 19. ŞU ANDAKİ SONRAKİ İŞ

Konu Bazlı Test Çalışması tamamlandı ve production'da kapatıldı.

Yeni Phase D başlatılmadı. Sonraki ana geliştirme ürün sahibi + ChatGPT
tarafından ayrıca belirlenecektir.

---

# 20. DEĞİŞMEZ ANA PRENSİPLER

1. AI resmî soru üretmez.

2. Hazır olmayan resmî soru öğrenciye gösterilmez.

3. Öğrenci öğrenme modeli tek source-of-truth'a yaklaşmalıdır.

4. Patch üstüne patch varsayılan çözüm değildir.

5. Eski/demo/gölge UI kullanıcıya gösterilmemelidir.

6. Production gerçek öğrenci verisi korunmalıdır.

7. Codex main'e doğrudan push yapmaz.

8. Claude uygulama runtime alanına görev dışında dokunmaz.

9. Gemini bağımsız QA'dır; ürün sahibi değildir.

10. Production merge kararını ChatGPT + kullanıcı verir.

11. Tablet öncelikli UX korunmalıdır.

12. Her yeni özellik öğrencinin gerçek öğrenme değerini artırmalıdır.
