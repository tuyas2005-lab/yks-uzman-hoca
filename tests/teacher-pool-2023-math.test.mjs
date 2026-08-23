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
    'app-source-map-2023-tyt-math-geometry.js'
  ]) vm.runInContext(read(file), context, { filename: file });
  return window;
}

test('2023 TYT mathematics integrates 40 official mapped ready questions', () => {
  const window = runtime();
  const rows = window.YKSQuestionCatalogV1.all().filter(row =>
    row.id?.startsWith('osym-2023-tyt-mat-') && row.provider === 'OSYM' && row.exam === 'TYT'
  );

  assert.equal(rows.length, 40);
  assert.equal(new Set(rows.map(row => row.id)).size, 40);
  assert.ok(rows.every(row => row.answerKey && row.answerVerified));
  assert.ok(rows.every(row => row.access?.page && row.access?.url));
  assert.ok(rows.every(row => row.asset?.status === 'ready' && row.asset?.crop));
  assert.ok(rows.every(row => row.canonicalTopicId && row.mappingConfidence));
  assert.equal(rows.filter(row => row.verification?.topic?.startsWith('needs-manual-review')).length, 0);

  const taxonomy = new Set(window.YKSTopicTaxonomyV1.all({
    exam: 'TYT',
    subjectId: 'matematik',
    active: true
  }).map(row => row.id));
  assert.ok(rows.every(row => taxonomy.has(row.canonicalTopicId)));
  assert.ok(rows.filter(row => Number(row.questionNo) >= 31).every(row =>
    row.verification?.domain === 'GEOMETRI'
  ));
});

test('2023 readiness A/B/C buckets are deterministic', () => {
  const rows = runtime().YKSQuestionCatalogV1.all().filter(row =>
    row.id?.startsWith('osym-2023-tyt-mat-')
  );
  const A = rows.filter(row => row.asset?.status === 'ready' && row.asset?.crop &&
    row.answerKey && row.answerVerified && row.canonicalTopicId).length;
  const B = rows.filter(row => row.asset?.status === 'preparable').length;
  const C = rows.filter(row => !row.asset?.status || row.verification?.topic?.startsWith('needs-manual-review')).length;
  assert.deepEqual({ A, B, C }, { A: 40, B: 0, C: 0 });
});
