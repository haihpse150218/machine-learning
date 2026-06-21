# Second Brain App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một web app local đọc/ghi thẳng các note markdown trong `D:\MSA-FPT\Machine learning`, để học ML theo đúng thứ tự slide: visualize graph phụ thuộc, theo dõi tiến độ, và sửa/tạo note ngay trong app.

**Architecture:** Một Node HTTP server không framework (`server.js`) phục vụ (1) REST API đọc/ghi file `.md` ở thư mục cha, và (2) frontend tĩnh. Frontend là HTML/CSS/JS thuần (không build step) bố cục 3 cột — lộ trình đọc, graph, note viewer/editor. Thư viện graph (Cytoscape) và render markdown (marked) được vendor sẵn để chạy offline 100%.

**Tech Stack:** Node.js 22 (built-in `http`, `fs/promises`, `node:test`), Cytoscape.js (graph), marked.js (markdown→HTML), vanilla JS frontend.

## Global Constraints

- App nằm hoàn toàn trong `D:\MSA-FPT\Machine learning\secondbrain-app\`. KHÔNG tạo/sửa file ở thư mục notes ngoài việc đọc/ghi nội dung note qua API.
- `NOTES_DIR` = thư mục cha của app (`path.resolve(__dirname, '..')`). Chỉ quét file `.md` **ở tầng gốc** thư mục notes (không đệ quy vào `secondbrain-app/`, `slide/`, `.claude/`).
- Slug = tên file không có đuôi `.md` (ví dụ `dao-ham`). Mọi route nhận slug phải validate: chỉ cho phép `^[a-z0-9-]+$` (chống path traversal), file phải tồn tại với note đang đọc/sửa.
- Ghi file phải atomic: ghi ra `<file>.tmp` rồi `rename` đè lên file gốc. Giữ nguyên encoding UTF-8, không thêm BOM, dùng `\n` line endings.
- Status hợp lệ chỉ gồm 4 emoji: `⬜` (Chưa học), `🟡` (Đang học), `✅` (Đã nắm), `🔁` (Cần ôn).
- Port mặc định `5173`, cho phép override bằng env `PORT`.
- Không thêm dependency runtime nào ngoài `cytoscape` và `marked` (chỉ dùng để vendor file tĩnh; server chạy bằng built-in Node).

---

## File Structure

```
secondbrain-app/
├── server.js              # HTTP server: API + static file serving
├── lib/
│   ├── vault.js           # list/read/write/create file .md trong NOTES_DIR (an toàn path)
│   └── parse.js           # bóc metadata 1 note: title, status, branch, order, prev/next, links
├── test/
│   ├── parse.test.js      # unit test parser (node:test)
│   └── vault.test.js      # unit test vault trên thư mục tạm
├── public/
│   ├── index.html         # khung 3 cột
│   ├── style.css          # layout + theme
│   ├── app.js             # logic frontend: fetch API, render sidebar/graph/viewer/editor
│   └── vendor/
│       ├── cytoscape.min.js
│       └── marked.min.js
├── docs/
│   └── PLAN.md            # file này
├── package.json
└── README.md
```

**Trách nhiệm từng file:**
- `lib/vault.js` — mọi truy cập filesystem. Không biết gì về cấu trúc note, chỉ I/O + an toàn path.
- `lib/parse.js` — thuần hàm: nhận chuỗi markdown → object metadata. Không I/O. Dễ test.
- `server.js` — ghép vault + parse thành API, route, serve tĩnh. Mỏng.
- `public/app.js` — toàn bộ UI; chia hàm theo cột (sidebar / graph / viewer / editor).

---

## Task 1: Scaffold + vendor thư viện

**Files:**
- Create: `secondbrain-app/package.json`
- Create: `secondbrain-app/.gitignore`
- Create: `secondbrain-app/public/vendor/cytoscape.min.js` (copy từ node_modules)
- Create: `secondbrain-app/public/vendor/marked.min.js` (copy từ node_modules)

**Interfaces:**
- Produces: cấu trúc thư mục + 2 file vendor sẵn sàng cho frontend dùng qua `<script src="vendor/...">`.

- [ ] **Step 1: Tạo `package.json`**

```json
{
  "name": "secondbrain-app",
  "version": "0.1.0",
  "description": "Local web app to visualize & learn the ML second-brain notes in reading order",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "test": "node --test"
  },
  "devDependencies": {
    "cytoscape": "^3.30.0",
    "marked": "^14.0.0"
  }
}
```

- [ ] **Step 2: Tạo `.gitignore`**

```
node_modules/
*.tmp
```

- [ ] **Step 3: Cài deps (chỉ để vendor file tĩnh)**

Run (trong `secondbrain-app/`): `npm install`
Expected: thư mục `node_modules/cytoscape` và `node_modules/marked` xuất hiện.

- [ ] **Step 4: Copy build UMD vào public/vendor**

Run (PowerShell, trong `secondbrain-app/`):
```
New-Item -ItemType Directory -Force public/vendor
Copy-Item node_modules/cytoscape/dist/cytoscape.min.js public/vendor/cytoscape.min.js
Copy-Item node_modules/marked/marked.min.js public/vendor/marked.min.js
```
Expected: 2 file tồn tại trong `public/vendor/`. (Nếu đường dẫn dist khác theo version, tìm file `*.min.js` tương ứng trong node_modules và copy.)

- [ ] **Step 5: Commit**

```bash
git add secondbrain-app/package.json secondbrain-app/.gitignore secondbrain-app/public/vendor
git commit -m "chore: scaffold secondbrain-app + vendor cytoscape/marked"
```

---

## Task 2: `lib/parse.js` — bóc metadata từ markdown

**Files:**
- Create: `secondbrain-app/lib/parse.js`
- Test: `secondbrain-app/test/parse.test.js`

**Interfaces:**
- Produces: `export function parseNote(slug, raw) -> { slug, title, summary, status, branch, order, prev, next, links }`
  - `slug`: string (truyền vào)
  - `title`: string — text của heading `#` đầu tiên (bỏ dấu `#`), fallback = slug
  - `summary`: string|null — dòng `> Tóm tắt...` đầu tiên (bỏ `> `), nếu có
  - `status`: một trong `'⬜'|'🟡'|'✅'|'🔁'`, fallback `'⬜'`
  - `branch`: string|null — chữ cái sau `Nhánh ` (vd `'A'`), nếu có
  - `order`: number|null — số sau `#` trong dòng Lộ trình (vd `2`)
  - `prev`: string[] — slug trong phần `← cần [[..]]` (có thể nhiều, nối bằng `+`)
  - `next`: string[] — slug trong phần `→ kế tiếp [[..]]`
  - `links`: string[] — TẤT CẢ slug `[[..]]` xuất hiện trong note (đã unique, đã tách alias `[[slug|alias]]`→`slug`), loại bỏ `SECOND_BRAIN` và `note`
- Consumes: không.

- [ ] **Step 1: Viết test thất bại** — `test/parse.test.js`

```js
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
```

- [ ] **Step 2: Chạy test cho chắc nó FAIL**

Run (trong `secondbrain-app/`): `node --test test/parse.test.js`
Expected: FAIL — `Cannot find module '../lib/parse.js'`.

- [ ] **Step 3: Viết `lib/parse.js`**

```js
const STATUSES = ['⬜', '🟡', '✅', '🔁'];
const EXCLUDE_LINKS = new Set(['SECOND_BRAIN', 'note']);

// Lấy slug từ mọi [[slug]] hoặc [[slug|alias]] trong một đoạn text.
function extractLinks(text) {
  const out = [];
  const re = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1].trim());
  return out;
}

export function parseNote(slug, raw) {
  const text = raw.replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  // title: heading '#' đầu tiên
  const titleLine = lines.find((l) => /^#\s+/.test(l));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : slug;

  // summary: dòng '> Tóm tắt' hoặc blockquote đầu tiên
  const sumLine = lines.find((l) => /^>\s+/.test(l));
  const summary = sumLine ? sumLine.replace(/^>\s+/, '').replace(/^Tóm tắt[^:]*:\s*/i, '').trim() : null;

  // status: emoji trên dòng Trạng thái
  const statusLine = lines.find((l) => l.includes('Trạng thái')) || '';
  const status = STATUSES.find((s) => statusLine.includes(s)) || '⬜';

  // lộ trình: branch + order + prev + next
  const loTrinh = lines.find((l) => l.includes('Lộ trình')) || '';
  const branchM = loTrinh.match(/Nhánh\s+([A-Z])/);
  const branch = branchM ? branchM[1] : null;
  const orderM = loTrinh.match(/#(\d+)/);
  const order = orderM ? Number(orderM[1]) : null;

  // tách phần sau '← cần' (prev) và sau '→ kế tiếp' (next)
  // Bỏ phần trong ngoặc trước — tên nhánh có thể chứa '→' (vd "Giải tích → Tối ưu").
  const loTrinhClean = loTrinh.replace(/\([^)]*\)/g, '');
  let prev = [];
  let next = [];
  const arrowIdx = loTrinhClean.search(/←|→/);
  if (arrowIdx !== -1) {
    const tail = loTrinhClean.slice(arrowIdx);
    // next bắt đầu từ '→'
    const nextSplit = tail.split('→');
    const prevPart = nextSplit[0]; // phần từ '←' tới trước '→'
    const nextPart = nextSplit.slice(1).join('→');
    prev = extractLinks(prevPart);
    next = extractLinks(nextPart);
  }

  // tất cả links toàn note
  const links = [...new Set(extractLinks(text))].filter((s) => !EXCLUDE_LINKS.has(s));

  return { slug, title, summary, status, branch, order, prev, next, links };
}
```

- [ ] **Step 4: Chạy test PASS**

Run: `node --test test/parse.test.js`
Expected: PASS — tất cả test xanh.

- [ ] **Step 5: Commit**

```bash
git add secondbrain-app/lib/parse.js secondbrain-app/test/parse.test.js
git commit -m "feat: parse note metadata (title, status, reading-order, links)"
```

---

## Task 3: `lib/vault.js` — I/O an toàn trên thư mục notes

**Files:**
- Create: `secondbrain-app/lib/vault.js`
- Test: `secondbrain-app/test/vault.test.js`

**Interfaces:**
- Consumes: `parseNote` từ `./parse.js`.
- Produces:
  - `export function isValidSlug(slug) -> boolean` — true nếu khớp `^[a-z0-9-]+$`.
  - `export async function listNotes(dir) -> Array<metadata>` — đọc mọi `*.md` ở tầng gốc `dir` (bỏ qua thư mục con), parse từng cái, trả mảng metadata (như `parseNote` trả về). Bỏ qua file bắt đầu bằng `_` (template) khỏi danh sách chính nhưng KHÔNG lỗi nếu gặp.
  - `export async function readNote(dir, slug) -> string` — markdown thô. Throw `Error` có `.code='ENOENT'` nếu không có.
  - `export async function writeNote(dir, slug, content) -> void` — ghi atomic (`.tmp`→rename).
  - `export async function createNote(dir, slug, content) -> void` — như writeNote nhưng throw nếu file đã tồn tại (`.code='EEXIST'`).
- Lưu ý: mọi hàm nhận `slug` phải gọi `isValidSlug` trước, throw `Error` `.code='EINVAL'` nếu sai.

- [ ] **Step 1: Viết test thất bại** — `test/vault.test.js`

```js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
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
after(async () => { await rm(dir, { recursive: true, force: true }); });

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
```

- [ ] **Step 2: Chạy test cho chắc FAIL**

Run: `node --test test/vault.test.js`
Expected: FAIL — `Cannot find module '../lib/vault.js'`.

- [ ] **Step 3: Viết `lib/vault.js`**

```js
import { readdir, readFile, writeFile, rename, access } from 'node:fs/promises';
import { join } from 'node:path';
import { parseNote } from './parse.js';

export function isValidSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug);
}

function err(code, msg) {
  const e = new Error(msg);
  e.code = code;
  return e;
}

function ensureSlug(slug) {
  if (!isValidSlug(slug)) throw err('EINVAL', `Invalid slug: ${slug}`);
}

export async function listNotes(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.md')) continue;
    if (e.name.startsWith('_')) continue; // bỏ template
    const slug = e.name.slice(0, -3);
    if (!isValidSlug(slug)) continue; // bỏ qua tên lạ, không lỗi
    const raw = await readFile(join(dir, e.name), 'utf8');
    out.push(parseNote(slug, raw));
  }
  return out;
}

export async function readNote(dir, slug) {
  ensureSlug(slug);
  return readFile(join(dir, `${slug}.md`), 'utf8');
}

async function atomicWrite(dir, slug, content) {
  const target = join(dir, `${slug}.md`);
  const tmp = join(dir, `${slug}.md.tmp`);
  await writeFile(tmp, content, 'utf8');
  await rename(tmp, target);
}

export async function writeNote(dir, slug, content) {
  ensureSlug(slug);
  await atomicWrite(dir, slug, content);
}

export async function createNote(dir, slug, content) {
  ensureSlug(slug);
  try {
    await access(join(dir, `${slug}.md`));
    throw err('EEXIST', `Note already exists: ${slug}`);
  } catch (e) {
    if (e.code === 'EEXIST') throw e;
    // ENOENT = chưa tồn tại → OK để tạo
  }
  await atomicWrite(dir, slug, content);
}
```

- [ ] **Step 4: Chạy test PASS**

Run: `node --test test/vault.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add secondbrain-app/lib/vault.js secondbrain-app/test/vault.test.js
git commit -m "feat: vault I/O with safe slug + atomic writes"
```

---

## Task 4: `server.js` — HTTP API + static serving

**Files:**
- Create: `secondbrain-app/server.js`
- Test: `secondbrain-app/test/server.test.js`

**Interfaces:**
- Consumes: `listNotes/readNote/writeNote/createNote/isValidSlug` từ vault; `parseNote` không cần ở đây.
- Produces: `export function createServer(notesDir) -> http.Server` (chưa listen — để test gọi được). File cũng tự `listen` khi chạy trực tiếp (`node server.js`).
- API:
  - `GET /api/notes` → `200` JSON `{ notes: [...metadata] }`
  - `GET /api/note/:slug` → `200` JSON `{ slug, content }` · `404` nếu thiếu · `400` slug sai
  - `PUT /api/note/:slug` body `{ content }` → `200 { ok:true }` · ghi atomic
  - `PATCH /api/note/:slug/status` body `{ status }` → đọc note, thay emoji trên dòng `**Trạng thái:**`, ghi lại → `200 { ok:true, status }` · `400` nếu status không thuộc 4 giá trị
  - `POST /api/note` body `{ slug, title }` → tạo note mới từ template tối giản → `201 { ok:true, slug }` · `409` nếu trùng
  - Mọi route khác `GET` → serve file tĩnh trong `public/` (default `index.html`).

- [ ] **Step 1: Viết test thất bại** — `test/server.test.js`

```js
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
after(async () => { server.close(); await rm(dir, { recursive: true, force: true }); });

test('GET /api/notes', async () => {
  const res = await fetch(`${base}/api/notes`);
  assert.equal(res.status, 200);
  const { notes } = await res.json();
  assert.equal(notes[0].slug, 'a');
});

test('PUT then GET note', async () => {
  let res = await fetch(`${base}/api/note/a`, {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: '# A2\n' }),
  });
  assert.equal(res.status, 200);
  res = await fetch(`${base}/api/note/a`);
  const { content } = await res.json();
  assert.equal(content, '# A2\n');
});

test('PATCH status rewrites line', async () => {
  await fetch(`${base}/api/note/a`, {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: '# A\n**Trạng thái:** 🟡 Đang học\n' }),
  });
  const res = await fetch(`${base}/api/note/a/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: '✅' }),
  });
  assert.equal(res.status, 200);
  const raw = await readFile(join(dir, 'a.md'), 'utf8');
  assert.ok(raw.includes('**Trạng thái:** ✅'));
  assert.ok(!raw.includes('🟡'));
});

test('POST creates, 409 on dup', async () => {
  let res = await fetch(`${base}/api/note`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: 'new-note', title: 'New Note' }),
  });
  assert.equal(res.status, 201);
  res = await fetch(`${base}/api/note`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: 'new-note', title: 'X' }),
  });
  assert.equal(res.status, 409);
});

test('400 on bad slug', async () => {
  const res = await fetch(`${base}/api/note/..%2Fx`);
  assert.equal(res.status, 400);
});
```

- [ ] **Step 2: Chạy test cho chắc FAIL**

Run: `node --test test/server.test.js`
Expected: FAIL — `Cannot find module '../server.js'`.

- [ ] **Step 3: Viết `server.js`**

```js
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, normalize, extname } from 'node:path';
import { listNotes, readNote, writeNote, createNote, isValidSlug } from './lib/vault.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, 'public');
const STATUSES = ['⬜', '🟡', '✅', '🔁'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { return {}; }
}

const TEMPLATE = (title) => `# ${title}

> Tóm tắt 1 câu: ...

**Ngày tạo:** (điền)
**Trạng thái:** ⬜ Chưa học
**📖 Lộ trình:** Nhánh _ · #_
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** #ml

---

## 💡 Ý chính

-
`;

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = normalize(join(PUBLIC, urlPath));
  if (!filePath.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}

export function createServer(notesDir) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://x');
      const parts = url.pathname.split('/').filter(Boolean); // ['api','note','slug',...]

      // GET /api/notes
      if (req.method === 'GET' && url.pathname === '/api/notes') {
        return send(res, 200, { notes: await listNotes(notesDir) });
      }

      // POST /api/note
      if (req.method === 'POST' && url.pathname === '/api/note') {
        const { slug, title } = await readBody(req);
        if (!isValidSlug(slug)) return send(res, 400, { error: 'invalid slug' });
        try {
          await createNote(notesDir, slug, TEMPLATE(title || slug));
          return send(res, 201, { ok: true, slug });
        } catch (e) {
          if (e.code === 'EEXIST') return send(res, 409, { error: 'exists' });
          throw e;
        }
      }

      // /api/note/:slug  and  /api/note/:slug/status
      if (parts[0] === 'api' && parts[1] === 'note' && parts[2]) {
        const slug = parts[2];
        if (!isValidSlug(slug)) return send(res, 400, { error: 'invalid slug' });

        if (parts[3] === 'status' && req.method === 'PATCH') {
          const { status } = await readBody(req);
          if (!STATUSES.includes(status)) return send(res, 400, { error: 'bad status' });
          let raw;
          try { raw = await readNote(notesDir, slug); }
          catch { return send(res, 404, { error: 'not found' }); }
          const re = /(\*\*Trạng thái:\*\*\s*)(⬜|🟡|✅|🔁)?/;
          const next = re.test(raw)
            ? raw.replace(re, `$1${status}`)
            : raw.replace(/(# .*\n)/, `$1**Trạng thái:** ${status} \n`);
          await writeNote(notesDir, slug, next);
          return send(res, 200, { ok: true, status });
        }

        if (req.method === 'GET') {
          try { return send(res, 200, { slug, content: await readNote(notesDir, slug) }); }
          catch { return send(res, 404, { error: 'not found' }); }
        }

        if (req.method === 'PUT') {
          const { content } = await readBody(req);
          if (typeof content !== 'string') return send(res, 400, { error: 'no content' });
          await writeNote(notesDir, slug, content);
          return send(res, 200, { ok: true });
        }
      }

      // static
      if (req.method === 'GET') return serveStatic(req, res);
      send(res, 405, { error: 'method not allowed' });
    } catch (e) {
      send(res, 500, { error: String(e && e.message || e) });
    }
  });
}

// chạy trực tiếp
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const notesDir = resolve(__dirname, '..');
  const port = Number(process.env.PORT) || 5173;
  createServer(notesDir).listen(port, () => {
    console.log(`Second Brain App → http://localhost:${port}  (notes: ${notesDir})`);
  });
}
```

- [ ] **Step 4: Chạy test PASS**

Run: `node --test test/server.test.js`
Expected: PASS — 5 test xanh.

- [ ] **Step 5: Commit**

```bash
git add secondbrain-app/server.js secondbrain-app/test/server.test.js
git commit -m "feat: HTTP API for notes (list/read/write/status/create) + static serving"
```

---

## Task 5: Frontend khung 3 cột (`index.html` + `style.css`)

**Files:**
- Create: `secondbrain-app/public/index.html`
- Create: `secondbrain-app/public/style.css`

**Interfaces:**
- Produces: DOM với các id mà `app.js` (Task 6+) bám vào:
  - `#sidebar` (cột trái — lộ trình), `#graph` (cột giữa — cytoscape mount), `#viewer` (cột phải — render), `#editor` (textarea ẩn), `#btn-edit`, `#btn-save`, `#btn-new`, `#status-select`, `#note-title`.

- [ ] **Step 1: Viết `index.html`**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>🧠 Second Brain — ML</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header id="topbar">
    <span class="brand">🧠 Second Brain — Machine Learning</span>
    <button id="btn-new">＋ Note mới</button>
  </header>
  <main>
    <aside id="sidebar"><div class="loading">Đang tải…</div></aside>
    <section id="graph"></section>
    <section id="pane">
      <div id="pane-head">
        <h2 id="note-title">Chọn một note</h2>
        <div class="pane-actions">
          <select id="status-select" title="Trạng thái">
            <option value="⬜">⬜ Chưa học</option>
            <option value="🟡">🟡 Đang học</option>
            <option value="✅">✅ Đã nắm</option>
            <option value="🔁">🔁 Cần ôn</option>
          </select>
          <button id="btn-edit">✏️ Sửa</button>
          <button id="btn-save" hidden>💾 Lưu</button>
        </div>
      </div>
      <article id="viewer"></article>
      <textarea id="editor" hidden spellcheck="false"></textarea>
    </section>
  </main>
  <script src="vendor/cytoscape.min.js"></script>
  <script src="vendor/marked.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Viết `style.css`**

```css
:root {
  --bg:#1a1b26; --panel:#24283b; --ink:#c0caf5; --muted:#565f89;
  --accent:#7aa2f7; --green:#9ece6a; --yellow:#e0af68; --blue:#7dcfff; --gray:#414868;
}
* { box-sizing:border-box; }
body { margin:0; font-family:system-ui,Segoe UI,sans-serif; background:var(--bg); color:var(--ink); height:100vh; display:flex; flex-direction:column; }
#topbar { display:flex; align-items:center; justify-content:space-between; padding:.5rem 1rem; background:var(--panel); border-bottom:1px solid var(--gray); }
.brand { font-weight:600; }
button, select { background:var(--gray); color:var(--ink); border:1px solid var(--muted); border-radius:6px; padding:.35rem .7rem; cursor:pointer; }
button:hover { border-color:var(--accent); }
main { flex:1; display:grid; grid-template-columns:300px 1fr 1.2fr; min-height:0; }
#sidebar { overflow-y:auto; border-right:1px solid var(--gray); padding:.5rem; }
#graph { border-right:1px solid var(--gray); min-height:0; }
#pane { display:flex; flex-direction:column; min-height:0; }
#pane-head { display:flex; align-items:center; justify-content:space-between; gap:.5rem; padding:.5rem 1rem; border-bottom:1px solid var(--gray); }
#pane-head h2 { font-size:1rem; margin:0; }
.pane-actions { display:flex; gap:.4rem; }
#viewer { overflow-y:auto; padding:1rem 1.5rem; line-height:1.6; }
#viewer h1 { font-size:1.4rem; } #viewer h2 { font-size:1.1rem; color:var(--accent); }
#viewer code { background:#000; padding:.1rem .3rem; border-radius:4px; }
#viewer a.wikilink { color:var(--blue); cursor:pointer; text-decoration:none; border-bottom:1px dashed var(--blue); }
#editor { flex:1; resize:none; background:#16161e; color:var(--ink); border:none; padding:1rem 1.5rem; font-family:ui-monospace,Consolas,monospace; font-size:.9rem; line-height:1.5; }
.branch-group { margin-bottom:1rem; }
.branch-group h3 { font-size:.8rem; color:var(--muted); margin:.5rem 0 .3rem; text-transform:uppercase; }
.branch-bar { height:4px; background:var(--gray); border-radius:2px; overflow:hidden; margin-bottom:.4rem; }
.branch-bar > i { display:block; height:100%; background:var(--green); }
.note-item { display:flex; gap:.4rem; align-items:center; padding:.25rem .4rem; border-radius:5px; cursor:pointer; font-size:.85rem; }
.note-item:hover { background:var(--gray); }
.note-item.active { background:var(--accent); color:#1a1b26; }
.note-item .ord { color:var(--muted); width:1.2rem; text-align:right; }
.loading { color:var(--muted); padding:1rem; }
```

- [ ] **Step 3: Verify thủ công**

Run (trong `secondbrain-app/`): `node server.js` rồi mở `http://localhost:5173`.
Expected: thấy topbar + 3 cột (sidebar "Đang tải…", graph trống, pane "Chọn một note"). Chưa có dữ liệu là đúng (app.js chưa viết). Tắt server (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add secondbrain-app/public/index.html secondbrain-app/public/style.css
git commit -m "feat: frontend 3-column shell"
```

---

## Task 6: `app.js` — tải dữ liệu + sidebar lộ trình + tiến độ

**Files:**
- Create: `secondbrain-app/public/app.js`

**Interfaces:**
- Consumes: API `GET /api/notes`. DOM id từ Task 5.
- Produces (biến/hàm module-level dùng ở task sau):
  - `state.notes` (Array metadata), `state.bySlug` (Map slug→metadata), `state.current` (slug|null)
  - `async function loadNotes()` — fetch + dựng `state` + gọi `renderSidebar()` + (Task 7) `renderGraph()`.
  - `function renderSidebar()` — nhóm theo branch, sắp xếp theo order, vẽ progress bar, gắn click → `openNote(slug)`.
  - `async function openNote(slug)` — stub ở task này (chỉ set active + log); Task 8 sẽ hoàn thiện.

- [ ] **Step 1: Viết `app.js`**

```js
const BRANCH_NAMES = {
  A: 'Nhánh A · Giải tích → Tối ưu',
  B: 'Nhánh B · Đại số TT → PCA',
  C: 'Nhánh C · Xác suất → Thống kê',
  D: 'Nhánh D · Xử lý dữ liệu',
  E: 'Nhánh E · Thuật toán & Mô hình',
  F: 'Nhánh F · Nhập môn ML/DL/GenAI',
};
const DONE = new Set(['✅']);

const state = { notes: [], bySlug: new Map(), current: null };

const $ = (sel) => document.querySelector(sel);

async function loadNotes() {
  const res = await fetch('/api/notes');
  const { notes } = await res.json();
  state.notes = notes;
  state.bySlug = new Map(notes.map((n) => [n.slug, n]));
  renderSidebar();
  if (window.renderGraph) window.renderGraph();
}

function renderSidebar() {
  const el = $('#sidebar');
  el.innerHTML = '';
  // nhóm theo branch
  const groups = {};
  const noBranch = [];
  for (const n of state.notes) {
    if (n.branch) (groups[n.branch] ||= []).push(n);
    else noBranch.push(n);
  }
  const order = Object.keys(BRANCH_NAMES).filter((b) => groups[b]);
  for (const b of order) {
    const items = groups[b].sort((x, y) => (x.order ?? 99) - (y.order ?? 99));
    const done = items.filter((n) => DONE.has(n.status)).length;
    const pct = Math.round((done / items.length) * 100);
    const g = document.createElement('div');
    g.className = 'branch-group';
    g.innerHTML = `<h3>${BRANCH_NAMES[b]} — ${done}/${items.length}</h3>
      <div class="branch-bar"><i style="width:${pct}%"></i></div>`;
    for (const n of items) g.appendChild(noteItem(n));
    el.appendChild(g);
  }
  if (noBranch.length) {
    const g = document.createElement('div');
    g.className = 'branch-group';
    g.innerHTML = `<h3>Khác</h3>`;
    for (const n of noBranch.sort((a, b) => a.title.localeCompare(b.title))) g.appendChild(noteItem(n));
    el.appendChild(g);
  }
}

function noteItem(n) {
  const d = document.createElement('div');
  d.className = 'note-item' + (n.slug === state.current ? ' active' : '');
  d.dataset.slug = n.slug;
  d.innerHTML = `<span class="ord">${n.order ?? ''}</span><span>${n.status}</span><span>${n.title}</span>`;
  d.onclick = () => openNote(n.slug);
  return d;
}

async function openNote(slug) {
  state.current = slug;
  document.querySelectorAll('.note-item').forEach((e) =>
    e.classList.toggle('active', e.dataset.slug === slug));
  console.log('open', slug); // Task 8 hoàn thiện
}

loadNotes();
```

- [ ] **Step 2: Verify thủ công**

Run: `node server.js`, mở `http://localhost:5173`.
Expected: sidebar hiện các Nhánh A–F với progress bar + danh sách note (số thứ tự, emoji status, tên). Click note → console log `open <slug>` và item sáng lên. Tắt server.

- [ ] **Step 3: Commit**

```bash
git add secondbrain-app/public/app.js
git commit -m "feat: load notes + reading-path sidebar with progress"
```

---

## Task 7: Graph view (Cytoscape) trong `app.js`

**Files:**
- Modify: `secondbrain-app/public/app.js` (thêm `renderGraph` + wiring)

**Interfaces:**
- Consumes: `state.notes`, `state.bySlug`, global `cytoscape`. Mount vào `#graph`.
- Produces: `window.renderGraph()` — vẽ node mỗi note (màu theo status), cạnh có hướng cho `prev→note` (dependency, nét liền) và `note→link` khác (nét mờ). Click node → `openNote(slug)`. Sau `openNote`, node hiện tại được highlight (Task 8 gọi `highlightGraph(slug)`).

- [ ] **Step 1: Thêm vào cuối `app.js` (trước dòng `loadNotes()`)**

```js
const STATUS_COLOR = { '⬜':'#565f89', '🟡':'#e0af68', '✅':'#9ece6a', '🔁':'#7dcfff' };
let cy = null;

window.renderGraph = function renderGraph() {
  const elements = [];
  for (const n of state.notes) {
    elements.push({ data: { id: n.slug, label: n.title, color: STATUS_COLOR[n.status] || '#565f89' } });
  }
  const seen = new Set(state.notes.map((n) => n.slug));
  for (const n of state.notes) {
    // dependency: prev -> n (nét liền, đậm)
    for (const p of n.prev) if (seen.has(p)) elements.push({ data: { id: `dep-${p}-${n.slug}`, source: p, target: n.slug, dep: 1 } });
    // liên kết khác (nét mờ) — bỏ những cái đã là prev/next để khỏi trùng
    const skip = new Set([...n.prev, ...n.next]);
    for (const l of n.links) if (seen.has(l) && l !== n.slug && !skip.has(l)) elements.push({ data: { id: `lnk-${n.slug}-${l}`, source: n.slug, target: l, dep: 0 } });
  }
  cy = cytoscape({
    container: document.getElementById('graph'),
    elements,
    style: [
      { selector: 'node', style: {
        'background-color': 'data(color)', label: 'data(label)',
        color: '#c0caf5', 'font-size': 8, 'text-wrap': 'wrap', 'text-max-width': 90,
        'text-valign': 'bottom', 'text-margin-y': 3, width: 16, height: 16 } },
      { selector: 'node.sel', style: { 'border-width': 3, 'border-color': '#7aa2f7', width: 22, height: 22 } },
      { selector: 'edge[dep = 1]', style: {
        width: 2, 'line-color': '#7aa2f7', 'target-arrow-color': '#7aa2f7',
        'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
      { selector: 'edge[dep = 0]', style: {
        width: 1, 'line-color': '#414868', 'line-style': 'dashed',
        'target-arrow-shape': 'none', 'curve-style': 'bezier', opacity: 0.5 } },
    ],
    layout: { name: 'cose', animate: false, nodeRepulsion: 8000, idealEdgeLength: 60, padding: 20 },
  });
  cy.on('tap', 'node', (e) => openNote(e.target.id()));
};

window.highlightGraph = function highlightGraph(slug) {
  if (!cy) return;
  cy.nodes().removeClass('sel');
  const node = cy.getElementById(slug);
  if (node) { node.addClass('sel'); cy.animate({ center: { eles: node } }, { duration: 200 }); }
};
```

- [ ] **Step 2: Gọi highlight trong `openNote`** — sửa hàm `openNote`, thêm vào cuối (trước `console.log`):

```js
  if (window.highlightGraph) window.highlightGraph(slug);
```

- [ ] **Step 3: Verify thủ công**

Run: `node server.js`, mở app.
Expected: cột giữa hiện graph — node màu theo status, mũi tên xanh = thứ tự đọc (prev→note), nét đứt mờ = liên kết khác. Click node → mở (sidebar item sáng) + node viền xanh, graph center về node. Kiểm vài cặp: `giai-tich → dao-ham → gradient` có mũi tên nối. Tắt server.

- [ ] **Step 4: Commit**

```bash
git add secondbrain-app/public/app.js
git commit -m "feat: cytoscape dependency graph with status colors + selection"
```

---

## Task 8: Note viewer — render markdown + wiki-link click được

**Files:**
- Modify: `secondbrain-app/public/app.js` (hoàn thiện `openNote`)

**Interfaces:**
- Consumes: `GET /api/note/:slug`, global `marked`, `state.bySlug`. DOM `#viewer #editor #note-title #status-select #btn-edit #btn-save`.
- Produces: `openNote` đầy đủ — fetch raw, render HTML, biến `[[slug]]` thành `<a class="wikilink" data-slug>` click mở note đó; set tiêu đề + status-select; lưu raw vào `state.raw` cho editor (Task 9).

- [ ] **Step 1: Thay toàn bộ hàm `openNote` bằng**

```js
async function openNote(slug) {
  const res = await fetch(`/api/note/${slug}`);
  if (!res.ok) return;
  const { content } = await res.json();
  state.current = slug;
  state.raw = content;

  const meta = state.bySlug.get(slug);
  $('#note-title').textContent = meta ? `${meta.status} ${meta.title}` : slug;
  if (meta) $('#status-select').value = meta.status;

  // render markdown, rồi thay [[slug]] / [[slug|alias]] thành link
  let html = marked.parse(content);
  html = html.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, s, alias) =>
    `<a class="wikilink" data-slug="${s.trim()}">${(alias || s).trim()}</a>`);
  const viewer = $('#viewer');
  viewer.innerHTML = html;
  viewer.querySelectorAll('a.wikilink').forEach((a) => {
    a.onclick = () => { const t = a.dataset.slug; if (state.bySlug.has(t)) openNote(t); };
  });

  // về chế độ xem
  $('#editor').hidden = true; $('#viewer').hidden = false;
  $('#btn-edit').hidden = false; $('#btn-save').hidden = true;

  document.querySelectorAll('.note-item').forEach((e) =>
    e.classList.toggle('active', e.dataset.slug === slug));
  if (window.highlightGraph) window.highlightGraph(slug);
}
```

- [ ] **Step 2: Verify thủ công**

Run: `node server.js`, mở app, click `dao-ham`.
Expected: cột phải render note đẹp (heading, bảng, code). Các `[[gradient]]`... thành link gạch chân — click mở note đó. Tiêu đề + status-select khớp. Tắt server.

- [ ] **Step 3: Commit**

```bash
git add secondbrain-app/public/app.js
git commit -m "feat: note viewer with rendered markdown + clickable wiki-links"
```

---

## Task 9: Editor — sửa/lưu nội dung + đổi status

**Files:**
- Modify: `secondbrain-app/public/app.js` (wiring nút Sửa/Lưu + status-select)

**Interfaces:**
- Consumes: `PUT /api/note/:slug` (lưu), `PATCH /api/note/:slug/status` (đổi status), `state.raw`, `state.current`.
- Produces: wiring sự kiện cho `#btn-edit`, `#btn-save`, `#status-select`. Sau khi lưu → `loadNotes()` để cập nhật sidebar/graph rồi mở lại note.

- [ ] **Step 1: Thêm vào cuối `app.js` (trước `loadNotes()`)**

```js
$('#btn-edit').onclick = () => {
  if (!state.current) return;
  $('#editor').value = state.raw || '';
  $('#viewer').hidden = true; $('#editor').hidden = false;
  $('#btn-edit').hidden = true; $('#btn-save').hidden = false;
  $('#editor').focus();
};

$('#btn-save').onclick = async () => {
  if (!state.current) return;
  const content = $('#editor').value;
  const res = await fetch(`/api/note/${state.current}`, {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) { alert('Lưu thất bại'); return; }
  const slug = state.current;
  await loadNotes();        // cập nhật metadata (title/status/links có thể đổi)
  await openNote(slug);     // mở lại ở chế độ xem
};

$('#status-select').onchange = async (e) => {
  if (!state.current) return;
  const status = e.target.value;
  const res = await fetch(`/api/note/${state.current}/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) { alert('Đổi status thất bại'); return; }
  const slug = state.current;
  await loadNotes();        // cập nhật màu graph + progress bar
  await openNote(slug);
};
```

- [ ] **Step 2: Verify thủ công**

Run: `node server.js`, mở note, bấm ✏️ Sửa → đổi text → 💾 Lưu.
Expected: nội dung mới render lại; mở file `.md` bằng editor khác thấy đã đổi. Đổi status-select sang ✅ → progress bar nhánh tăng, node graph đổi xanh lá. Tắt server.

- [ ] **Step 3: Commit**

```bash
git add secondbrain-app/public/app.js
git commit -m "feat: edit/save note content + quick status change"
```

---

## Task 10: Tạo note mới (nút ＋)

**Files:**
- Modify: `secondbrain-app/public/app.js` (wiring `#btn-new`)

**Interfaces:**
- Consumes: `POST /api/note`. Produces: prompt nhập tên → slug hoá → tạo → mở.

- [ ] **Step 1: Thêm vào `app.js` (trước `loadNotes()`)**

```js
function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

$('#btn-new').onclick = async () => {
  const title = prompt('Tên note mới:');
  if (!title) return;
  const slug = slugify(title);
  if (!slug) { alert('Tên không hợp lệ'); return; }
  const res = await fetch('/api/note', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug, title }),
  });
  if (res.status === 409) { alert('Note đã tồn tại: ' + slug); return; }
  if (!res.ok) { alert('Tạo thất bại'); return; }
  await loadNotes();
  await openNote(slug);
  $('#btn-edit').click(); // mở luôn editor để điền nội dung
};
```

- [ ] **Step 2: Verify thủ công**

Run: `node server.js`, bấm ＋ Note mới → nhập "Test KNN".
Expected: tạo file `test-knn.md`, mở ở chế độ editor với template. Xuất hiện trong sidebar nhóm "Khác" (chưa có nhánh). Xoá file test sau khi kiểm (`Remove-Item ../test-knn.md`). Tắt server.

- [ ] **Step 3: Commit**

```bash
git add secondbrain-app/public/app.js
git commit -m "feat: create new note from title"
```

---

## Task 11: README + chạy

**Files:**
- Create: `secondbrain-app/README.md`

- [ ] **Step 1: Viết `README.md`**

```markdown
# 🧠 Second Brain App

Web app local để học các note Machine Learning theo đúng thứ tự lộ trình:
visualize graph phụ thuộc, theo dõi tiến độ, sửa/tạo note ngay trong app.
Đọc/ghi thẳng các file `.md` ở thư mục cha → Obsidian/git vẫn dùng song song.

## Chạy
```
cd secondbrain-app
npm install        # chỉ lần đầu (để vendor cytoscape/marked)
npm start          # → http://localhost:5173
```

## Test
```
npm test
```

## Cấu trúc
- `server.js` — HTTP API + serve frontend
- `lib/parse.js` — bóc metadata note · `lib/vault.js` — I/O file
- `public/` — frontend (3 cột: lộ trình · graph · viewer/editor)

Notes nằm ở thư mục cha; app KHÔNG sửa gì ngoài nội dung note bạn chỉnh trong app.
```

- [ ] **Step 2: Chạy full test suite**

Run (trong `secondbrain-app/`): `npm test`
Expected: tất cả test của parse/vault/server PASS.

- [ ] **Step 3: Commit**

```bash
git add secondbrain-app/README.md
git commit -m "docs: README for secondbrain-app"
```

---

## Self-Review Notes

- **Spec coverage:** Graph (T7) · Reading-path sidebar + progress (T6) · Viewer render markdown + wiki-link (T8) · Editor sửa/lưu (T9) · Status đổi nhanh (T9) · Tạo note (T10) · API đầy đủ (T4) · Parser metadata (T2) · I/O an toàn atomic (T3) · Offline vendor (T1). ✅ phủ hết thiết kế.
- **Path safety:** slug whitelist `^[a-z0-9-]+$` ở cả vault và server; static serving chặn thoát khỏi `public/`. ✅
- **Type consistency:** metadata shape (`slug,title,summary,status,branch,order,prev,next,links`) thống nhất giữa `parseNote` → `listNotes` → `/api/notes` → frontend `state`. ✅
- **Lưu ý vận hành:** `git` ở thư mục notes hiện không phải repo (environment cho biết "Is a git repository: false"). Nếu chưa `git init`, các bước commit sẽ fail — khi đó hỏi user có muốn `git init` trong `D:\MSA-FPT\Machine learning` hay bỏ qua bước commit.

## Post-review hardening (đã áp dụng sau khi build + review 2 agent)

- **parse.js:** dòng Lộ trình có thể chứa `→` trong tên nhánh (vd "Giải tích → Tối ưu") → bỏ phần `(...)` trước khi tách prev/next. (Đã sửa, có test phủ.)
- **server.js `serveStatic`:** đổi `startsWith(PUBLIC)` → `filePath === PUBLIC || startsWith(PUBLIC + sep)` để chặn rò sang thư mục anh em (vd `publicX`).
- **vault.js `isValidSlug`:** thêm blocklist tên thiết bị Windows (`con`, `nul`, `com1`…) để tránh I/O treo.
- **app.js `renderGraph`:** `cy.destroy()` trước khi vẽ lại (tránh leak Cytoscape mỗi lần lưu/đổi status) + guard `|| []` cho `prev/next/links`.
