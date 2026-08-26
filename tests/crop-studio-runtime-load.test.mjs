import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('crop studio reloads after its screen root is available',()=>{
  const links=fs.readFileSync('app-home-links.js','utf8');
  const counselor=fs.readFileSync('app-counselor.js','utf8');
  const worker=fs.readFileSync('service-worker.js','utf8');
  assert.match(links,/loadScript\('\/app-crop-studio\.js\?v=4'\)/);
  assert.match(counselor,/app-home-links\.js\?v=42/);
  assert.match(worker,/app-home-links\.js\?v=42/);
});
