import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');

function runtime() {
  const sourceMaps = {};
  const window = { YKSRegisterSourceMap: map => Object.assign(sourceMaps, map) };
  const context = vm.createContext({
    window,
    console,
    navigator: { connection: { saveData: true } },
    document: { addEventListener() {}, querySelector() { return null; } },
    setTimeout(fn) { fn(); return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
    clearInterval() {}
  });
  window.window = window;
  for (const file of [
    'data/yks-topic-taxonomy-v1.js',
    'data/question-catalog-v1.js',
    'data/catalog/2024-tyt-math-01-30.js',
    'data/catalog/2024-tyt-geometry.js',
    'data/catalog/2025-tyt-math-01-30.js',
    'data/catalog/2025-tyt-geometry.js',
    'data/question-catalog-dedupe.js',
    'app-source-map-2024-2025-tyt.js'
  ]) vm.runInContext(read(file), context, { filename: file });
  return { window, sourceMaps };
}

test('2024-2025 TYT math prepares 79 reviewed questions and isolates the one manual mapping', () => {
  const { window, sourceMaps } = runtime();
  const rows = window.YKSQuestionCatalogV1.all().filter(row =>
    row.provider === 'OSYM' && row.exam === 'TYT' && row.subject === 'Matematik' && [2024, 2025].includes(Number(row.year))
  );
  assert.equal(rows.length, 80);
  assert.deepEqual(Object.fromEntries([2024, 2025].map(year => [year, rows.filter(row => Number(row.year) === year).length])), { 2024: 40, 2025: 40 });

  const ready = rows.filter(row => row.asset?.status === 'ready');
  assert.equal(ready.length, 79);
  assert.ok(ready.every(row => row.answerKey && row.answerVerified));
  assert.ok(ready.every(row => row.asset.pdfKey && row.asset.page && row.asset.crop));
  assert.ok(ready.every(row => row.verification?.visualQa === 'pass-manual-official-pdf'));

  const manual = rows.find(row => row.id === 'osym-2025-tyt-mat-06');
  assert.notEqual(manual.asset?.status, 'ready');
  assert.equal(manual.canonicalTopicId, undefined);
  assert.equal(manual.verification?.topic, 'needs-manual-review-canonical-mapping');
  assert.ok(sourceMaps[manual.id]?.crop, 'manual-review crop remains traceable but not student-ready');
});

test('prepared canonical mappings exist in taxonomy and question/source identities stay unique', () => {
  const { window, sourceMaps } = runtime();
  const rows = window.YKSQuestionCatalogV1.all().filter(row =>
    row.provider === 'OSYM' && row.exam === 'TYT' && row.subject === 'Matematik' && [2024, 2025].includes(Number(row.year))
  );
  const ids = rows.map(row => row.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(Object.keys(sourceMaps).filter(id => ids.includes(id))).size, 80);

  const taxonomyIds = new Set(window.YKSTopicTaxonomyV1.all({ exam: 'TYT', subjectId: 'matematik', active: true }).map(topic => topic.id));
  const ready = rows.filter(row => row.asset?.status === 'ready');
  assert.ok(ready.every(row => taxonomyIds.has(row.canonicalTopicId)));
  assert.ok(ready.filter(row => row.visual).every(row => row.asset?.crop && row.verification?.visualQa));
});

test('all manual-review reasons are excluded by readiness policy', () => {
  for (const file of ['data/question-catalog-policy-v2.js', 'app-source-incomplete-policy.js']) {
    const source = read(file);
    assert.match(source, /startsWith\('needs-manual-review'\)/, `${file} must use the generic manual-review guard`);
  }
});
