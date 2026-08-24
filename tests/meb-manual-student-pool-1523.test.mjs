import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rows = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog/meb-manual-student-pool-1523.json'), 'utf8'));
const ready = rows.filter(x => x.status === 'student-ready' && x.answerVerified === true && x.manualCrop === true);
const pending = rows.filter(x => x.status === 'pending-official-answer-verification');

test('MEB manual pool package integrity', () => {
  assert.equal(rows.length, 1523);
  assert.equal(ready.length, 1289);
  assert.equal(pending.length, 234);
  assert.equal(new Set(rows.map(x => x.id)).size, rows.length);
  assert.equal(new Set(rows.map(x => x.sourceFingerprint)).size, rows.length);
  assert.equal(ready.filter(x => !x.answerKey).length, 0);
  assert.equal(pending.filter(x => x.answerKey !== null || x.answerVerified !== false).length, 0);
});

test('MEB manual pool assets exist in the public static-crop locations', () => {
  const dirs = {
    'MEB 3 Adım TYT Matematik': 'public/assets/meb-3-adim-tyt-math-v10-full',
    'MEB Dört Dörtlük TYT Matematik': 'public/assets/meb-dort-dortluk-tyt-math-v11',
    'MEB Dört Dörtlük TYT Matematik Konu Pekiştirme Testleri': 'public/assets/meb-dort-dortluk-tyt-math-v11'
  };
  for (const row of rows) {
    const dir = dirs[row.sourceSeries];
    assert.ok(dir, `unknown source series for ${row.id}`);
    assert.equal(fs.existsSync(path.join(root, dir, `${row.id}.jpg`)), true, row.id);
  }
});

test('student visibility is limited to ready verified manual MEB rows', () => {
  const visible = rows.filter(x => x.provider === 'MEB_OGM' && x.status === 'student-ready' && x.manualCrop === true && x.answerVerified === true);
  assert.equal(visible.length, 1289);
  assert.equal(rows.filter(x => x.status === 'pending-official-answer-verification').filter(x => visible.includes(x)).length, 0);
});
