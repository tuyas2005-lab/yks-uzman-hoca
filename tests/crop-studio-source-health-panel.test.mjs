import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('source health panel is isolated below the working crop form',()=>{
  const source=fs.readFileSync('app-crop-studio.js','utf8');
  assert.ok(source.includes('function sourceHealthPanel(ts=[])'));
  assert.ok(source.includes('aria-label="Kaynak sağlığı"'));
  assert.ok(source.includes('${sourceHealthPanel(ts)}`;wire();}'));
  assert.ok(source.includes("root.dataset.cropReady='true'"));
  assert.ok(source.includes('  render();\n  const installPasteTarget='));
});
