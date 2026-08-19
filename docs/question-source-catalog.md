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

*Son güncelleme: 19 Ağustos 2026 — kaynak: `scripts/validate-catalog.mjs` çıktısı, 285 kayıt üzerinden gerçek runtime taraması.*

### TYT — crop manuel doğrulanmış (hardcoded source-map)

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

### AYT — answerKey doğrulanmış, crop runtime auto-crop ile üretiliyor (henüz manuel QA yapılmadı)

| Ders | Soru | answerKey | Crop durumu |
|------|------|-----------|--------------|
| Biyoloji | 13 | 13/13 | auto-crop (QA bekliyor) |
| Coğrafya-1 | 6 | 6/6 | auto-crop (QA bekliyor) |
| Coğrafya-2 | 11 | 11/11 | auto-crop (QA bekliyor) |
| Din Kültürü ve Ahlak Bilgisi | 6 | 6/6 | auto-crop (QA bekliyor) |
| Felsefe Grubu | 12 | 12/12 | auto-crop (QA bekliyor) |
| Fizik | 14 | 14/14 | auto-crop (QA bekliyor) |
| Kimya | 13 | 13/13 | auto-crop (QA bekliyor) |
| Matematik | 40 | 40/40 | auto-crop (QA bekliyor) |
| Tarih-1 | 10 | 10/10 | auto-crop (QA bekliyor) |
| Tarih-2 | 11 | 11/11 | auto-crop (QA bekliyor) |
| Türk Dili ve Edebiyatı | 24 | 23/24 | auto-crop (QA bekliyor) |

> **Not:** AYT crop'ları `app-source-map-2026-ayt.js` içindeki runtime PDF.js tarayıcısı ile otomatik üretiliyor.
> Bu "ready" görünse de talimat madde 32 gereği manuel gözle QA'dan geçmeden tam güvenilir sayılmaz.
> Sıradaki öncelikli iş: 2026 AYT için örnekleme QA (görsel) + gerekiyorsa manuel source-map override.

### AYT answerKey bağımsız doğrulama (19 Ağustos 2026)

Resmî ÖSYM AYT 2026 kitapçığının tam metni (cdn.osym.gov.tr) + resmî cevap anahtarı ile
katalogdaki tüm 160 AYT sorusu tek tek karşılaştırıldı (madde 21-22 gereği).

- **159/160 doğrudan eşleşti.**
- **1 soru** (`osym-2026-ayt-tde1-20`) katalogda doğru şekilde `cancelled` işaretli — bağımsız
  haber kaynaklarıyla (Cumhuriyet, Karar, Takvim, kisadalga.net) doğrulandı: ÖSYM bu soruyu
  21 Haziran 2026 sınavı sonrası itiraz sürecinde resmen iptal etti.
- **`osym-2026-ayt-mat-23`**: katalogdaki `answerKey:'A'` ile PDF'in orijinal metnindeki `C`
  arasında görünen fark **gerçek bir hata değil** — ÖSYM bu sorunun cevabını 1 Temmuz 2026'da
  resmen "C"den "A"ya değiştirdi (kurumsal duyuru + aynı 4 haber kaynağı ile doğrulandı).
  PDF statik arşiv belgesi olduğu için orijinal (düzeltme öncesi) metni gösteriyor; katalog
  güncel resmî durumu yansıtıyor. Not: karara karşı açılmış bir yargı süreci var (Ağustos 2026
  itibarıyla sonuçlanmamış); ÖSYM'nin kurumsal kararı değişirse bu kayıt yeniden gözden geçirilmeli.
- **Sonuç: 160/160 answerKey resmî kaynakla tutarlı, sıfır gerçek hata bulundu.**

Bu doğrulama yalnız **metin/cevap** seviyesindedir; crop'ların görsel QA'sını kapsamaz (yukarıdaki not geçerli).

## Yeni PDF yayın ekleme

İleride yüklenen bir soru bankası için PDF bir kez indekslenir. Her soru için ders, konu, kazanım, zorluk, görsel durumu, sayfa ve mümkünse soru kutusunun koordinatları çıkarılır. PDF tekrar işlenmeden katalog üzerinden aranabilir.

`YKSQuestionCatalogV1.register(items)` çalışma zamanında yeni kaynak kayıtlarını aynı havuza ekleyebilir.

## Doğrulama

Her batch sonrası `node scripts/validate-catalog.mjs` çalıştırılmalı ve PASS almalıdır.
