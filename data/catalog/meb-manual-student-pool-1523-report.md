# MEB Manual Student Pool — 1523 — QA Raporu

**Kapsam:** DATA PREPARATION + QA sadece. GitHub/main/production/PR/branch'e dokunulmadı, commit/push/merge/deploy yapılmadı. Uygulama kodu değişmedi.

---

## 1. GİRDİ KAYNAKLARI

| Kaynak | Dosya | Kayıt |
|---|---|---|
| MEB 3 Adım crop planı | `yks-crops-v10-final-clean-835.json` | 835 |
| MEB Dört Dörtlük crop planı | `yks-crops-v11-partial-clean-688.json` | 688 |
| MEB 3 Adım kaynak ZIP | `matematik_2_.zip` (`matematik.zip` ile MD5 birebir aynı) | — |
| MEB Dört Dörtlük kaynak ZIP | `matematik_20_281_29_281_29.zip` = *"Dört Dörtlük - TYT - Matematik"* (558 sayfa) | — |

**Toplam:** 835 + 688 = **1523 soru** ✅ (hedeflenen sayıya birebir ulaşıldı)

---

## 2. RESMİ CEVAP ANAHTARI KAYNAKLARI

### MEB 3 Adım
`files/basic-html/page217-220.html` — "MATEMATİK CEVAP ANAHTARI" bölümü. 29 kanonik konunun tamamı bu sayfalarda bulundu ve parse edildi.

### MEB Dört Dörtlük — TEST bölümü
`files/basic-html/page553-554.html` — "CEVAP ANAHTARI" bölümü. Her sayfa birden fazla alt-konu bloğu içeriyor; toplam 9 alt-konunun tamamı bu 2 sayfada bulundu.

**Kritik format bulgusu:** Bazı testler harfli varyantlara bölünmüş (`1. TEST-A`, `1. TEST-B` gibi — 22 soruluk bir test, 11+11 olarak iki satırda basılmış). Bu, kaynak verinizdeki `testPart` alanı (A/B/C) ile çapraz doğrulandı: **42/42 grid satırı**, beklenen soru sayısıyla birebir eşleşti — Test 3-C'nin bilinen 5-soru-hariç-tutma durumu (163-164.jpg page-split fix) dahil.

### MEB Dört Dörtlük — Çözümlü bölümü
Her çözümlü sorunun çözüm metninin sonunda resmi **"Cevap: X"** ibaresi basılı. Sütun-pozisyon (metin çıkarımı) yöntemiyle 220/234 soru bulunabildi, ancak bu yöntemin **soru-cevap eşleşmesini soru bazında kesin kanıtlamadığı** tespit edildi (çözüm metni uzunluğuna göre "Cevap:" etiketinin sütun konumu kayabiliyor, sayı-eşleşmesi doğru olsa bile birebir eşleşme garantisi yok).

**Karar (kullanıcı talimatı):** Bu 234 soru **student-ready havuzdan çıkarıldı**, `pending-official-answer-verification` statüsünde ayrı tutuldu. Metin-sütun yöntemiyle bulunan 220 cevap **kullanılmadı**, kayıtlara yazılmadı (`answerKey: null`).

---

## 3. DOĞRULANAN DÜZELTMELER (bozulmadı)

| Düzeltme | Doğrulama |
|---|---|
| 117.jpg q6/q8 crop swap | taskIndex 431 (q6) ve 433 (q8) sıralı, çakışmasız crop kutuları — görsel QA ile de teyit edildi |
| 163-164.jpg Test 3-C page split | index 625-629 doğru şekilde yok (hariç), 630-635 doğru şekilde 164.jpg q7-q12'ye remap edilmiş — hem veri hem cevap-anahtarı grid'i (7 soru, aralık 1-12) ile teyit edildi |

---

## 4. ÇIKTI DOSYALARI

| Dosya | İçerik |
|---|---|
| `meb-manual-student-pool-1523.json` | 1523 kayıt, düz JSON dizisi |
| `meb-manual-student-pool-1523.js` | Aynı veri, `window.MEBManualStudentPool1523 = {rows, fields}` olarak. **Bağımsız modül** — hiçbir boot chain'e bağlanmadı, `YKSQuestionCatalogV1`'e otomatik register olmuyor |
| `meb-manual-student-pool-1523-report.md` | Bu rapor |
| 1523 crop asset (.jpg) | `assets/meb-3-adim-tyt-math-v10-full/*.jpg` (835) + `assets/meb-dort-dortluk-tyt-math-v11/*.jpg` (688) |

---

## 5. FİNAL QA SONUÇLARI

### 5.1 MEB 3 Adım
| Metrik | Değer |
|---|---|
| **Student-ready toplam** | **835** |
| Kolay | 355 |
| Orta | 264 |
| Zor | 216 |
| answerVerified = true | 835 / 835 |

### 5.2 MEB Dört Dörtlük — TEST
| Metrik | Değer |
|---|---|
| **Student-ready toplam** | **454** |
| Kolay | 0 |
| Orta | 264 |
| Zor | 190 |
| answerVerified = true | 454 / 454 |

### 5.3 MEB Dört Dörtlük — Çözümlü (pending)
| Metrik | Değer |
|---|---|
| **Pending toplam** | **234** |
| Kolay (difficultyOrigin bilgisi, cevap değil) | 234 |
| answerKey | null (234/234) |
| answerVerified | false (234/234) |
| status | `pending-official-answer-verification` (234/234) |

### 5.4 COMBINED

| Metrik | Değer |
|---|---|
| **Total (paket)** | **1523** |
| **Combined student-ready** | **1289** (835 + 454) |
| Pending (Çözümlü, ayrı turda ele alınacak) | 234 |
| Duplicate id | 0 |
| Duplicate sourceFingerprint | 0 |
| Missing official answer (student-ready içinde) | 0 |
| answerVerified = false (student-ready içinde) | 0 |
| Malformed answerKey (student-ready içinde) | 0 |
| Pending kayıtlarda answerKey ≠ null (olmamalı) | 0 |
| Pending kayıtlarda answerVerified = true (olmamalı) | 0 |
| Invalid crop bounds | 0 / 1523 |
| Missing source JPG | 0 / 1523 |
| Thumb kullanımı (`files/thumb/`) | 0 / 1523 |
| Malformed topic (mojibake kalıntısı) | 0 / 1523 |
| Difficulty mapping hatası | 0 / 1523 |
| Generated asset sayısı | 1523 / 1523 (835 + 688) — kayıt/asset 1:1 eşleşti |
| Eski placeholder kayıt sızıntısı (`veri-1-2-05`, `veri-2-3-03`) | 0 |

---

## 6. GÖRSEL QA (manuel örnekleme)

Aşağıdaki örnekler tek tek açılıp incelendi:
- MEB 3 Adım: Mantık (tablo/şekil içeren soru), Katı Cisimler-Prizmalar (yeni eklenen konu)
- MEB Dört Dörtlük TEST: Önermeler ve Bileşik Önermeler soru 1
- MEB Dört Dörtlük Çözümlü: Sayı Kümeleri soru 9 — **çözüm/cevap metni crop'a sızmamış, yalnız soru içeriyor** (talimata uygun)
- 117.jpg q6 (swap-fix sonrası) — tam, komşu soru bulaşması yok

Tümü temiz: soru başlangıcı/sonu tam, seçenekler tam, komşu soru bulaşması yok.

---

## 7. BİLİNEN SINIRLAR / SONRAKİ ADIM

- **234 Dört Dörtlük Çözümlü sorusu** şu an `pending-official-answer-verification` statüsünde, crop'u ve tüm metadata'sı hazır ama `answerKey: null`. Ayrı bir görsel doğrulama turunda (sayfa görsellerini tek tek okuyarak, sütun-pozisyon tahminine değil doğrudan görsel/sayfa-bazlı doğrulamaya dayanarak) tamamlanması önerilir.
- `meb-manual-student-pool-1523.js` bilinçli olarak **hiçbir boot chain'e veya `YKSQuestionCatalogV1`'e bağlanmadı** — talimat gereği yalnızca veri paketi üretildi, entegrasyon kararı ChatGPT/ürün tarafına bırakıldı.
- `visual` (görselli/görselsiz) alanı bu pakette üretilmedi — talep edilen alan listesinde yoktu.

---

`MEB MANUAL STUDENT POOL 1523 — QA COMPLETE`
