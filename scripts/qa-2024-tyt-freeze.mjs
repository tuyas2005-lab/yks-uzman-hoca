#!/usr/bin/env node
// YKS Uzman Hoca — 2024 TYT FINAL QA / FREEZE
//
// Bu script SADECE 2024 TYT verisini (data/catalog/2024-tyt-*.js) denetler.
// Salt-okunur, hiçbir dosyayı değiştirmez, app/runtime koduna dokunmaz.
// scripts/validate-catalog.mjs'nin yerine geçmez, onu tamamlar (2024 TYT'ye özel kurallar).
// Mantık 2025 TYT freeze scriptinden (qa-2025-tyt-freeze.mjs) alınmıştır; o scriptte bulunan
// ve düzeltilen mantık hatası (year/exam kontrolünün zaten filtrelenmiş kümede yapılması)
// burada baştan file-scope olarak doğru kurulmuştur.
//
// Kullanım: node scripts/qa-2024-tyt-freeze.mjs
// Çıkış kodu: 0 = PASS, 1 = FAIL

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const catalogDir = path.join(REPO, 'data/catalog');

const fails = [];
const info = {};
function check(label, cond, detail) {
  info[label] = { pass: !!cond, detail };
  if (!cond) fails.push(`${label}: ${detail}`);
}

// --- Tam katalogu gercek runtime gibi yukle (2024 TYT'yi filtrelemek + genel kontroller icin) ---
const allRows = [];
const sandbox = {
  window: { YKSQuestionCatalogV1: { register(rows) { allRows.push(...rows); }, all() { return allRows; } } },
  console, setInterval: () => 0, clearInterval: () => {},
};
vm.createContext(sandbox);
const manifestSrc = fs.readFileSync(path.join(catalogDir, 'catalog-manifest.js'), 'utf8');
vm.runInContext(manifestSrc, sandbox);
const files = sandbox.window.YKSQuestionCatalogFiles;
for (const f of files) {
  const abs = path.join(REPO, f.replace(/^\//, ''));
  const src = fs.readFileSync(abs, 'utf8');
  vm.runInContext(src, sandbox, { filename: f });
}

const t2024 = allRows.filter(r => r.year === 2024 && r.exam === 'TYT');

// --- FILE-SCOPE YUKLEME (madde 10) — bastan izole, property filtresi olmadan ---
const tyt2024Files = files.filter(f => /\/2024-tyt-[^/]+\.js$/.test(f));
const fileScopeRows = [];
const fsSandbox = {
  window: { YKSQuestionCatalogV1: { register(rows) { fileScopeRows.push(...rows); }, all() { return fileScopeRows; } } },
  console, setInterval: () => 0, clearInterval: () => {},
};
vm.createContext(fsSandbox);
for (const f of tyt2024Files) {
  const abs = path.join(REPO, f.replace(/^\//, ''));
  const src = fs.readFileSync(abs, 'utf8');
  vm.runInContext(src, fsSandbox, { filename: f });
}

// --- 10. File-scope kontrolleri ---
check('10a-file-scope-dosya-listesi', tyt2024Files.length === 5, `bulunan: ${tyt2024Files.join(', ')}`);
check('10b-file-scope-toplam-125', fileScopeRows.length === 125, `bulunan: ${fileScopeRows.length}`);
const fsWrongYear = fileScopeRows.filter(r => r.year !== 2024);
const fsWrongExam = fileScopeRows.filter(r => r.exam !== 'TYT');
const fsWrongProvider = fileScopeRows.filter(r => r.provider !== 'OSYM');
const fsYdtLeak = fileScopeRows.filter(r => /ydt/i.test(r.id) || /yabancı dil/i.test(r.subject || '') || /yabancı dil/i.test(r.topic || ''));
check('10c-file-scope-yil-2024', fsWrongYear.length === 0, `yanlis yil: ${fsWrongYear.map(r => `${r.id}:${r.year}`).join(',')}`);
check('10d-file-scope-exam-TYT', fsWrongExam.length === 0, `yanlis exam: ${fsWrongExam.map(r => `${r.id}:${r.exam}`).join(',')}`);
check('10e-file-scope-provider-OSYM', fsWrongProvider.length === 0, `yanlis provider: ${fsWrongProvider.map(r => `${r.id}:${r.provider}`).join(',')}`);
check('10f-file-scope-ydt-sizinti-yok', fsYdtLeak.length === 0, `YDT izi: ${fsYdtLeak.map(r => r.id).join(',')}`);

// --- 1. Toplam 125, duplicate ID yok ---
check('1a-toplam-125', t2024.length === 125, `bulunan: ${t2024.length}`);
const idCounts = {};
for (const r of t2024) idCounts[r.id] = (idCounts[r.id] || 0) + 1;
const dups = Object.entries(idCounts).filter(([, c]) => c > 1);
check('1b-duplicate-id', dups.length === 0, `duplicate sayisi: ${dups.length} ${JSON.stringify(dups)}`);

// --- 3. Ana pool 120, alternate 5 ---
const mainPool = t2024.filter(r => !r.track);
const altPool = t2024.filter(r => r.track === 'alternate-track');
check('3a-main-pool-120', mainPool.length === 120, `bulunan: ${mainPool.length}`);
check('3b-alternate-5', altPool.length === 5, `bulunan: ${altPool.length}`);

// --- 4. track:'alternate-track' YALNIZ fel-21..25'te (tum katalogda, sadece 2024 TYT degil) ---
const allAltTrack = allRows.filter(r => r.track === 'alternate-track');
const expectedAltIds2024 = new Set(['osym-2024-tyt-fel-21', 'osym-2024-tyt-fel-22', 'osym-2024-tyt-fel-23', 'osym-2024-tyt-fel-24', 'osym-2024-tyt-fel-25']);
const altFor2024 = allAltTrack.filter(r => r.id.startsWith('osym-2024-'));
const altMatch2024 = new Set(altFor2024.map(r => r.id));
const match4 = altMatch2024.size === expectedAltIds2024.size && [...expectedAltIds2024].every(id => altMatch2024.has(id));
check('4-alternate-track-exact-set-2024', match4, `beklenen: ${[...expectedAltIds2024].join(',')} | bulunan: ${[...altMatch2024].join(',')}`);

// --- 5. trackReason dogru ---
const wrongReason = altFor2024.filter(r => r.trackReason !== 'din-muafiyeti-felsefe');
check('5-trackReason-dogru', wrongReason.length === 0, `yanlis/eksik trackReason: ${wrongReason.map(r => r.id).join(',')}`);

// --- 6. needs-manual-review tam olarak 9 kayitta ---
const expectedReviewIds = new Set([
  'osym-2024-tyt-mat-04', 'osym-2024-tyt-mat-09', 'osym-2024-tyt-mat-10', 'osym-2024-tyt-mat-13', 'osym-2024-tyt-mat-34',
  'osym-2024-tyt-fiz-01', 'osym-2024-tyt-fiz-05', 'osym-2024-tyt-kim-12', 'osym-2024-tyt-biy-19'
]);
const actualReviewIds = new Set(t2024.filter(r => r.verification?.topic === 'needs-manual-review-text-extraction-loss').map(r => r.id));
const reviewMatch = actualReviewIds.size === expectedReviewIds.size && [...expectedReviewIds].every(id => actualReviewIds.has(id));
check('6-needs-review-exact-set', reviewMatch, `beklenen: ${[...expectedReviewIds].join(',')} | bulunan: ${[...actualReviewIds].join(',')}`);

// --- 7. Tum 125'te answerKey A-E ve verification.answerKey==='official' ---
const missingAnswer = t2024.filter(r => !r.answerKey || !/^[A-E]$/.test(r.answerKey));
check('7a-answerKey-eksik', missingAnswer.length === 0, `eksik/gecersiz: ${missingAnswer.length} ${missingAnswer.map(r => r.id).join(',')}`);
const wrongVerification = t2024.filter(r => r.verification?.answerKey !== 'official');
check('7b-verification-official', wrongVerification.length === 0, `official disi: ${wrongVerification.length} ${wrongVerification.map(r => `${r.id}:${r.verification?.answerKey}`).join(',')}`);

// --- 8. Tum 125'te access.page===null ---
const guessedPage = t2024.filter(r => r.access?.page !== null);
check('8-page-null', guessedPage.length === 0, `page dolu olanlar: ${guessedPage.map(r => `${r.id}:${r.access?.page}`).join(',')}`);

// --- 9. Ders dagilimi ---
const bySubject = {};
for (const r of t2024) bySubject[r.subject] = (bySubject[r.subject] || 0) + 1;
const turkce = bySubject['Türkçe'] || 0;
const matematik = bySubject['Matematik'] || 0;
const sosyalSubjects = ['Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü ve Ahlak Bilgisi'];
const sosyalTum = sosyalSubjects.reduce((s, k) => s + (bySubject[k] || 0), 0);
const sosyalMain = t2024.filter(r => sosyalSubjects.includes(r.subject) && !r.track).length;
const fenSubjects = ['Fizik', 'Kimya', 'Biyoloji'];
const fen = fenSubjects.reduce((s, k) => s + (bySubject[k] || 0), 0);
check('9a-turkce-40', turkce === 40, `bulunan: ${turkce}`);
check('9b-matematik-40', matematik === 40, `bulunan: ${matematik}`);
check('9c-sosyal-25-fiziksel', sosyalTum === 25, `bulunan: ${sosyalTum}`);
check('9d-sosyal-20-main', sosyalMain === 20, `bulunan: ${sosyalMain}`);
check('9e-fen-20', fen === 20, `bulunan: ${fen}`);
const subjectSum = turkce + matematik + sosyalTum + fen;
check('9f-subject-toplam-125', subjectSum === 125, `toplam: ${subjectSum}`);

// --- 11. Crop tutarliligi: source-map dosyasi olmamali, page:null 125/125 ---
const cropMapFiles = fs.readdirSync(REPO).filter(f => /^app-source-map-2024/.test(f));
check('11a-source-map-dosyasi-yok', cropMapFiles.length === 0, `bulunan dosyalar: ${cropMapFiles.join(',')}`);
const verifiedCrop = t2024.filter(r => r.asset?.status === 'ready' || (r.access?.crop));
const pendingCrop = t2024.filter(r => r.access?.page === null);
const ambiguousCrop = t2024.length - verifiedCrop.length - (t2024.length - verifiedCrop.length);
check('11b-verified-crop-0', verifiedCrop.length === 0, `bulunan: ${verifiedCrop.length}`);
check('11c-pending-crop-125', pendingCrop.length === 125, `bulunan: ${pendingCrop.length}`);
check('11d-belirsiz-crop-0', (t2024.length - verifiedCrop.length - pendingCrop.length) === 0, `hesap: ${t2024.length}-${verifiedCrop.length}-${pendingCrop.length}`);

// --- 12. Taxonomy'de suphe uyandiran mukerrer topic'ler (RAPORLAMA, otomatik degistirme yok) ---
const topicsBySubject = {};
for (const r of allRows) {
  const key = `${r.exam} ${r.subject}`;
  topicsBySubject[key] ??= new Set();
  topicsBySubject[key].add(r.topic);
}
const suspiciousDuplicates = [];
function normalize(s) {
  return s.toLowerCase().replace(/[çğıöşü]/g, c => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }[c])).replace(/[^a-z0-9]/g, '');
}
function sharedWordRatio(a, b) {
  const wa = new Set(a.toLowerCase().split(/[\s\-]+/).filter(w => w.length > 2));
  const wb = new Set(b.toLowerCase().split(/[\s\-]+/).filter(w => w.length > 2));
  if (!wa.size || !wb.size) return 0;
  const inter = [...wa].filter(w => wb.has(w)).length;
  return inter / Math.min(wa.size, wb.size);
}
for (const [key, topicSet] of Object.entries(topicsBySubject)) {
  const topics = [...topicSet];
  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      const a = topics[i], b = topics[j];
      if (a === b) continue;
      if (normalize(a) === normalize(b)) { suspiciousDuplicates.push({ subject: key, a, b, reason: 'normalize-esit' }); continue; }
      const ratio = sharedWordRatio(a, b);
      if (ratio >= 0.66) suspiciousDuplicates.push({ subject: key, a, b, reason: `ortak-kelime-orani:${ratio.toFixed(2)}` });
    }
  }
}
// Sadece 2024 icerikli topic ciftlerini ayrica isaretle (bu batch'e ozel yeni terimler)
const topics2024 = new Set(t2024.map(r => r.topic));
const relevantTo2024 = suspiciousDuplicates.filter(d => topics2024.has(d.a) || topics2024.has(d.b));

// --- Rapor ---
console.log('=== 2024 TYT FINAL QA / FREEZE ===\n');
for (const [label, { pass, detail }] of Object.entries(info)) {
  console.log(`  ${pass ? '✓' : '✗'} ${label} — ${detail}`);
}

console.log('\n=== TAXONOMY SUPHE UYANDIRAN MUKERRER TOPIC — 2024 icerikli olanlar (yalniz rapor) ===');
if (relevantTo2024.length === 0) {
  console.log('  2024 topic\'lerini iceren supheli cift bulunamadi.');
} else {
  for (const d of relevantTo2024) console.log(`  [${d.subject}] "${d.a}"  <->  "${d.b}"  (${d.reason})`);
}
console.log(`\n(Tum katalog genelinde toplam ${suspiciousDuplicates.length} supheli cift var; yukarida yalniz 2024 iceren ${relevantTo2024.length} tanesi listelendi.)`);

console.log('\n=== OZET ===');
console.log(`Fiziksel (physical): ${t2024.length}`);
console.log(`Main pool: ${mainPool.length}`);
console.log(`Alternate: ${altPool.length}`);
console.log(`Manual-review: ${actualReviewIds.size}`);
console.log(`Duplicate ID: ${dups.length}`);
console.log(`answerKey eksik: ${missingAnswer.length}`);
console.log(`File-scope hata sayisi: ${fsWrongYear.length + fsWrongExam.length + fsWrongProvider.length + fsYdtLeak.length}`);
console.log(`Crop: ${verifiedCrop.length} verified / ${pendingCrop.length} pending / ${t2024.length - verifiedCrop.length - pendingCrop.length} belirsiz`);
console.log(`Toplam katalog (tum yillar): ${allRows.length}`);
console.log(`\nSONUÇ: ${fails.length === 0 ? 'PASS' : 'FAIL'}`);
if (fails.length) { console.log('\nHatalar:'); fails.forEach(f => console.log('  - ' + f)); }

process.exit(fails.length === 0 ? 0 : 1);
