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
> Sıradaki öncelikli iş: 2026 AYT için örnekleme QA + gerekiyorsa manuel source-map override.

## Yeni PDF yayın ekleme

İleride yüklenen bir soru bankası için PDF bir kez indekslenir. Her soru için ders, konu, kazanım, zorluk, görsel durumu, sayfa ve mümkünse soru kutusunun koordinatları çıkarılır. PDF tekrar işlenmeden katalog üzerinden aranabilir.

`YKSQuestionCatalogV1.register(items)` çalışma zamanında yeni kaynak kayıtlarını aynı havuza ekleyebilir.

## Doğrulama

Her batch sonrası `node scripts/validate-catalog.mjs` çalıştırılmalı ve PASS almalıdır.
