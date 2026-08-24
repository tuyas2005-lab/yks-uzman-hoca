import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const catalog = JSON.parse(fs.readFileSync('data/catalog/meb-manual-student-pool-1523.json', 'utf8'));
const verified = JSON.parse(fs.readFileSync('meb-dort-dortluk-cozumlu-234-verified.json', 'utf8'));
const review = JSON.parse(fs.readFileSync('meb-dort-dortluk-manual-review-required.json', 'utf8'));

test('Dört Dörtlük answer verification merge preserves topics and exposes only 1521 ready records', () => {
  assert.equal(verified.length, 234);
  assert.equal(review.length, 2);
  assert.equal(new Set(verified.map(row => row.id)).size, 234);
  assert.equal(verified.filter(row => row.answerVerified === true && row.status === 'student-ready' && /^[A-E]$/.test(row.answerKey)).length, 232);
  assert.equal(catalog.length, 1523);
  assert.equal(catalog.filter(row => row.status === 'student-ready').length, 1521);
  assert.equal(catalog.filter(row => row.status !== 'student-ready').length, 2);
  assert.equal(catalog.filter(row => row.status === 'student-ready').length + catalog.filter(row => row.status !== 'student-ready').length, 1523);
  assert.equal(catalog.filter(row => row.status === 'student-ready' && (!row.answerVerified || !/^[A-E]$/.test(row.answerKey))).length, 0);
  for (const row of review) {
    const current = catalog.find(item => item.id === row.id);
    assert.ok(current);
    assert.equal(current.answerVerified, false);
    assert.equal(current.answerKey, null);
    assert.notEqual(current.status, 'student-ready');
  }
  assert.equal(new Set(catalog.map(row => row.id)).size, catalog.length);
});
