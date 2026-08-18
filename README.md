# YKS Uzman Hoca V4.8

Kişisel YKS soru çözme, YKS Koçu ve Rehber Öğretmen web uygulaması.

## Canlı özellikler
- Fotoğraf veya metin ile YKS sorusu gönderme
- GPT-5.6 + `skill/SKILL.md` ile soru çözümü
- MEB/ÖSYM resmi alanlarıyla sınırlı web doğrulaması
- `skill/REHBER_OGRETMEN.md` ile motivasyon ve çalışma desteği
- Günlük soru hedefi: 10–100
- Günlük çalışma süresi: 30 dk–5 saat
- Açık / koyu tema
- PWA / ana ekrana kurulum
- Yerel çalışma sayacı ve sohbet geçmişi

## Vercel environment variable
Vercel Project Settings > Environment Variables bölümüne ekleyin:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` = `gpt-5.6`

API anahtarı hiçbir zaman `index.html` içine yazılmaz.

## Gizlilik
OpenAI Responses API çağrılarında `store:false` kullanılır.

## Sonraki aşama
Supabase ile telefon + tablet veri senkronizasyonunun canlı sürüme yeniden bağlanması.
