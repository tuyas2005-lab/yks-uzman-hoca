#!/usr/bin/env node
// YKS Uzman Hoca — Soru Kütüphanesi Validation Script
//
// Bu script data/catalog/** içindeki tüm kayıtları gerçek runtime gibi
// (window.YKSQuestionCatalogV1.register üzerinden) yükler ve talimatta
// tanımlı kurallara göre doğrular. Uygulama runtime'ını DEĞİŞTİRMEZ,
// yalnız salt-okunur bir denetim aracıdır.
//
// Kullanım: node scripts/validate-catalog.mjs
// Çıkış kodu: 0 = PASS, 1 = FAIL (en az bir hata var)

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const catalogDir = path.join(REPO, 'data/catalog');

const errors = [];
const warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// --- 1. Katalogu gerçek runtime gibi yükle ---
const allRows = [];
const sandbox = {
  window: {
    YKSQuestionCatalogV1: {
      register(rows) { allRows.push(...rows); },
      all() { return allRows; }
    },
    __YKS_CATALOG_SEEDS__: undefined,
    YKSQuestionCatalogFiles: undefined,
    YKSQuestionCatalogManifest: undefined,
  },
  console,
  setInterval: () => 0,
  clearInterval: () => {},
};
vm.createContext(sandbox);

if (!fs.existsSync(path.join(catalogDir, 'catalog-manifest.js'))) {
  console.error('FATAL: data/catalog/catalog-manifest.js bulunamadı.');
  process.exit(1);
}

try {
  const manifestSrc = fs.readFileSync(path.join(catalogDir, 'catalog-manifest.js'), 'utf8');
  vm.runInContext(manifestSrc, sandbox, { filename: 'catalog-manifest.js' });
} catch (e) {
  console.error('FATAL: catalog-manifest.js syntax hatasi:', e.message);
  process.exit(1);
}

const files = sandbox.window.YKSQuestionCatalogFiles || [];
if (!files.length) err('Manifest bos: window.YKSQuestionCatalogFiles hicbir dosya listelemiyor.');

// manifest kapsam politikasi (YDT haric olmali)
const manifestPolicy = sandbox.window.YKSQuestionCatalogManifest;
if (manifestPolicy?.scope?.include?.includes('YDT')) {
  err('Manifest scope.include icinde YDT var - talimat madde 4 ihlali (YDT su asamada kapsam disi).');
}
for (const f of files) {
  if (/ydt/i.test(f)) err(`Manifest dosya listesinde YDT gorunumlu dosya var: ${f}`);
}

for (const f of files) {
  const rel = f.replace(/^\//, '');
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) { err(`Manifestte listelenen dosya diskte yok: ${rel}`); continue; }
  try {
    const src = fs.readFileSync(abs, 'utf8');
    vm.runInContext(src, sandbox, { filename: rel });
  } catch (e) {
    err(`Syntax/runtime hatasi (${rel}): ${e.message}`);
  }
}

if (!allRows.length) {
  console.error('FATAL: Hicbir kayit yuklenemedi.');
  process.exit(1);
}

// --- 2. Duplicate ID kontrolu ---
const idCounts = {};
for (const r of allRows) idCounts[r.id] = (idCounts[r.id] || 0) + 1;
for (const [id, c] of Object.entries(idCounts)) {
  if (c > 1) err(`Duplicate ID: "${id}" (${c} kez)`);
}

// --- 3. Duplicate (provider/year/exam/subject/questionNo/collection) kontrolu ---
const compCounts = {};
for (const r of allRows) {
  const k = `${r.provider}|${r.year}|${r.exam}|${r.subject}|${r.questionNo}|${r.collection}`;
  compCounts[k] = (compCounts[k] || 0) + 1;
}
for (const [k, c] of Object.entries(compCounts)) {
  if (c > 1) err(`Duplicate soru (provider/year/exam/subject/questionNo/collection): ${k} (${c} kez)`);
}

// --- 4. Zorunlu alan kontrolu (madde 58) ---
const VALID_EXAMS = new Set(['TYT', 'AYT']);
const VALID_ANSWERS = new Set(['A', 'B', 'C', 'D', 'E']);

for (const r of allRows) {
  const tag = r.id || '(id yok!)';
  if (!r.id) err(`Kayitta id eksik: ${JSON.stringify(r).slice(0, 80)}`);
  if (!r.provider) err(`${tag}: provider eksik`);
  if (!VALID_EXAMS.has(r.exam)) err(`${tag}: exam gecersiz veya eksik ("${r.exam}") - yalniz TYT/AYT olmali`);
  if (!r.subject) err(`${tag}: subject eksik`);
  if (!r.topic) err(`${tag}: topic eksik`);
  if (!r.questionNo) err(`${tag}: questionNo eksik`);
  if (r.sourceKind !== 'official') warn(`${tag}: sourceKind "official" degil ("${r.sourceKind}")`);
  if (!r.access) { err(`${tag}: access eksik`); continue; }

  // OSYM ozel kurallari
  if (r.provider === 'OSYM') {
    if (r.year != null && typeof r.year !== 'number') err(`${tag}: year sayisal degil ("${r.year}")`);
    if (r.cancelled) {
      // Iptal edilmis soru - answerKey null olmali, bu normal (madde 46 - resmi cakisma raporlanir)
      if (r.answerKey) warn(`${tag}: cancelled=true ama answerKey dolu ("${r.answerKey}") - tutarsizlik olabilir`);
    } else if (r.answerKey != null) {
      if (!VALID_ANSWERS.has(r.answerKey)) err(`${tag}: gecersiz answerKey "${r.answerKey}" (A-E disi)`);
    }
    if (!r.access?.url) warn(`${tag}: resmi URL (access.url) yok`);
    else if (!/osym\.gov\.tr|meb\.gov\.tr/i.test(r.access.url)) {
      warn(`${tag}: access.url resmi ÖSYM/MEB domaini gibi gorunmuyor: ${r.access.url}`);
    }
  }

  // Hazir (ready) asset kontrolu
  if (r.asset?.status === 'ready') {
    if (!r.asset.pdfKey) err(`${tag}: asset.status=ready ama pdfKey yok`);
    if (r.asset.crop) {
      const c = r.asset.crop;
      if (!(c.x >= 0 && c.x < 1)) err(`${tag}: crop.x gecersiz (${c.x})`);
      if (!(c.y >= 0 && c.y < 1)) err(`${tag}: crop.y gecersiz (${c.y})`);
      if (!(c.w > 0 && c.w <= 1)) err(`${tag}: crop.w gecersiz (${c.w})`);
      if (!(c.h > 0 && c.h <= 1)) err(`${tag}: crop.h gecersiz (${c.h})`);
      if (c.x + c.w > 1.02) err(`${tag}: crop x+w > ~1 (${c.x + c.w})`);
      if (c.y + c.h > 1.02) err(`${tag}: crop y+h > ~1 (${c.y + c.h})`);
    } else if (!r.asset.parts) {
      err(`${tag}: asset.status=ready ama crop de parts de yok`);
    }
    // "ready" tanimi (madde 48): answerKey + answerVerified + asset.ready hepsi birlikte olmali
    if (!r.answerKey && !r.cancelled) warn(`${tag}: asset ready ama answerKey yok - madde 48 ihlali olabilir`);
  }
}

// --- 5. Rapor ---
console.log('=== YKS Uzman Hoca — Katalog Validation Raporu ===\n');
console.log(`Toplam kayit: ${allRows.length}`);
console.log(`Dosya sayisi: ${files.length}`);
console.log(`Hata (error): ${errors.length}`);
console.log(`Uyari (warning): ${warnings.length}\n`);

if (errors.length) {
  console.log('--- HATALAR ---');
  errors.forEach(e => console.log('  ✗ ' + e));
  console.log('');
}
if (warnings.length) {
  console.log('--- UYARILAR ---');
  warnings.forEach(w => console.log('  ⚠ ' + w));
  console.log('');
}

if (errors.length) {
  console.log('SONUÇ: FAIL');
  process.exit(1);
} else {
  console.log('SONUÇ: PASS');
  process.exit(0);
}
