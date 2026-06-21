import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assembleNote, buildRequest, buildSystemPrompt, parseNotesFromResponse, MODEL } from '../lib/import.js';
import { parseNote } from '../lib/parse.js';

test('assembleNote round-trips through parseNote', () => {
  const meta = {
    slug: 'linear-regression',
    title: 'Hồi quy tuyến tính',
    summary: 'Khớp một đường thẳng vào dữ liệu.',
    branch: 'E',
    order: 9,
    prev: ['loss-function', 'gradient-descent'],
    next: ['logistic-regression'],
    tags: ['ml', 'supervised'],
    body: '## 💡 Ý chính\n- Tìm đường thẳng.',
  };
  const md = assembleNote(meta, '2026-06-20');
  const n = parseNote(meta.slug, md);
  assert.equal(n.title, 'Hồi quy tuyến tính');
  assert.equal(n.status, '⬜');
  assert.equal(n.branch, 'E');
  assert.equal(n.order, 9);
  assert.deepEqual(n.prev, ['loss-function', 'gradient-descent']);
  assert.deepEqual(n.next, ['logistic-regression']);
  assert.ok(md.includes('**Tags:** #ml #supervised'));
});

test('assembleNote handles missing branch/order/prev/next', () => {
  const md = assembleNote({ title: 'X', summary: 'y', body: '-' }, '2026-06-20');
  const n = parseNote('x', md);
  assert.equal(n.branch, null);
  assert.equal(n.order, null);
  assert.deepEqual(n.prev, []);
  assert.deepEqual(n.next, []);
  assert.ok(md.includes('**Tags:** #ml'));
});

test('buildSystemPrompt lists existing notes', () => {
  const sys = buildSystemPrompt([{ slug: 'pca', title: 'PCA', branch: 'B', order: 3 }]);
  assert.ok(sys.includes('pca — PCA'));
  assert.ok(sys.includes('Nhánh B #3'));
});

test('buildRequest shapes a valid messages.create payload', () => {
  const req = buildRequest({ dataBase64: 'QUJD', existingNotes: [] });
  assert.equal(req.model, MODEL);
  assert.equal(req.output_config.format.type, 'json_schema');
  const doc = req.messages[0].content[0];
  assert.equal(doc.type, 'document');
  assert.equal(doc.source.media_type, 'application/pdf');
  assert.equal(doc.source.data, 'QUJD');
});

test('parseNotesFromResponse extracts notes array', () => {
  const res = { content: [{ type: 'text', text: JSON.stringify({ notes: [{ slug: 'a' }] }) }] };
  assert.deepEqual(parseNotesFromResponse(res), [{ slug: 'a' }]);
});

test('parseNotesFromResponse throws on bad shape', () => {
  assert.throws(() => parseNotesFromResponse({ content: [{ type: 'text', text: '{}' }] }));
});
