# Kişisel Öğretmen 2.0 — Master Plan

**Durum:** Faz 11 — Öğrenci Gelişim Rotası için ürün source-of-truth
**Karar tarihi:** 25 Ağustos 2026  
**Ürün sahibi:** Yaşar Güler  
**Ana hedef:** Öğrenciyi TYT Matematikte başlangıç seviyesinden kalıcı ve ölçülebilir gelişime taşıyan adaptif dijital öğretmen

Bu belge, Kişisel Öğretmen 2.0 için bağlayıcı ürün ve çalışma planıdır.
Yeni sohbetlerde veya geliştirme oturumlarında plan yeniden tasarlanmadan önce bu
belge okunmalıdır.

Canlı kod ve deployment durumu ayrıca doğrulanır; ancak ürün hedefi, öğretmen
davranışı ve kabul kriterleri bakımından bu belge source-of-truth'tur.

---

## 1. Master Plan içindeki yeri

YKS Uzman Hoca'nın nihai ürünü soru havuzu değil, öğrencisini tanıyan adaptif
öğretmendir.

Faz 8 ile TYT Matematik Teacher Pool güvenilirliği tamamlanmıştır:

- 1523 manuel MEB kaydı
- 1521 student-ready soru
- 2 kontrollü manual-review kaydı
- öğrenciye açık eski/ÖSYM kayıt: 0

Sıradaki ana faz:

**Faz 9 — Kişisel Öğretmen 2.0 Limited Pilot**

Faz 9 zorunlu bileşenleri:

1. Adaptif öğrenci analizi
2. Öğretmen karar motoru
3. Gerçek MEB sorusu seçimi
4. Öğretme–ölçme–düzeltme döngüsü
5. Yanlış Hafızası
6. Öğrenme Hafızası ve aralıklı tekrar
7. Emek Puanı ve Öğretmen Takdiri
8. Teacher Pool Kaynak Sağlığı
9. Açıklanabilir karar geçmişi
10. Sanal öğrenci senaryoları ve Limited Pilot kabulü

---

## 2. Ana ürün vaadi

Kişisel Öğretmen yalnız soru önermez.

Öğretmen:

- öğrencinin başlangıç seviyesini belirler,
- hangi konu ve alt beceride zorlandığını bulur,
- uygun zorlukta gerçek MEB sorusu seçer,
- yanlışın nedenini anlamaya çalışır,
- eksik noktayı kısa ve anlaşılır biçimde öğretir,
- yanlışı yeniden çözdürür,
- öğrenilen konuyu doğru zamanda tekrar hatırlatır,
- çabayı puan ve kanıta dayalı takdirle ödüllendirir,
- her sonuçtan sonra bir sonraki kararını değiştirir,
- kaynak azaldığında bunu öğrenci başarısızlığı gibi yorumlamaz ve ürün sahibini uyarır.

Ana döngü:

`StudyEvent → Learning Model → Teacher Decision → Teacher Pool → Öğrenci Sonucu → Reward/Outcome → Yeni Karar`

---

## 3. Öğrenciyi sıfırdan geliştirme modeli

Her konu ayrı değerlendirilir. Öğrenci Problemler konusunda ileri seviyedeyken
Üçgenler konusunda başlangıç seviyesinde olabilir.

### Seviye 1 — Başlangıç

- Konu verisi yoktur veya temel eksiktir.
- Öğretmen kesin yargı üretmez.
- Önce kısa seviye ölçümü yapar.
- Gerekirse temel anlatım ve kolay sorular verir.

### Seviye 2 — Temel öğrenme

- Öğrenci kolay soruları yeni çözmeye başlamıştır.
- Öğretmen temel kuralı ve soru çözme adımlarını pekiştirir.
- Aynı kazanımı farklı açıdan ölçen kolay sorular seçer.

### Seviye 3 — Pekiştirme

- Temel oluşmuştur fakat hata devam etmektedir.
- Orta seviye sorular ve hata odaklı kısa tekrar kullanılır.
- Tekrarlayan yanlış türleri izlenir.

### Seviye 4 — Güçlendirme

- Öğrenci çoğu soruyu doğru çözmektedir.
- Zor, seçici ve çeldiricili sorulara geçilir.
- Hız, akıcılık ve yöntem seçimi izlenir.

### Seviye 5 — Kalıcılık

- Konu güçlüdür.
- Gereksiz uzun ödev verilmez.
- 3/7/14/30 günlük uyarlanabilir kontroller yapılır.
- Denemede hata görülürse konu yeniden onarım moduna alınır.

Tek bir başarılı test kalıcı öğrenme kabul edilmez. Seviye yükselmesi farklı
zamanlarda tutarlı kanıt gerektirir.

---

## 4. Öğretmen çalışma modları

Karar motoru en az şu modları desteklemelidir:

| Mod | Ne zaman kullanılır? | Öğretmen davranışı |
| --- | --- | --- |
| Diagnostic | Veri yok veya yetersiz | Önce seviyeyi ölç |
| Foundation | Temel bilgi eksik | Kısa öğretim + kolay soru |
| Repair | Başarı düşük veya hata tekrarlı | Hata odaklı onarım |
| Reinforce | Başarı orta | Orta seviye pekiştirme |
| Challenge | Başarı güçlü | Zor soru ve çeldirici |
| Spaced review | Bilgi güçlü ama eskime riski var | 3 soruluk kısa kontrol |
| Maintain | Bilgi güncel ve güçlü | Yeni yük ekleme veya çok kısa kontrol |
| Complete | Günlük hedef ve pedagojik ihtiyaç tamam | Yeni görev verme |

Öğretmen sabit 3/5/10 soruluk test vermek zorunda değildir. Pilot sırasında
kontrollü setler kullanılabilir; nihai davranışta her cevap sonrası bir sonraki
en değerli soru yeniden seçilebilmelidir.

---

## 5. Yanlış Hafızası

Her yanlış kalıcı fakat yönetilebilir bir öğrenme kaydıdır.

Yanlış yaşam döngüsü:

`Yeni yanlış → İnceleniyor → Yeniden çalışılıyor → Kontrol altında → Kapatıldı`

Aynı kazanımda yeniden hata görülürse kayıt yeniden açılabilir.

### Yanlış türleri

- Konu bilgisi eksik
- Soruyu yanlış anlama
- Denklem/model kuramama
- İşlem hatası
- Dikkat hatası
- Formül karıştırma
- Çeldiriciye düşme
- Süre problemi
- Yapamadım
- Tahminle doğru
- Nedeni henüz bilinmiyor

### Yanlış kapatma şartı

Çözümü yalnız açmak yanlışı kapatmaz.

Kapatma için:

1. Açıklama incelenir.
2. Hata nedeni kaydedilir veya öğretmen tarafından çıkarılır.
3. Benzer soru çözülür.
4. İlk yanlış soru yeniden çözülür.
5. Doğru sonuç alınır.
6. Gerekli durumda daha sonraki kalıcılık kontrolü de geçilir.

Yanlış kapatma ve yeniden açma kararları StudyEvent geçmişinde denetlenebilir
olmalıdır.

---

## 6. Öğrenme Hafızası ve aralıklı tekrar

Bir konunun bugün bilinmesi sonsuza kadar bilindiği anlamına gelmez.

Başlangıç tekrar aralıkları:

| Durum | Sonraki kontrol |
| --- | --- |
| Yeni öğrenildi | 1–3 gün |
| Yanlış düzeltilmiş | 1–2 gün |
| Kısmen öğrenildi | 3–5 gün |
| Orta düzeyde sağlam | 7 gün |
| İyi öğrenildi | 14 gün |
| Çok sağlam | 30 gün |
| Denemede yeniden hata | Sonraki uygun çalışma günü |

Aralıklar sabit değildir. Başarılı kontroller aralığı uzatır; zorlanma, uzun
çözüm süresi veya yanlış aralığı kısaltır.

Öğrenilmiş konu için uzun ders verilmez. Öğretmen önce kısa kontrol yapar:

- 3/3 rahat doğru: tekrar aralığını uzat
- 2/3 doğru: kısa pekiştirme
- 1/3 veya daha düşük: onarım moduna dön
- doğru fakat çok yavaş: akıcılık çalışması
- aynı alt beceride tekrar yanlış: ilgili yanlışı yeniden aç

Konu tek yüzdeden ibaret değildir. Uygun metadata bulunduğunda subtopic,
kazanım, soru tipi ve ölçülen beceri ayrı izlenmelidir.

---

## 7. Günlük görev önceliği

Öğretmen görevleri şu pedagojik sırayla değerlendirir:

1. Süresi gelen kritik yanlış
2. Denemede yeniden ortaya çıkan eksik
3. Unutma riski yükselen öğrenilmiş konu
4. Günün ana yeni/onarım konusu
5. Günlük hedefe göre pekiştirme

Hepsi aynı gün öğrenciye yığılmaz. Profildeki günlük soru hedefi, son çalışma
yükü ve öğrencinin mevcut durumu dikkate alınır.

Örnek 10 soruluk gün:

- 2 soru: eski yanlışları kapatma
- 3 soru: süresi gelen kalıcılık kontrolü
- 5 soru: günün ana konusu

---

## 8. Emek Puanı ve Öğretmen Takdiri

Ödül yalnız doğru cevaba bağlanmaz. Çaba, dürüst geri bildirim, yanlış düzeltme,
düzenlilik ve kalıcılık ödüllendirilir.

### Başlangıç puan tablosu

| Davranış | Emek Puanı |
| --- | ---: |
| Soruyu gerçekten deneme | +2 |
| Doğru cevap | +3 |
| Orta seviye doğru | ilave +1 |
| Zor seviye doğru | ilave +2 |
| Dürüst `Yapamadım` geri bildirimi | +1 |
| Yanlış çözümünü inceleme | +2 |
| Hata nedenini belirleme | +1 |
| Benzer soruyu doğru çözme | +3 |
| Eski yanlışı doğruya çevirme | +5 |
| Öğretmen görevini tamamlama | +10 |
| Günlük soru hedefini tamamlama | +15 |
| Üç günlük düzenli çalışma | +20 |
| Ölçülebilir konu gelişimi | +25 |
| 30 günlük kalıcılık kontrolünü geçme | +10 |

Puan kuralları pilot verisiyle kalibre edilebilir; temel felsefe değiştirilemez.

### Takdir ilkeleri

- Takdir gerçek kanıta dayanır.
- Sahte veya sürekli aynı övgü kullanılmaz.
- Yalnız başarı değil, doğru öğrenme davranışı da takdir edilir.
- Yanlış cevapta puan düşürülmez.
- Çalışmaya ara verildiğinde kazanılmış puan silinmez.
- Aynı davranış sayfa yenileme veya çift tıklamayla iki kez ödüllendirilmez.
- Uygulamada kalma süresi tek başına ödül değildir.
- Kolay soru seçerek puan toplama teşvik edilmez.

### Başlangıç unvanları

| Toplam puan | Unvan |
| ---: | --- |
| 0–99 | Başlangıç |
| 100–249 | Düzenli Öğrenci |
| 250–499 | Kararlı Öğrenci |
| 500–899 | Güçlü Takipçi |
| 900–1499 | Konu Ustası |
| 1500+ | YKS Savaşçısı |

Reward Engine, ödülleri deterministik kimliklerle StudyEvent sistemine
yazmalıdır. Önerilen olaylar:

- `reward-earned`
- `teacher-praise`
- `daily-goal-completed`
- `wrong-recovered`
- `topic-improved`

---

## 9. Teacher Pool kapsamı ve kaynak sağlığı

Mevcut TYT Matematik havuzu Kişisel Öğretmen'i başlatmak ve matematikte
öğrenciyi elde tutmak için yeterlidir; ancak her konuda aynı derinlikte değildir.

### Limited Pilot konuları

| Konu | Student-ready | Kolay | Orta | Zor |
| --- | ---: | ---: | ---: | ---: |
| Problemler | 162 | 57 | 67 | 38 |
| Üçgenler | 73 | 23 | 24 | 26 |
| Çokgen ve Dörtgenlerin Özellikleri | 26 | 9 | 9 | 8 |
| **Toplam** | **261** | **89** | **100** | **72** |

Pilot başarılı olmadan diğer derslere geçilmez. İlk ürün hedefi öğrencinin
matematikte uygulamayı sevmesi ve gerçek gelişim göstermesidir.

### Kaynak Sağlığı seviyeleri

Kalan çözülmemiş soru sayısı konu ve zorluk bazında izlenir:

| Durum | Kalan soru | Davranış |
| --- | ---: | --- |
| Yeşil | 15+ | Normal kullanım |
| Sarı | 8–14 | Erken kaynak uyarısı |
| Turuncu | 3–7 | Yeni kaynak yüksek öncelik |
| Kırmızı | 0–2 | Yeni ölçüm seti açma; açık uyarı ver |

Öğretmen kaynak azaldığında:

- doğrulanmamış soru üretmez,
- başka konuyu aynı konu gibi göstermez,
- kolay soruyu orta/zor diye sunmaz,
- çözülmüş soruyu yeni soru gibi göstermez,
- kaynak eksikliğini öğrenci başarısızlığı olarak yorumlamaz,
- uygun eski yanlışları veya aralıklı tekrar sorularını açıkça tekrar olarak kullanabilir,
- ürün sahibine hangi konu/seviyede yeni kaynak gerektiğini bildirir.

Kaynak uyarısı bitişte değil, bitişten önce oluşturulur.

---

## 10. Açıklanabilir öğretmen kararı

Her karar denetlenebilir bir karar fişi üretmelidir:

- kullanılan öğrenci verileri
- seçilen konu ve alt beceri
- mevcut seviye ve veri güveni
- seçilen çalışma modu
- soru sayısı ve zorluk dağılımı
- seçilen katalog soru kimlikleri
- karar gerekçesi
- beklenen sonuç
- gerçekleşen sonuç
- kazanılan puan ve takdir gerekçesi
- sonraki kontrol tarihi
- bir sonraki kararın nasıl değiştiği

Önerilen kayıtlar:

- `teacher-decision`
- `teacher-session-started`
- `teacher-session-outcome`
- `teacher-review-scheduled`
- `teacher-pool-warning`

Öğrenciye kısa ve anlaşılır açıklama gösterilir. Ayrıntılı karar geçmişi QA ve
ürün sahibi denetimi için saklanır.

---

## 11. Güven ve doğrulama sistemi

Kişisel Öğretmen yalnız manuel göz kontrolüne dayanamaz. Dört kanıt katmanı
zorunludur.

### A. Deterministik kural testleri

En az şu davranışlar test edilmelidir:

- yeni öğrenciye önce ölçüm verilmesi
- veri azken kesin yargı üretilmemesi
- düşük başarıda temel/onarım moduna geçilmesi
- güçlü başarıda zorluk artışı
- yüksek fakat eski başarıda aralıklı tekrar
- çözülen sorunun yeni soru gibi seçilmemesi
- yanlışın yalnız görüntülenerek kapanmaması
- aynı kazanımdaki yeni hatanın yanlışı yeniden açması
- aynı ödülün iki kez verilmemesi
- kaynak yokken AI soru üretilmemesi
- kaynak eksikliğinin öğrenci eksikliği sayılmaması
- kararın gerekçesiyle sonucunun kaydedilmesi

### B. Sanal öğrenci simülasyonları

En az şu profiller günler/haftalar boyunca simüle edilmelidir:

- hiç verisi olmayan öğrenci
- sürekli yanlış yapan öğrenci
- aynı hatayı tekrarlayan öğrenci
- orta seviyedeki öğrenci
- başarılı öğrenci
- unutmaya başlayan öğrenci
- çok çalışıp ilerlemeyen öğrenci
- kolay sorularla puan toplamaya çalışan öğrenci
- çalışmaya ara verip dönen öğrenci
- kısa görevlerden yararlanan öğrenci

Kararlar 1., 3., 7., 14. ve 30. günlerde doğrulanmalıdır.

### C. Karar geçmişi audit'i

Her kararda `ne biliyordu → ne seçti → öğrenci ne yaptı → karar nasıl değişti`
zinciri yeniden üretilebilmelidir.

### D. Gerçek kullanıcı Limited Pilot

Preview üzerinde tablet/telefon gerçek kullanıcı kabulü zorunludur. Otomatik
test ve tarayıcı smoke tek başına yeterli değildir.

---

## 12. Limited Pilot başarı kriterleri

Pilot başarılı sayılabilmek için öğretmen:

1. Öğrenciyi başlangıç seviyesinden tanıyabilmeli.
2. Sonuca göre bir sonraki görevi değiştirmeli.
3. Yanlış nedenini ve yanlış yaşam döngüsünü izlemeli.
4. Yanlışı yeniden çözdürmeden kapatmamalı.
5. Bilinen konuyu uygun zamanda hatırlatmalı.
6. Gereksiz tekrar yükü oluşturmamalı.
7. Zorluk seviyesini kademeli yükseltmeli.
8. Puan ve takdiri gerçek davranışa vermeli.
9. Kararının nedenini açıklamalı.
10. Kaynak azalışını önceden bildirmeli.
11. Kaynak eksikliğini öğrenci başarısızlığı saymamalı.
12. Veriyi günler ve cihazlar arasında kaybetmemeli.
13. Sanal öğrenci senaryolarını geçmeli.
14. Gerçek öğrenci akışında anlamlı ve farklı kararlar üretmeli.

Pilotun ana değerlendirme sorusu:

> Kişisel Öğretmen, öğrencinin performansına göre gerçekten farklı ve anlamlı
> kararlar üretiyor ve öğrenciyi bir üst seviyeye taşıyabiliyor mu?

---

## 13. Uygulama sırası

İlk turda büyük refactor yapılmaz. Güvenli uygulama sırası:

1. Mevcut yükleme bağımlılığını düzelt; Strategy Engine öğretmen için garanti olsun.
2. Pilot canonical topic allowlist'ini ve Teacher Pool uygunluk kapısını kur.
3. `teacher-decision` ve `teacher-session-outcome` sözleşmelerini ekle.
4. Zorluk seçimi ve adaptif mod kararını bağla.
5. Yanlış Hafızası entegrasyonunu tamamla.
6. Öğrenme Hafızası ve tekrar zamanlayıcısını ekle.
7. Reward Engine, Emek Puanı ve kanıta dayalı takdiri ekle.
8. Kaynak Sağlığı monitörü ve ürün sahibi uyarılarını ekle.
9. Açıklanabilir karar ekranını ekle.
10. Deterministik test ve sanal öğrenci simülasyonlarını çalıştır.
11. Preview gerçek kullanıcı kabulü yap.
12. Kullanıcı onayından sonra Ready for Review, merge ve production smoke yap.

---

## 14. Model ve maliyet stratejisi

Varsayılan model Luna'dır.

Luna:

- repo audit
- mekanik uygulama
- veri sözleşmesi implementasyonu
- UI entegrasyonu
- test ve simülasyon altyapısı
- regresyon

SOL yalnız kritik ürün/mimari kararlarında kullanılmalıdır:

- adaptif eşikler
- zorluk geçiş kuralları
- karar/outcome sözleşmesi
- anlamlı adaptasyon kabul kriterleri

Terra gerektiğinde karmaşık debugging veya orta ölçekli çok dosyalı refactor için
ara seçenek olabilir.

---

## 15. Değişiklik ve onay kuralları

- Bu plan kullanıcı onayı olmadan başka roadmap ile değiştirilmez.
- Soru havuzu ana ürün gibi ele alınmaz; adaptif öğretmen döngüsünün aracıdır.
- Pilot başarılı olmadan bütün YKS sistemine yayılmaz.
- Büyük refactor, merge ve production için kullanıcı onayı korunur.
- Öğrenci-facing değişikliklerde Preview göz kontrolü atlanmaz.
- Veri kaybı, sahte öğrenci verisi ve açıklanamayan karar kabul edilmez.
- AI doğrulanmamış yeni resmî soru üretmez.

---

## 16. Yeni sohbet başlangıç talimatı

Yeni sohbet veya geliştirme oturumunda:

1. `PROJECT_HANDOFF.md` okunur.
2. Bu dosya eksiksiz okunur.
3. GitHub `main` ve production canlı olarak doğrulanır.
4. Master Plan Faz 9 dışına çıkılmaz.
5. İlk tamamlanmamış uygulama adımı repo üzerinden belirlenir.
6. Kod değişikliğinden önce mevcut veri akışı ve testler incelenir.
7. Sonuç, karar kanıtları ve kalan risklerle raporlanır.

Bu belgenin amacı yeni sohbette “şimdi ne yapacağız?” sorusunu yeniden
cevaplamak değil, doğrulanmış plandan doğrudan devam etmektir.

---

## 17. Faz 9 uygulama durumu — 25 Ağustos 2026

| Uygulama adımı | Durum | Kanıt |
| --- | --- | --- |
| Strategy Engine yükleme güvencesi | Tamamlandı | Öğretmen açılış ve loader testleri |
| Canonical pilot allowlist / Teacher Pool kapısı | Tamamlandı | 3 pilot konu, doğrulanmış kaynak politikası |
| Karar ve sonuç sözleşmeleri | Tamamlandı | `teacher-decision`, `teacher-session-outcome` |
| Adaptif mod ve zorluk seçimi | Tamamlandı | Kontrollü dağılım, sessiz kolay fallback yok |
| Yanlış Hafızası | Tamamlandı | Dört kanıtlı kapanış ve yeni yanlışla yeniden açılma |
| Öğrenme Hafızası / tekrar | Tamamlandı | 1–3–7–14–30 günlük uyarlanabilir geçişler |
| Emek Puanı / takdir | Tamamlandı | İdempotent ödül kayıtları ve kanıta dayalı övgü |
| Teacher Pool kaynak sağlığı | Tamamlandı | Yeşil/sarı/turuncu/kırmızı erken uyarı |
| Açıklanabilir karar geçmişi | Tamamlandı | Karar → seçim → sonuç → sonraki karar audit zinciri |
| Deterministik / sanal öğrenci testleri | Tamamlandı | 10 profil, 1/3/7/14/30. günler, 57/57 test |
| Preview gerçek kullanıcı kabulü | Tamamlandı | Telefon/tablet ürün sahibi kabulü geçti |
| Ready for Review / merge / production | Tamamlandı | PR #31, production merge `c92e64e` ve canlı smoke |

Uzun dönem simülasyonları iki sınır düzeltmesi doğurmuştur:

- öğretmen oturumundan sonra aynı konuda oluşan yeni açık yanlış, konu hafızasını
  yeniden Onarım moduna alır;
- ilk başarılı 3 soruluk kalıcılık kontrolü 14 güne çıkar; ancak önceki 14 günlük
  kontrol de başarıyla geçildikten sonra 30 güne uzar ve kalıcılık ödülü kazanılır.

### 17.1 Öğrenci ekranı sadeleştirme kararı

Kişisel Öğretmen öğrenci ekranında soyut “Hızlı Tekrar” veya AI anlatım kutusu
kullanılmaz. Görünür günlük akış yalnız gerçek Teacher Pool soruları ve bu sorulara
bağlı gerçek yanlış kapanışından oluşur. Öğretmen karar/audit zinciri ve kaynak
sağlığı arka planda çalışmaya devam eder; sağlıklı kaynak ve teknik audit verisi
öğrenci ekranını işgal etmez. Kaynak kutusu yalnız eşik altına düşüldüğünde uyarı
olarak görünür. Boş performans kutusu gösterilmez; gerçek performans oluştuğunda
isteğe bağlı açılır.

---

## 18. Faz 10 — Sürekli adaptif özel ders

Faz 9'daki sabit 3/5 soruluk kontrollü setler pilot doğrulama aracıydı. Ürün
davranışı artık tek soru üzerinden ilerleyen sürekli adaptif oturuma taşınır:

1. Öğretmen aynı konudan yalnız bir doğrulanmış kaynak sorusu seçer.
2. Öğrenci cevap verdikten sonra sonuç, yanlış hafızası, Emek Puanı ve takdir
   kaydı tamamlanır.
3. Karar motoru her cevaptan sonra zorluk, hata ve günlük yük kanıtlarını yeniden
   değerlendirir.
4. Öğrenciye `Sonraki Soruyu Getir` ve `Bugünlük Bu Kadar` seçenekleri sunulur.
5. Yeterli kanıt oluştuğunda öğretmen oturumu bitirmeyi samimi bir dille önerir;
   öğrenci isterse devam edebilir.
6. Bitişte tek bir `teacher-session-outcome`, konu hafızası ve sonraki kontrol
   tarihi yazılır.

### 18.1 İlk uygulama paketi — 25 Ağustos 2026

| Uygulama adımı | Durum | Kanıt |
| --- | --- | --- |
| Cevap başına yeniden karar sözleşmesi | Tamamlandı | `decideAdaptiveStep` deterministik testleri |
| Kademeli zorluk geçişi | Tamamlandı | İki tutarlı doğru olmadan artış yok; seviye atlama yok |
| Kaynak sınırı | Tamamlandı | İstenen zorluk yoksa sessiz kolay soru doldurma yok |
| Tek-soru öğretmen oturumu | Tamamlandı | `state.teacher.adaptiveSession` |
| Öğrenci devam / bitir kontrolleri | Tamamlandı | Soru sonuç ekranı eylemleri |
| Oturum sonucu ve konu hafızası | Tamamlandı | Outcome, ödül, tekrar tarihi ve `topicMemory` |
| Otomatik regresyon | Tamamlandı | 70/70 test |
| Preview gerçek kullanıcı kabulü | Tamamlandı | Telefon/tablet ürün sahibi kabulü geçti |
| Merge / production | Tamamlandı | PR #33, production merge `9ce658d` ve canlı HTTP 200 |

---

## 19. Faz 11 — Öğrenci Gelişim Rotası ve Konu Geçişi

Faz 10 öğretmenin tek bir oturum içinde her cevaptan sonra karar vermesini
sağladı. Faz 11 bu kararları günler ve konular arasında tutarlı bir öğrenci
yolculuğuna dönüştürür.

Her pilot konu için beş gelişim seviyesi izlenir:

| Seviye | Durum | Geçiş anlamı |
| ---: | --- | --- |
| 1 | Başlangıç | Yeterli ölçüm yok; önce öğrenci tanınır |
| 2 | Temel oluşturuyor | Düşük başarı veya açık yanlış vardır |
| 3 | Gelişiyor | Kanıt olumlu fakat henüz farklı günlerde tutarlı değildir |
| 4 | Güçlü | Sıradaki konu açılabilir; eski konu planlı kontrollerle korunur |
| 5 | Kalıcı | 30 günlük kalıcılık kanıtı alınmıştır |

### 19.1 Konu geçiş kapısı

Öğretmen sıradaki konuyu yalnız aşağıdaki kanıtların tamamında açar:

1. Konuda en az 5 ölçülmüş gerçek kaynak sorusu vardır.
2. Güncel başarı en az `%80` seviyesindedir.
3. En az 2 başarılı öğretmen oturumu tamamlanmıştır.
4. Güçlü kanıtlar en az 2 farklı çalışma gününde oluşmuştur.
5. Açık yanlış borcu kalmamıştır.

Tek bir kusursuz set konu geçişi için yeterli değildir. Seviye 4'e ulaşan konu
terk edilmez; Öğrenme Hafızasındaki tarihte kısa kontrol için yeniden açılır.
Seviye 5 için 30 günlük kalıcılık kanıtı gerekir.

### 19.2 İlk uygulama paketi — 25 Ağustos 2026

| Uygulama adımı | Durum | Kanıt |
| --- | --- | --- |
| Konu gelişim seviyesi sözleşmesi | Tamamlandı | `assessTopicProgress` |
| Deterministik konu geçiş kararı | Tamamlandı | `decideTopicRoute` |
| Tek başarılı oturumla erken geçişi engelleme | Tamamlandı | Ayrı gün/oturum testleri |
| Yanlış ve süresi gelen tekrar önceliği | Tamamlandı | Route öncelik testleri |
| Öğrenme modelinden kanıt toplama | Tamamlandı | `buildTopicProgressEvidence`, gerçek event geçmişi |
| Öğrenci konu geçiş kapısı | Tamamlandı | Tamamlanma eylemi `decideTopicRoute` sonucuna bağlı |
| Öğrenci gelişim rotası arayüzü | Bekliyor | Preview tasarım kabulü |
| Merge / production | Bekliyor | Kullanıcı onayı sonrası |
