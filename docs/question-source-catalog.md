# YKS Soru Kaynak Kataloğu

Bu katalog, soru kaynağını öğretmen zekâsından ayırır.

## Temel ilke

- ÖSYM/MEB/OGM: soru metnini repoya kopyalamak yerine metadata + resmî kaynak adresi saklanır.
- Kullanıcının ileride sağlayacağı PDF yayınlar: aynı katalog şemasına `uploaded-pdf` erişim tipiyle eklenir.
- **AI hiçbir öğrenci sorusu üretmez.** `/api/similar` ve `/api/mini-test` bilinçli olarak kapatılmıştır (410 Gone); yalnız indekslenmiş kaynak kütüphanesinden soru gelir.
- AI'nin görevi kaynak soruyu üretmekten çok; kazanım eşleme, ipucu, çözüm, hata analizi ve çalışma stratejisidir.

## Kayıt şeması

Bkz. `docs/question-taxonomy.md` (konu/topic sözlüğü) ve `data/catalog/**` dosyaları (gerçek şema).

## Güncel Kapsam (Coverage)

*Son güncelleme: 19 Ağustos 2026 — kaynak: `scripts/validate-catalog.mjs` çıktısı, 325 kayıt üzerinden gerçek runtime taraması.*

### 2026 TYT — crop manuel doğrulanmış (hardcoded source-map)

| Ders | Soru | answerKey | Crop hazır |
|------|------|-----------|------------|
| Biyoloji | 6 | 6/6 | 6/6 |
| Coğrafya | 5 | 5/5 | 5/5 |
| Din Kültürü ve Ahlak Bilgisi | 5 | 5/5 | 5/5 |
| Felsefe | 10 | 10/10 | 10/10 |
| Fizik | 7 | 7/7 | 7/7 |
| Kimya | 7 | 7/7 | 7/7 |
| Matematik | 40 | 40/40 | 40/40 |
| Tarih | 5 | 5/5 | 5/5 |
| Türkçe | 40 | 40/40 | 40/40 |

### 2026 AYT — answerKey doğrulandı (2 soru resmen iptal), crop: auto-crop mevcut / visual QA pending

| Ders | Soru | answerKey | Crop durumu |
|------|------|-----------|--------------|
| Biyoloji | 13 | 13/13 | auto-crop mevcut / visual QA pending |
| Coğrafya-1 | 6 | 6/6 | auto-crop mevcut / visual QA pending |
| Coğrafya-2 | 11 | 11/11 | auto-crop mevcut / visual QA pending |
| Din Kültürü ve Ahlak Bilgisi | 6 | 6/6 | auto-crop mevcut / visual QA pending |
| Felsefe Grubu | 12 | 12/12 | auto-crop mevcut / visual QA pending |
| Fizik | 14 | 14/14 | auto-crop mevcut / visual QA pending |
| Kimya | 13 | 13/13 | auto-crop mevcut / visual QA pending |
| Matematik | 40 | 39/40 + 1 iptal (mat-23) | auto-crop mevcut / visual QA pending |
| Tarih-1 | 10 | 10/10 | auto-crop mevcut / visual QA pending |
| Tarih-2 | 11 | 11/11 | auto-crop mevcut / visual QA pending |
| Türk Dili ve Edebiyatı | 24 | 23/24 + 1 iptal (tde1-20) | auto-crop mevcut / visual QA pending |

**AYT 2026 toplam: 160 soru = 158 geçerli answerKey + 2 resmen iptal (mat-23, tde1-20).**

> **Not — Crop QA durumu (kritik):** AYT crop'ları `app-source-map-2026-ayt.js` içindeki runtime
> PDF.js tarayıcısı ile **otomatik** üretiliyor (auto-crop). Bu, uygulama tarafında `asset.status:'ready'`
> olarak görünür, **ANCAK bu görsel olarak doğrulanmış/verified anlamına gelmez.**
> Golden Rule (madde 89) gereği: hiçbir AYT crop'u gözle QA'dan geçmeden "doğrulanmış",
> "verified" veya "fully ready" olarak nitelendirilemez ve bu dokümanda öyle nitelendirilmemiştir.
> **Doğru statü tanımı: "auto-crop mevcut / visual QA pending."**
>
> PDF'e görsel erişim şu an ortam kısıtı nedeniyle mümkün değil (bkz. aşağıdaki teknik not).
> Bu bir veri hatası değil, bir **araç/ortam kısıtıdır**. Kullanıcı PDF'i dosya olarak
> sağladığında 2026 AYT'ye geri dönülüp gerçek görsel QA yapılacaktır.
>
> **Teknik not (19 Ağustos 2026):** `bash_tool` ortamının network proxy'si yalnız belirli
> domainlere (GitHub, npm, pypi vb.) izin veriyor; `dokuman.osym.gov.tr` ve `cdn.osym.gov.tr`
> bu listede değil. `curl`, `wget` ve Python `urllib` ile denenmiş, üçü de aynı
> `x-deny-reason: host_not_allowed` hatasıyla reddedilmiştir. `web_fetch` aracı yalnız metin
> döndürüyor (görsel/byte erişimi yok). Bu nedenle crop QA şimdilik **pending**.

### AYT answerKey bağımsız doğrulama (19 Ağustos 2026, güncellendi 19 Ağustos 2026)

Resmî ÖSYM AYT 2026 kitapçığının tam metni (cdn.osym.gov.tr) + resmî cevap anahtarı ile
katalogdaki tüm 160 AYT sorusu tek tek karşılaştırıldı (madde 21-22 gereği).

**Nihai durum — 2 soru iptal:**

- **`osym-2026-ayt-tde1-20`** → `cancelled:true`. ÖSYM'nin 1 Temmuz 2026 "Değerlendirme
  İşlemlerine İlişkin Açıklama"sı ile resmen iptal edildi (itiraz süreci sonucu).
- **`osym-2026-ayt-mat-23`** → `cancelled:true`. Bu sorunun geçmişi iki aşamalıdır:
  1. **1 Temmuz 2026:** ÖSYM cevabı "C"den "A"ya resmen değiştirdi (ilk düzeltme).
  2. **21 Temmuz 2026:** ÖSYM'nin ayrı ve daha sonraki resmî "Değerlendirme İşlemlerine
     İlişkin Açıklama"sında bu sorunun **yargı kararı gereği tamamen iptal edildiği**
     bildirildi. Bu, sürecin **nihai resmî durumudur** — 1 Temmuz'daki cevap değişikliği
     artık geçerli değildir.
  
  ⚠️ Önceki sürüm bu dosyada yalnızca 1 Temmuz aşamasını yakalamış ve mat-23'ü "answerKey:'A'
  ile doğrulandı" olarak raporlamıştı — bu **hatalıydı**, düzeltildi. Kaynak: ÖSYM'nin 21 Temmuz
  2026 tarihli resmî açıklaması (birden fazla bağımsız haber kaynağında ÖSYM'nin duyuru metni
  birebir aktarılmış şekilde doğrulandı).

- **Diğer 158/160 soru** resmî cevap anahtarıyla doğrudan eşleşiyor, sorun yok.
- **Sonuç: AYT 2026'da 2 soru iptal (tde1-20, mat-23), 158 soru geçerli answerKey ile
  doğrulanmış durumda.**

Bu doğrulama yalnız **metin/cevap** seviyesindedir; crop'ların görsel QA'sı hâlâ **pending**
(bkz. aşağıdaki not — PDF görsel erişimi ortam kısıtı nedeniyle şu an mümkün değil).

### 2025 TYT — kaynak açıldı (19 Ağustos 2026)

Kaynak: ÖSYM resmî sayfası (osym.gov.tr/2025yks-tyt-ayt-ve-ydt-temel-soru-kitapciklari-ve-cevap-anahtarlari)
üzerinden alınan resmî PDF linki (`dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf`).
PDF'in tam metni `web_fetch` ile çekilip hem soru sınıflandırması hem resmî cevap anahtarı
doğrulaması için kullanıldı.

| Ders | Soru | answerKey | Crop durumu |
|------|------|-----------|--------------|
| Türkçe | 40 | 40/40 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Matematik (1-30) | 30 | 30/30 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Geometri (31-40) | 10 | 10/10 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Sosyal Bilimler (Tarih+Coğrafya+Felsefe+Din K., ana pool) | 20 | 20/20 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Sosyal Bilimler (Felsefe, `alternate-track`) | 5 | 5/5 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Fen Bilimleri (Fizik+Kimya+Biyoloji) | 20 | 20/20 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |

## 2025 TYT — TAMAMLANDI (20 Ağustos 2026)

**İki ayrı toplam — ikisi de doğru, farklı şeyi ölçüyor:**

| Ölçüm | Değer |
|---|---|
| **Standart öğrenci pool** (Mini Test havuzu, ilerleme sayacı) | **120/120** ✅ |
| **Kütüphanede kataloglanan gerçek ÖSYM sorusu** (booklet'teki tüm bağımsız içerik) | **125/125** ✅ |

Fark: 5 `alternate-track` Felsefe sorusu (osym-2025-tyt-fel-21..25) gerçek, bağımsız ÖSYM
içeriğidir ve kütüphanede tam saklanır (125'e dahil), ama standart öğrenci ilerleme sayacına
dahil edilmez (120'ye dahil değil) çünkü aynı öğrenci Din Kültürü (16-20) XOR alternatif
Felsefe (21-25)'den yalnızca birini cevaplar.

**needs-manual-review-text-extraction-loss işaretli kayıtlar (topic ataması düşük güvenilirlikte,
answerKey etkilenmedi):**

| ID | Ders | Konu (en yakın tahmin) | Sebep |
|---|---|---|---|
| `osym-2025-tyt-mat-03` | Matematik | Üslü Sayılar ve Oran | Matematik kitabı sayfası görseli/işlem detayları PDF metninde kayıp |
| `osym-2025-tyt-mat-05` | Matematik | Köklü Sayılar ve İşlem Önceliği | Sayı gösterimi ifadesi PDF metninde kayıp |
| `osym-2025-tyt-kim-10` | Kimya | Moleküller Arası Etkileşimler | Kaynama noktası/etkileşim türü tablosu PDF metninde kayıp |
| `osym-2025-tyt-kim-13` | Kimya | Donma Noktası Alçalması - Koligatif Özellikler | Donma noktası değerleri tablosu PDF metninde kayıp |

Bu 4 kayıt, PDF görsel erişimi mümkün olduğunda öncelikli gözden geçirme adayıdır.

> **`track` alanı — şema notu (yeni, 20 Ağustos 2026):** Bu batch'te ilk kez katalog satırına
> opsiyonel `track` ve `trackReason` alanları eklendi. Değer yoksa (undefined) satır normal/ana
> pool sayılır — bu, önceki tüm kayıtları etkilemez (geriye dönük uyumlu). `track:'alternate-
> track'` + `trackReason:'din-muafiyeti-felsefe'`: bu soru, aynı test slotunun idari/müfredat
> alternatifidir (Din Kültürü ve Ahlak Bilgisi dersinden muaf öğrenciler için). Gerçek, bağımsız
> bir ÖSYM sorusu olarak kütüphanede tam saklanır — silinmez, "içerik değildir" denmez — ama
> varsayılan öğrenci ilerleme sayacına ve varsayılan Mini Test havuzuna dahil edilmemesi
> gerekir. **Bu alanın uygulama/runtime tarafında (Mini Test seçim mantığı, ilerleme sayacı)
> nasıl tüketileceği bu kütüphane batch'inin kapsamı dışındadır** — ChatGPT tarafında
> geliştirilen uygulama kodu bu alanı okuyup filtrelemelidir; hiçbir `app-*.js` veya `api/*.js`
> dosyasına bu batch'te dokunulmamıştır.

> **PDF text-extraction kaybı notu (genel, Matematik + Kimya):** `web_fetch` ile çekilen PDF
> metninde bazı matematiksel ifadeler/tablo verileri/görsel örnekler kayboldu — muhtemelen
> görsel/özel karakter olarak render edilmiş içerik (Matematik soru 3, 5: işlem/gösterim
> detayları; Kimya soru 10, 13: kaynama/donma noktası veri tabloları). Bu 4 sorunun `topic`
> ataması en yakın makul tahmindir ama `verification.topic:'needs-manual-review-text-
> extraction-loss'` olarak işaretlenmiştir (tam liste yukarıda). **Soru metni veya answerKey
> hiçbirinde tahmin edilmemiştir** — yalnız topic sınıflandırması bu kayıp nedeniyle düşük
> güvenilirlikte. PDF görsel erişimi mümkün olduğunda bu 4 kayıt gözden geçirilmelidir.

> **2025 TYT toplam soru sayısı notu (güncellendi 20 Ağustos 2026):** Booklet'te basılı toplam
> 125 **gerçek, bağımsız ÖSYM sorusu** vardır (Türkçe 40 + Sosyal Bilimler 25 + Matematik 40 +
> Fen 20) — bu 125 sorunun hepsi kütüphanede kataloglanır ve saklanır, hiçbiri "içerik değil"
> sayılmaz.
>
> Ancak Sosyal Bilimler testinde 21-25 numaralı Felsefe soruları, 16-20 numaralı Din Kültürü
> ve Ahlak Bilgisi sorularının **idari/müfredat alternatifidir** — Din Kültürü dersini almak
> zorunda olan bir öğrenci 16-20'yi, muaf olan bir öğrenci 21-25'i cevaplar; aynı öğrenci
> ikisini birden cevaplamaz. Bu yüzden **standart öğrenci ilerleme sayacı** (Mini Test havuzu,
> "kaç soru kaldı" göstergeleri vb.) yalnızca ana/varsayılan 20 Sosyal Bilimler sorusunu sayar
> (Tarih 5 + Coğrafya 5 + Felsefe 5 + Din K. 5), toplamda **120**. 21-25 alternatif Felsefe
> soruları kütüphanede ayrıca saklanır, `track:'alternate-track'` ile makine-okunabilir şekilde
> işaretlenir ve varsayılan Mini Test havuzuna karışmaz (bkz. 2025 TYT Sosyal Bilimler bölümü
> altında ayrıntı). Bu, "121-125 benzersiz içerik değildir" demek değildir — tam tersine, her
> ikisi de gerçek ÖSYM soruları olarak korunur; yalnızca ana ilerleme sayacı 20/120 üzerinden
> ilerler.

> **Not:** 2025 TYT için henüz `app-source-map-2025-*.js` gibi bir crop/source-map dosyası
> oluşturulmadı — 2026 AYT'dekiyle aynı sebepten (PDF'e görsel/piksel erişim ortam kısıtı
> nedeniyle mümkün değil, bkz. yukarıdaki teknik not). Sorular şu an yalnız metadata + resmî
> answerKey ile kataloglanmış durumda; `page:null`, tahmini sayfa numarası yazılmadı.
> `access.pageRange` alanı yalnızca hangi testte olduğunu belirtir, kesin sayfa değildir.

## 2024 TYT — TAMAMLANDI (20 Ağustos 2026)

**Kaynak:** ÖSYM resmî sayfası
(`osym.gov.tr/2024yks-tyt-ayt-ve-ydt-temel-soru-kitapciklari-ve-cevap-anahtarlari`) →
resmî PDF (`dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf`,
sınav tarihi 08.06.2024). PDF'in tam metni `web_fetch` ile çekildi; hem soru sınıflandırması
hem resmî cevap anahtarı doğrulaması için kullanıldı. Kitapçık yapısı 2025 ile birebir aynı
(Sosyal Bilimler'de 20 ana + 5 alternatif Felsefe track'i dahil).

| Ders | Soru | answerKey | Crop durumu |
|------|------|-----------|--------------|
| Türkçe | 40 | 40/40 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Matematik (1-30) | 30 | 30/30 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Geometri (31-40) | 10 | 10/10 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Sosyal Bilimler (ana pool) | 20 | 20/20 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Sosyal Bilimler (Felsefe, `alternate-track`) | 5 | 5/5 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |
| Fen Bilimleri (Fizik+Kimya+Biyoloji) | 20 | 20/20 (resmî anahtarla satır satır doğrulandı) | auto-crop yok / visual QA pending |

**İki ayrı toplam — 2025 ile aynı yapı:**

| Ölçüm | Değer |
|---|---|
| **Standart öğrenci pool** | **120/120** ✅ |
| **Kütüphanede kataloglanan gerçek ÖSYM sorusu** | **125/125** ✅ |

> **Yeni taxonomy terimleri (2024 Türkçe batch'i):** `Cümle Türleri - Yüklemine Göre`,
> `Tamlama Türleri`, `Paragrafta Değinilen Bilgi` (mevcut `Paragrafta Değinilmeyen Yargı`nın
> pozitif karşılığı — "hangisine değinilmiştir" kalıbı, "değinilmemiştir" değil). 37/40 soru
> mevcut 2025/2026 terimleriyle eşleşti, zorlama yapılmadı.

> **Yeni taxonomy terimi (2024 Matematik+Geometri batch'i):** yalnızca `Formülle Problem Çözme`
> (VKİ/vücut kitle indeksi gibi verilen bir formülü uygulayarak çözme becerisi; mevcut terimlerde
> tam karşılığı yoktu). 39/40 soru mevcut terimlerle eşleşti.

> **2024 TYT Sosyal Bilimler (25 soru: 20 ana + 5 alternatif Felsefe):** metin bütünlüğü
> korunmuş, hiçbir soruda tablo/formül/sembol kaybı tespit edilmedi (0 `needs-manual-review`).
> Görsel: yalnızca `cog-07` (bitki dağılışı haritası), `cog-08` (nüfus piramidi), `cog-09`
> (şekilsel bölge haritası) — 3/25. Taxonomy: 9/25 mevcut terimle eşleşti, 16/25 için yeni terim
> gerekti (2024'ün tarihî olayları/filozofları — Attila-Roma ilişkileri, Yassıçemen Savaşı,
> Hegel, Oppenheimer, Locke, Spinoza, Dilthey, Anselmus vb. — 2025/2026 kapsamında hiç
> işlenmemiş konular; zorlama eşleştirme yapılmadı). `track:'alternate-track'` +
> `trackReason:'din-muafiyeti-felsefe'` şeması 2025 ile birebir aynı şekilde uygulandı
> (`osym-2024-tyt-fel-21..25`).

> **2024 TYT Fen Bilimleri (20 soru: Fizik+Kimya+Biyoloji):** Taxonomy: 13/20 mevcut terimle
> eşleşti (Özkütle, Net Kuvvet ve Sürtünme, Kaldırma Kuvveti ve Özkütle, Isı ve Sıcaklık, Işığın
> Kırılması, Çözeltiler ve Derişim, Atomun Yapısı, Moleküller Arası Etkileşimler, Sıvılar ve Buhar
> Basıncı, Kimyasal Hesaplamalar, Kalıtım - Soyağacı Analizi, Ekoloji), 7/20 için yeni terim
> gerekti (Elektrik Akımı ve Direnç, Yayda Dalga Hareketi, Asitlerin Genel Özellikleri, Hücre
> Çekirdeği, Biyomoleküller - Polimer Yapılar, Canlıların Sınıflandırılması, Eşeysiz Üreme).
> Görsel: `fiz-01, fiz-05, fiz-06, fiz-07, kim-12, biy-19, biy-20` — 7/20.

**needs-manual-review-text-extraction-loss işaretli kayıtlar (toplam 9, tüm 2024 TYT):**

| ID | Ders | Sebep |
|---|---|---|
| `osym-2024-tyt-mat-04` | Matematik | "b sayısı" tanımlayan not tamamen kayıp |
| `osym-2024-tyt-mat-09` | Matematik | Termometre birim sistemi + hedef değer kayıp |
| `osym-2024-tyt-mat-10` | Matematik | Küme tanımları tamamen kayıp |
| `osym-2024-tyt-mat-13` | Matematik | Tombala kartı verileri + hedef değer kayıp |
| `osym-2024-tyt-mat-34` | Matematik | "Şanslı üçgen" açı ölçüsü kayıp |
| `osym-2024-tyt-fiz-01` | Fizik | Ebru kütle-hacim grafiği değerleri tamamen kayıp |
| `osym-2024-tyt-fiz-05` | Fizik | İletken tel V-I grafiği değerleri tamamen kayıp |
| `osym-2024-tyt-kim-12` | Kimya | Gaz örnekleri çizelgesi tamamen kayıp |
| `osym-2024-tyt-biy-19` | Biyoloji | Hemofili soyağacı şeması tamamen kayıp |

Bu 9 kayıt, PDF görsel erişimi mümkün olduğunda öncelikli gözden geçirme adayıdır. (Karşılaştırma:
2025 Fen'de yalnız 2 kayıt flag'lenmişti — bu, yıllar arası PDF text-extraction kalite farkından
kaynaklanıyor, katalog kalite politikası değişmedi.)

> **Not:** 2024 TYT için de henüz `app-source-map-2024-*.js` gibi bir crop/source-map dosyası
> oluşturulmadı — aynı ortam kısıtı nedeniyle (bkz. yukarıdaki teknik not). `page:null`, tahmini
> sayfa numarası yazılmadı.

## Yeni PDF yayın ekleme

İleride yüklenen bir soru bankası için PDF bir kez indekslenir. Her soru için ders, konu, kazanım, zorluk, görsel durumu, sayfa ve mümkünse soru kutusunun koordinatları çıkarılır. PDF tekrar işlenmeden katalog üzerinden aranabilir.

`YKSQuestionCatalogV1.register(items)` çalışma zamanında yeni kaynak kayıtlarını aynı havuza ekleyebilir.

## Doğrulama

Her batch sonrası `node scripts/validate-catalog.mjs` çalıştırılmalı ve PASS almalıdır.
