import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const loader = fs.readFileSync(new URL('../app-home-links.js', import.meta.url), 'utf8');
const startup = fs.readFileSync(new URL('../app-counselor.js', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../service-worker.js', import.meta.url), 'utf8');

function groupJobs(name) {
  const start = loader.indexOf(`groups.${name}=makeGroup`);
  assert.notEqual(start, -1, `${name} group must exist`);
  const next = loader.indexOf('\n  groups.', start + 1);
  return loader.slice(start, next === -1 ? loader.length : next);
}

test('Teacher loads the shared Strategy Engine before policy v3', () => {
  const teacher = groupJobs('teacher');
  const strategy = teacher.indexOf("loadScript('/app-strategy-engine.js?v=3')");
  const policy = teacher.indexOf("loadScript('/app-personal-teacher-policy-v3.js?v=12')");

  assert.notEqual(strategy, -1, 'Teacher must load Strategy Engine directly');
  assert.notEqual(policy, -1, 'Teacher policy v3 must remain in the Teacher group');
  assert.ok(strategy < policy, 'Strategy Engine must be ready before policy v3 installs');
});

test('Coach keeps using the same Strategy Engine URL for loader dedupe', () => {
  const coach = groupJobs('coach');
  assert.match(coach, /loadScript\('\/app-strategy-engine\.js\?v=3'\)/);
  assert.equal(
    loader.match(/loadScript\('\/app-strategy-engine\.js\?v=3'\)/g)?.length,
    2,
    'Teacher and Coach should request one identical URL so the shared loader evaluates it once'
  );
});

test('Startup and service worker use the new loader cache key', () => {
  assert.match(startup, /\/app-home-links\.js\?v=22/);
  assert.doesNotMatch(startup, /\/app-home-links\.js\?v=21/);
  assert.match(serviceWorker, /\/app-home-links\.js\?v=22/);
  assert.match(startup, /\/app-teacher-pilot-v1\.js\?v=9/);
  assert.match(serviceWorker, /\/app-teacher-pilot-v1\.js\?v=9/);
  assert.match(serviceWorker, /\/app-personal-teacher-source-launch-v3\.js\?v=9/);
  assert.match(serviceWorker, /r48-device-acceptance/);
});
