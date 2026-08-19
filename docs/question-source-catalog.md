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

## Yeni PDF yayın ekleme

İleride yüklenen bir soru bankası için PDF bir kez indekslenir. Her soru için ders, konu, kazanım, zorluk, görsel durumu, sayfa ve mümkünse soru kutusunun koordinatları çıkarılır. PDF tekrar işlenmeden katalog üzerinden aranabilir.

`YKSQuestionCatalogV1.register(items)` çalışma zamanında yeni kaynak kayıtlarını aynı havuza ekleyebilir. Bu nedenle mevcut ÖSYM/MEB pilot kodu yeni yayınevleri geldiğinde yeniden yazılmak zorunda değildir.

## Pilot kapsamı

İlk pilot: TYT Matematik / Üçgenler. ÖSYM 2024-2025 ve MEB/OGM Dört Dörtlük TYT Matematik kaynaklarıyla başlanmıştır. Benzer Soru düğmesi uygun durumda önce bu resmî katalogdan 5 aday gösterir; istenirse AI üretimine geri dönülebilir.
