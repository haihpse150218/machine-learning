import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from '../server.js';

let dir, server, base;
before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'sbsrv-'));
  await writeFile(join(dir, 'a.md'), '# A\n**Trạng thái:** 🟡 Đang học\n');
  server = createServer(dir);
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  await rm(dir, { recursive: true, force: true });
});

test('GET /api/notes', async () => {
  const res = await fetch(`${base}/api/notes`);
  assert.equal(res.status, 200);
  const { notes } = await res.json();
  assert.equal(notes[0].slug, 'a');
});

test('PUT then GET note', async () => {
  let res = await fetch(`${base}/api/note/a`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: '# A2\n' }),
  });
  assert.equal(res.status, 200);
  res = await fetch(`${base}/api/note/a`);
  const { content } = await res.json();
  assert.equal(content, '# A2\n');
});

test('PATCH status rewrites line', async () => {
  await fetch(`${base}/api/note/a`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: '# A\n**Trạng thái:** 🟡 Đang học\n' }),
  });
  const res = await fetch(`${base}/api/note/a/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: '✅' }),
  });
  assert.equal(res.status, 200);
  const raw = await readFile(join(dir, 'a.md'), 'utf8');
  assert.ok(raw.includes('**Trạng thái:** ✅'));
  assert.ok(!raw.includes('🟡'));
});

test('POST creates, 409 on dup', async () => {
  let res = await fetch(`${base}/api/note`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: 'new-note', title: 'New Note' }),
  });
  assert.equal(res.status, 201);
  res = await fetch(`${base}/api/note`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: 'new-note', title: 'X' }),
  });
  assert.equal(res.status, 409);
});

test('400 on bad slug', async () => {
  const res = await fetch(`${base}/api/note/..%2Fx`);
  assert.equal(res.status, 400);
});
