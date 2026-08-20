#!/usr/bin/env node
// YKS Uzman Hoca — 2025 TYT FINAL QA / FREEZE
//
// Bu script SADECE 2025 TYT verisini (data/catalog/2025-tyt-*.js) denetler.
// Salt-okunur, hiçbir dosyayı değiştirmez, app/runtime koduna dokunmaz.
// scripts/validate-catalog.mjs'nin yerine geçmez, onu tamamlar (2025 TYT'ye özel kurallar).
//
// Kullanım: node scripts/qa-2025-tyt-freeze.mjs
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

// --- Katalogu gercek runtime gibi yukle (tum dosyalar, sadece 2025 TYT'yi filtrelemek icin) ---
const allRows = [];
const sandbox = {
  window: {
    YKSQuestionCatalogV1: { register(rows) { allRows.push(...rows); }, all() { return allRows; } },
  },
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

const t2025 = allRows.filter(r => r.year === 2025 && r.exam === 'TYT');

// --- 1. Toplam 125, duplicate ID yok ---
check('1a-toplam-125', t2025.length === 125, `bulunan: ${t2025.length}`);
const idCounts = {};
for (const r of t2025) idCounts[r.id] = (idCounts[r.id] || 0) + 1;
const dups = Object.entries(idCounts).filter(([,c]) => c > 1);
check('1b-duplicate-id', dups.length === 0, `duplicate sayisi: ${dups.length} ${JSON.stringify(dups)}`);

// --- 2. Ana pool 120, alternate 5 ---
const mainPool = t2025.filter(r => !r.track);
const altPool = t2025.filter(r => r.track === 'alternate-track');
check('2a-main-pool-120', mainPool.length === 120, `bulunan: ${mainPool.length}`);
check('2b-alternate-5', altPool.length === 5, `bulunan: ${altPool.length}`);

// --- 3. track:'alternate-track' YALNIZ fel-21..25'te (tum katalogda, sadece 2025 TYT degil) ---
const allAltTrack = allRows.filter(r => r.track === 'alternate-track');
const expectedAltIds = new Set(['osym-2025-tyt-fel-21','osym-2025-tyt-fel-22','osym-2025-tyt-fel-23','osym-2025-tyt-fel-24','osym-2025-tyt-fel-25']);
const actualAltIds = new Set(allAltTrack.map(r => r.id));
const altMatch = actualAltIds.size === expectedAltIds.size && [...expectedAltIds].every(id => actualAltIds.has(id));
check('3-alternate-track-exact-set', altMatch, `beklenen: ${[...expectedAltIds].join(',')} | bulunan: ${[...actualAltIds].join(',')}`);

// --- 4. trackReason dogru ---
const wrongReason = allAltTrack.filter(r => r.trackReason !== 'din-muafiyeti-felsefe');
check('4-trackReason-dogru', wrongReason.length === 0, `yanlis/eksik trackReason: ${wrongReason.map(r=>r.id).join(',')}`);

// --- 5. needs-manual-review tam olarak 4 kayitta ---
const expectedReviewIds = new Set(['osym-2025-tyt-mat-03','osym-2025-tyt-mat-05','osym-2025-tyt-kim-10','osym-2025-tyt-kim-13']);
const actualReviewIds = new Set(t2025.filter(r => r.verification?.topic === 'needs-manual-review-text-extraction-loss').map(r => r.id));
const reviewMatch = actualReviewIds.size === expectedReviewIds.size && [...expectedReviewIds].every(id => actualReviewIds.has(id));
check('5-needs-review-exact-set', reviewMatch, `beklenen: ${[...expectedReviewIds].join(',')} | bulunan: ${[...actualReviewIds].join(',')}`);

// --- 6. Tum 125'te answerKey var ve verification.answerKey==='official' ---
const missingAnswer = t2025.filter(r => !r.answerKey || !/^[A-E]$/.test(r.answerKey));
check('6a-answerKey-eksik', missingAnswer.length === 0, `eksik/gecersiz: ${missingAnswer.length} ${missingAnswer.map(r=>r.id).join(',')}`);
const wrongVerification = t2025.filter(r => r.verification?.answerKey !== 'official');
check('6b-verification-official', wrongVerification.length === 0, `official disi: ${wrongVerification.length} ${wrongVerification.map(r=>`${r.id}:${r.verification?.answerKey}`).join(',')}`);

// --- 7. Tum 125'te access.page===null ---
const guessedPage = t2025.filter(r => r.access?.page !== null);
check('7-page-null', guessedPage.length === 0, `page dolu olanlar: ${guessedPage.map(r=>`${r.id}:${r.access?.page}`).join(',')}`);

// --- 8. Ders dagilimi ---
const bySubject = {};
for (const r of t2025) bySubject[r.subject] = (bySubject[r.subject] || 0) + 1;
const turkce = bySubject['Türkçe'] || 0;
const matematik = bySubject['Matematik'] || 0; // Matematik+Geometri ayni subject
const sosyalSubjects = ['Tarih','Coğrafya','Felsefe','Din Kültürü ve Ahlak Bilgisi'];
const sosyal = sosyalSubjects.reduce((s,k) => s + (bySubject[k]||0), 0);
const fenSubjects = ['Fizik','Kimya','Biyoloji'];
const fen = fenSubjects.reduce((s,k) => s + (bySubject[k]||0), 0);
check('8a-turkce-40', turkce === 40, `bulunan: ${turkce}`);
check('8b-matematik-40', matematik === 40, `bulunan: ${matematik}`);
check('8c-sosyal-25', sosyal === 25, `bulunan: ${sosyal} (dagilim: ${JSON.stringify(Object.fromEntries(sosyalSubjects.map(k=>[k,bySubject[k]||0])))})`);
check('8d-fen-20', fen === 20, `bulunan: ${fen} (dagilim: ${JSON.stringify(Object.fromEntries(fenSubjects.map(k=>[k,bySubject[k]||0])))})`);
const subjectSum = turkce + matematik + sosyal + fen;
check('8e-subject-toplam-125', subjectSum === 125, `toplam: ${subjectSum}`);

// --- 9. Standart pool 120, fiziksel katalog 125 (ayri ayri) ---
check('9a-standart-pool-120', mainPool.length === 120, `main pool: ${mainPool.length}`);
check('9b-fiziksel-katalog-125', t2025.length === 125, `toplam katalog: ${t2025.length}`);

// --- 10. Yanlislikla 2026/YDT/yanlis exam/yanlis provider yok ---
const wrongYear = t2025.filter(r => r.year !== 2025);
const wrongExam = t2025.filter(r => r.exam !== 'TYT');
const wrongProvider = t2025.filter(r => r.provider !== 'OSYM');
const ydtLeak = t2025.filter(r => /ydt/i.test(r.id) || /yabancı dil/i.test(r.subject||'') || /yabancı dil/i.test(r.topic||''));
check('10a-yil-2025', wrongYear.length === 0, `yanlis yil: ${wrongYear.map(r=>r.id).join(',')}`);
check('10b-exam-TYT', wrongExam.length === 0, `yanlis exam: ${wrongExam.map(r=>r.id).join(',')}`);
check('10c-provider-OSYM', wrongProvider.length === 0, `yanlis provider: ${wrongProvider.map(r=>r.id).join(',')}`);
check('10d-ydt-sizinti-yok', ydtLeak.length === 0, `YDT izi: ${ydtLeak.map(r=>r.id).join(',')}`);

// --- 11. Taxonomy'de suphe uyandiran mukerrer topic'ler (RAPORLAMA, otomatik degistirme yok) ---
const topicsBySubject = {};
for (const r of allRows) {
  const key = `${r.exam} ${r.subject}`;
  topicsBySubject[key] ??= new Set();
  topicsBySubject[key].add(r.topic);
}
const suspiciousDuplicates = [];
function normalize(s) {
  return s.toLowerCase()
    .replace(/[çğıöşü]/g, c => ({ç:'c',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u'}[c]))
    .replace(/[^a-z0-9]/g, '');
}
function sharedWordRatio(a, b) {
  const wa = new Set(a.toLowerCase().split(/[\s\-]+/).filter(w=>w.length>2));
  const wb = new Set(b.toLowerCase().split(/[\s\-]+/).filter(w=>w.length>2));
  if (!wa.size || !wb.size) return 0;
  const inter = [...wa].filter(w=>wb.has(w)).length;
  return inter / Math.min(wa.size, wb.size);
}
for (const [key, topicSet] of Object.entries(topicsBySubject)) {
  const topics = [...topicSet];
  for (let i=0;i<topics.length;i++) {
    for (let j=i+1;j<topics.length;j++) {
      const a = topics[i], b = topics[j];
      if (a === b) continue;
      if (normalize(a) === normalize(b)) {
        suspiciousDuplicates.push({subject:key, a, b, reason:'normalize-esit'});
        continue;
      }
      const ratio = sharedWordRatio(a, b);
      if (ratio >= 0.66) {
        suspiciousDuplicates.push({subject:key, a, b, reason:`ortak-kelime-orani:${ratio.toFixed(2)}`});
      }
    }
  }
}

// --- Rapor ---
console.log('=== 2025 TYT FINAL QA / FREEZE ===\n');
for (const [label, {pass, detail}] of Object.entries(info)) {
  console.log(`  ${pass ? '✓' : '✗'} ${label} — ${detail}`);
}

console.log('\n=== TAXONOMY SUPHE UYANDIRAN MUKERRER TOPIC (yalniz rapor, degistirilmedi) ===');
if (suspiciousDuplicates.length === 0) {
  console.log('  Hicbiri bulunamadi.');
} else {
  for (const d of suspiciousDuplicates) {
    console.log(`  [${d.subject}] "${d.a}"  <->  "${d.b}"  (${d.reason})`);
  }
}

console.log('\n=== OZET ===');
console.log(`Toplam 2025 TYT kayit: ${t2025.length}`);
console.log(`Ana pool: ${mainPool.length}`);
console.log(`Alternate-track: ${altPool.length}`);
console.log(`needs-manual-review: ${actualReviewIds.size}`);
console.log(`Duplicate ID: ${dups.length}`);
console.log(`answerKey eksik/gecersiz: ${missingAnswer.length}`);
console.log(`Taxonomy supheli tekrar: ${suspiciousDuplicates.length}`);
console.log(`\nSONUÇ: ${fails.length === 0 ? 'PASS' : 'FAIL'}`);
if (fails.length) {
  console.log('\nHatalar:');
  fails.forEach(f => console.log('  - ' + f));
}

process.exit(fails.length === 0 ? 0 : 1);
