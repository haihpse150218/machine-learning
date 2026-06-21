import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isValidSlug, listNotes, readNote, writeNote, createNote } from '../lib/vault.js';

let dir;
before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'sb-'));
  await writeFile(join(dir, 'a.md'), '# A\n**Trạng thái:** 🟡 Đang học\n**📖 Lộ trình:** Nhánh A · #1\n');
  await writeFile(join(dir, 'b.md'), '# B\n**Trạng thái:** ✅ Đã nắm\n');
  await writeFile(join(dir, '_TEMPLATE.md'), '# T\n');
});
after(async () => {
  await rm(dir, { recursive: true, force: true });
});

test('isValidSlug', () => {
  assert.equal(isValidSlug('dao-ham'), true);
  assert.equal(isValidSlug('../etc'), false);
  assert.equal(isValidSlug('a b'), false);
});

test('listNotes parses and skips template', async () => {
  const notes = await listNotes(dir);
  const slugs = notes.map((n) => n.slug).sort();
  assert.deepEqual(slugs, ['a', 'b']);
  const a = notes.find((n) => n.slug === 'a');
  assert.equal(a.status, '🟡');
  assert.equal(a.branch, 'A');
});

test('read / write round-trip', async () => {
  await writeNote(dir, 'a', '# A edited\n');
  assert.equal(await readNote(dir, 'a'), '# A edited\n');
});

test('createNote rejects existing', async () => {
  await assert.rejects(() => createNote(dir, 'a', 'x'), (e) => e.code === 'EEXIST');
  await createNote(dir, 'c', '# C\n');
  assert.equal(await readNote(dir, 'c'), '# C\n');
});

test('invalid slug rejected', async () => {
  await assert.rejects(() => readNote(dir, '../x'), (e) => e.code === 'EINVAL');
});
