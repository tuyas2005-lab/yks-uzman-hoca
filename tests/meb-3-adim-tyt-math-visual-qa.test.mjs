import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = path.join(root, 'assets', 'meb-3-adim-tyt-math');
const rows = [
  ['ebob-1-01',43,60,120,590,500],['ebob-1-06',43,650,900,590,500],['ebob-2-05',45,650,850,590,500],['ebob-2-09',46,650,100,590,450],['ebob-3-01',47,60,100,590,500],['ebob-3-05',47,650,650,590,550],
  ['poly-1-01',139,60,210,590,500],['poly-1-05',139,650,210,590,470],['poly-2-06',140,60,100,590,350],['poly-2-10',140,650,100,590,390],['poly-3-02',143,60,600,590,550],['poly-3-07',144,650,600,590,550],
  ['fact-1-02',139,60,790,590,260],['fact-1-03',139,60,1040,590,620],['fact-2-03',141,650,100,590,500],['fact-2-15',142,650,500,590,550],['fact-3-01',143,60,100,590,500],['fact-3-06',144,60,1000,590,500],
  ['quad-1-02',145,60,100,590,500],['quad-1-08',146,60,900,590,600],['quad-2-07',148,60,100,590,550],['quad-2-12',148,650,900,590,650],['quad-3-01',149,60,100,590,500],['quad-3-07',149,650,900,590,650],
].map(([id, page, x, y, w, h]) => ({ id, page, bounds: { x, y, w, h }, complete: true, choices: true, previous: false, next: false, readable: true }));

test('all 24 MEB crops have completed visual QA and repository assets', () => {
  assert.equal(rows.length, 24);
  assert.equal(new Set(rows.map((r) => r.id)).size, 24);
  for (const row of rows) {
    assert.ok(row.complete && row.choices && !row.previous && !row.next && row.readable, row.id);
    const file = path.join(assetRoot, `${row.id}.jpg`);
    const stat = fs.statSync(file);
    assert.ok(stat.size > 0, row.id);
    assert.ok(row.bounds.x >= 0 && row.bounds.y >= 0 && row.bounds.w > 0 && row.bounds.h > 0, row.id);
    assert.ok(row.bounds.x + row.bounds.w <= 1272 && row.bounds.y + row.bounds.h <= 1800, row.id);
  }
});
