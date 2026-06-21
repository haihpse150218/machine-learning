import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from '../server.js';

let dir, server, base;
before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'sbimp-'));
  server = createServer(dir);
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  await rm(dir, { recursive: true, force: true });
});

test('import-slide without API key → 400', async () => {
  const saved = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    const res = await fetch(`${base}/api/import-slide`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ dataBase64: 'QUJD' }),
    });
    assert.equal(res.status, 400);
    const { error } = await res.json();
    assert.match(error, /ANTHROPIC_API_KEY/);
  } finally {
    if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
  }
});

test('import-save assembles + creates files, reports skipped', async () => {
  const notes = [
    { slug: 'test-knn', title: 'KNN', summary: 'hàng xóm gần nhất', branch: 'E', order: 9, prev: ['svm'], next: [], tags: ['ml'], body: '## 💡 Ý chính\n- gần ai thì giống nấy' },
    { slug: 'Bad Slug', title: 'X', summary: 'y', branch: '', order: 0, prev: [], next: [], tags: [], body: '-' },
  ];
  const res = await fetch(`${base}/api/import-save`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  assert.equal(res.status, 200);
  const { saved, skipped } = await res.json();
  assert.deepEqual(saved, ['test-knn']);
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].slug, 'Bad Slug');

  const raw = await readFile(join(dir, 'test-knn.md'), 'utf8');
  assert.ok(raw.includes('# KNN'));
  assert.ok(raw.includes('Nhánh E · #9 ← cần [[svm]]'));
  assert.ok(raw.includes('⬜ Chưa học'));
});

test('import-save reports duplicate as skipped', async () => {
  const notes = [{ slug: 'test-knn', title: 'KNN dup', summary: 's', branch: '', order: 0, prev: [], next: [], tags: [], body: '-' }];
  const res = await fetch(`${base}/api/import-save`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  const { saved, skipped } = await res.json();
  assert.deepEqual(saved, []);
  assert.equal(skipped[0].reason, 'đã tồn tại');
});
