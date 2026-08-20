# YKS Soru Kaynak Kataloğu

Bu katalog, soru kaynağını öğretmen zekâsından ayırır.

## Temel ilke

- ÖSYM/MEB/OGM: soru metnini repoya kopyalamak yerine metadata + resmî kaynak adresi saklanır.
- Kullanıcının ileride sağlayacağı PDF yayınlar: aynı katalog şemasına `uploaded-pdf` erişim tipiyle eklenir.
- Benzer soru bulma sırası: ÖSYM > MEB/OGM > kullanıcının seçilmiş yayınları (ayar ile öncelik verilebilir) > AI yedek.
- AI'nin görevi kaynak soruyu üretmekten çok; kazanım eşleme, ipucu, çözüm, hata analizi ve çalışma stratejisidir.

## Kayıt şeması

Her kayıt şu ortak alanları kullanır:

```js
{
  id,
  provider,
  providerLabel,
  collection,
  year,
  exam,
  subject,
  topic,
  subtopics: [],
  tags: [],
  difficulty,
  visual,
  questionNo,
  sourceKind,
  priority,
  access: {
    mode, // official-url | uploaded-pdf
    url,  // official-url için
    assetId, // uploaded-pdf için
    page,
    bbox // isteğe bağlı [x,y,w,h], PDF soru kırpımı
  }
}
```

### 2023 TYT Fen Bilimleri — source-map + crop görsel QA (20 Ağustos 2026)

Kullanıcı tarafından resmî PDF (`yks_tyt_2023_kitapcik_T23ky.pdf`) dosya olarak yüklendi;
PyMuPDF ile yerel olarak (network gerekmeden) sayfa sayfa render edilip 20/20 Fen Bilimleri
sorusu **piksel düzeyinde görsel QA'dan PASS** aldı. Sonuç olarak:

- 8 kayıtta (`fiz-01, fiz-05, fiz-07, kim-09, kim-11, biy-18, biy-19, biy-20`) daha önce
  `needs-manual-review-text-extraction-loss` olan flag **kaldırıldı** — metin katmanında kayıp
  olan içerik (grafik değerleri, devre şeması, izotop indisleri, sıcaklık değerleri, mitoz
  modeli, soyağacı, besin ağı) görsel katmanda tamamen sağlam çıktı; önceki metin-bazlı topic
  tahminleri doğrulandı, hiçbiri değiştirilmedi.
- `access.page` alanı 20/20 kayıtta gerçek PDF fiziksel sayfa numarasıyla (35-40) dolduruldu.
- `app-source-map-2023-tyt-fen.js` oluşturuldu (mevcut `app-source-map-2026-tyt-fen.js` kalıbı
  birebir takip edildi) — 20 kayıt için `pdfKey:'osym-2023-tyt'` + sayfa + oransal crop
  koordinatları (`x,y,w,h`) tanımlı, hepsi görsel QA ile doğrulanmış.
>
> **Runtime entegrasyonu:** `pdfKey:'osym-2023-tyt'` kaynağı `api/source-question.js`
> içindeki `SOURCES` objesine ve source-map dosyası mevcut official lazy-load grubuna
> eklenmiştir. Student-ready sonucu ancak gerçek Preview viewer testiyle doğrulanır.

## Yeni PDF yayın ekleme

İleride yüklenen bir soru bankası için PDF bir kez indekslenir. Her soru için ders, konu, kazanım, zorluk, görsel durumu, sayfa ve mümkünse soru kutusunun koordinatları çıkarılır. PDF tekrar işlenmeden katalog üzerinden aranabilir.

`YKSQuestionCatalogV1.register(items)` çalışma zamanında yeni kaynak kayıtlarını aynı havuza ekleyebilir. Bu nedenle mevcut ÖSYM/MEB pilot kodu yeni yayınevleri geldiğinde yeniden yazılmak zorunda değildir.

## Pilot kapsamı

İlk pilot: TYT Matematik / Üçgenler. ÖSYM 2024-2025 ve MEB/OGM Dört Dörtlük TYT Matematik kaynaklarıyla başlanmıştır. Benzer Soru düğmesi uygun durumda önce bu resmî katalogdan 5 aday gösterir; istenirse AI üretimine geri dönülebilir.
