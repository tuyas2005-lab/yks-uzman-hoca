import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const parseCsv = file => {
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
};

test('Gemini HIGH-only remap is exact and preserves pool invariants', () => {
  const manifest = parseCsv('meb-topic-remap-high-only.csv');
  const catalog = JSON.parse(fs.readFileSync('data/catalog/meb-manual-student-pool-1523.json', 'utf8'));
  assert.equal(manifest.length, 358);
  assert.equal(new Set(manifest.map(row => row.questionId)).size, 358);
  assert.ok(manifest.every(row => row.confidence === 'HIGH' && row.status === 'REMAP'));
  const byId = new Map(manifest.map(row => [row.questionId, row]));
  assert.ok(manifest.every(row => catalog.some(item => item.id === row.questionId)));
  assert.equal(catalog.length, 1523);
  assert.equal(catalog.filter(row => row.status === 'student-ready').length, 1289);
  assert.equal(catalog.filter(row => row.status !== 'student-ready').length, 234);
  const equations = catalog.filter(row => row.topic === 'Denklemler ve Eşitsizlikler');
  assert.equal(equations.length, 110);
  assert.equal(equations.filter(row => row.status === 'student-ready').length, 65);
  assert.equal(equations.filter(row => row.status !== 'student-ready').length, 45);
  const counts = Object.fromEntries([...new Set(manifest.map(row => row.proposedTopic))].map(topic => [topic, manifest.filter(row => row.proposedTopic === topic).length]));
  assert.deepEqual(counts, {'Temel Kavramlar / Sayı Kümeleri':52,'Bölme - Bölünebilme Kuralları':63,'Üslü İfadeler':81,'Problemler':162});
  assert.equal(catalog.filter(row => row.manualCrop === true && row.topic === 'Denklemler ve Eşitsizlikler').length, 110);
  assert.equal(new Set(catalog.map(row => row.id)).size, catalog.length);
  assert.ok(byId.size === 358);
});
