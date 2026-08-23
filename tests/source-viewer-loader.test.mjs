import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../app-home-links.js', import.meta.url), 'utf8');

test('source viewer lazy-loader has a bounded script load', () => {
  assert.match(source, /SCRIPT_LOAD_TIMEOUT\s*=\s*8000/);
  assert.match(source, /Script load timeout:/);
  assert.match(source, /clearTimeout\(timer\)/);
});

test('source viewer and 2024-2025 source-map remain in the official loader chain', () => {
  assert.match(source, /app-source-question-viewer\.js\?v=5/);
  assert.match(source, /app-source-map-2024-2025-tyt\.js\?v=1/);
  assert.match(source, /app-question-index\.js\?v=1/);
});

