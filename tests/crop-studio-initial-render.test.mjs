import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('crop studio performs its initial render before installing paste handlers',()=>{
  const source=fs.readFileSync('app-crop-studio.js','utf8');
  const call=source.indexOf('  render();\n  const installPasteTarget=');
  assert.ok(call>0,'initial render call must exist immediately before paste target setup');
  assert.match(source,/root\.dataset\.cropReady='true'/);
});
