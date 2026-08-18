# YKS Uzman Hoca V5.0.1

Kişisel YKS soru çözme, Kişisel Öğretmen, YKS Koçu ve Rehber Öğretmen web uygulaması.

## Güncel mimari
- StudyEvent V5 merkezi çalışma kaydı
- Fotoğraf veya metin ile YKS sorusu gönderme
- Mini Test sonuçlarının kalıcı StudyEvent kaydı
- Kişisel Öğretmen + YKS Koçu ortak strateji motoru
- V5 tabanlı İstatistikler ve konu performansı
- SAY / EA alan filtresi
- GPT-4.1-mini + GPT-5.6 Luna düşük maliyetli model ayrımı
- API kullanım / maliyet sayacı
- Açık / koyu tema
- PWA / ana ekrana kurulum

## Vercel environment variables
- `OPENAI_API_KEY`
- `OPENAI_MODEL` = `gpt-5.6`
- isteğe bağlı `OPENAI_ECONOMY_MODEL` = `gpt-5.6-luna`
- isteğe bağlı `OPENAI_SOLVE_MODEL` = `gpt-4.1-mini`
- Supabase senkronizasyonu kullanılacaksa `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY`

API anahtarı istemci koduna yazılmaz. OpenAI Responses API çağrılarında `store:false` kullanılır.

## Veri ve senkronizasyon
Yerel çalışma verisi tarayıcıda saklanır. StudyEvent V5, Mini Test, Soru Çöz, Kişisel Öğretmen ve deneme verilerini ortak modele taşır. Çok cihazlı Supabase senkronizasyonu yalnız gerekli V5 veritabanı migration'ı kurulduktan sonra etkinleştirilmelidir.
