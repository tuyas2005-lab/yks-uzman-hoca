import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');

function runtime() {
  const window = {};
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
    'data/catalog/2023-tyt-math-01-30.js',
    'data/catalog/2023-tyt-geometry.js',
    'data/catalog/2024-tyt-math-01-30.js',
    'data/catalog/2024-tyt-geometry.js',
    'data/catalog/2025-tyt-math-01-30.js',
    'data/catalog/2025-tyt-geometry.js',
    'app-source-map-2023-tyt-math-geometry.js'
  ]) vm.runInContext(read(file), context, { filename: file });
  return window;
}

function rows() {
  return runtime().YKSQuestionCatalogV1.all().filter(row =>
    row.id?.startsWith('osym-2023-tyt-mat-') &&
    row.provider === 'OSYM' &&
    row.exam === 'TYT'
  );
}

test('2023 TYT mathematics integrates 40 official mapped ready questions', () => {
  const list = rows();

  assert.equal(list.length, 40);
  assert.equal(new Set(list.map(row => row.id)).size, 40);
  assert.ok(list.every(row => row.answerKey && row.answerVerified));
  assert.ok(list.every(row => row.access?.page && row.access?.url));
  assert.ok(list.every(row => row.asset?.status === 'ready' && row.asset?.crop));
  assert.ok(list.every(row => row.canonicalTopicId && row.mappingConfidence));
  assert.equal(list.filter(row => row.verification?.topic?.startsWith('needs-manual-review')).length, 0);

  const taxonomy = new Set(runtime().YKSTopicTaxonomyV1.all({
    exam: 'TYT',
    subjectId: 'matematik',
    active: true
  }).map(row => row.id));
  assert.ok(list.every(row => taxonomy.has(row.canonicalTopicId)));
  assert.ok(list.filter(row => Number(row.questionNo) >= 31).every(row =>
    row.verification?.domain === 'GEOMETRI'
  ));
});

test('2023 readiness A/B/C buckets are deterministic', () => {
  const list = rows();
  const A = list.filter(row => row.asset?.status === 'ready' && row.asset?.crop &&
    row.answerKey && row.answerVerified && row.canonicalTopicId).length;
  const B = list.filter(row => row.asset?.status === 'preparable').length;
  const C = list.filter(row => !row.asset?.status || row.verification?.topic?.startsWith('needs-manual-review')).length;
  assert.deepEqual({ A, B, C }, { A: 40, B: 0, C: 0 });
});

test('2023 identities do not duplicate existing official question identities', () => {
  const all = runtime().YKSQuestionCatalogV1.all().filter(row =>
    row.provider === 'OSYM' && row.exam === 'TYT' && row.id
  );
  const list = rows();
  const existingIds = new Set(all.filter(row => Number(row.year) !== 2023).map(row => row.id));
  assert.equal(list.filter(row => existingIds.has(row.id)).length, 0);

  const questionIdentity = row => [row.provider, row.exam, row.year, row.subject, row.questionNo].join('|');
  const sourceIdentity = row => [row.provider, row.exam, row.year, row.access?.url, row.access?.page, row.questionNo].join('|');
  assert.equal(new Set(list.map(questionIdentity)).size, 40);
  assert.equal(new Set(list.map(sourceIdentity)).size, 40);
});
