import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNote } from '../lib/parse.js';

const daoHam = `# Đạo hàm (Derivative)

> Tóm tắt 1 câu: Đạo hàm đo **tốc độ thay đổi** của một hàm số.

**Ngày tạo:** 2026-06-14
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh A (Giải tích → Tối ưu) · #2 ← cần [[giai-tich]] · → kế tiếp [[gradient]]
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #toan
`;

test('parse title, summary, status', () => {
  const n = parseNote('dao-ham', daoHam);
  assert.equal(n.title, 'Đạo hàm (Derivative)');
  assert.match(n.summary, /tốc độ thay đổi/);
  assert.equal(n.status, '🟡');
});

test('parse branch, order, prev, next', () => {
  const n = parseNote('dao-ham', daoHam);
  assert.equal(n.branch, 'A');
  assert.equal(n.order, 2);
  assert.deepEqual(n.prev, ['giai-tich']);
  assert.deepEqual(n.next, ['gradient']);
});

test('links exclude SECOND_BRAIN and note', () => {
  const n = parseNote('dao-ham', daoHam);
  assert.ok(n.links.includes('giai-tich'));
  assert.ok(n.links.includes('gradient'));
  assert.ok(!n.links.includes('SECOND_BRAIN'));
  assert.ok(!n.links.includes('note'));
});

test('multiple prev joined by +, no next', () => {
  const pca = `# PCA
**Trạng thái:** 🟡 Đang học
**📖 Lộ trình:** Nhánh B (Đại số TT → PCA) · #3 ← cần [[ma-tran-hiep-phuong-sai]] + [[tri-rieng-vector-rieng]]
`;
  const n = parseNote('pca', pca);
  assert.equal(n.branch, 'B');
  assert.equal(n.order, 3);
  assert.deepEqual(n.prev, ['ma-tran-hiep-phuong-sai', 'tri-rieng-vector-rieng']);
  assert.deepEqual(n.next, []);
});

test('alias links and missing fields fallback', () => {
  const n = parseNote('x', '# Title only\nsome [[foo|Bar]] text');
  assert.equal(n.title, 'Title only');
  assert.equal(n.status, '⬜');
  assert.equal(n.branch, null);
  assert.equal(n.order, null);
  assert.deepEqual(n.links, ['foo']);
});
