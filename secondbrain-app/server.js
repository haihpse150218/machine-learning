import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, normalize, extname, sep } from 'node:path';
import { listNotes, readNote, writeNote, createNote, isValidSlug } from './lib/vault.js';
import { importSlide, assembleNote } from './lib/import.js';

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
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
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
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
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
  if (filePath !== PUBLIC && !filePath.startsWith(PUBLIC + sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      'content-type': MIME[extname(filePath)] || 'application/octet-stream',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
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

      // POST /api/import-slide  { dataBase64 } -> { notes } (gọi Claude đọc PDF)
      if (req.method === 'POST' && url.pathname === '/api/import-slide') {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return send(res, 400, { error: 'Chưa đặt biến môi trường ANTHROPIC_API_KEY' });
        const { dataBase64 } = await readBody(req);
        if (!dataBase64 || typeof dataBase64 !== 'string') return send(res, 400, { error: 'thiếu dataBase64' });
        const existingNotes = await listNotes(notesDir);
        const notes = await importSlide({ dataBase64, existingNotes, apiKey });
        return send(res, 200, { notes });
      }

      // POST /api/import-save  { notes: [meta] } -> { saved, skipped }
      if (req.method === 'POST' && url.pathname === '/api/import-save') {
        const { notes } = await readBody(req);
        if (!Array.isArray(notes)) return send(res, 400, { error: 'thiếu notes' });
        const date = new Date().toISOString().slice(0, 10);
        const saved = [];
        const skipped = [];
        for (const meta of notes) {
          if (!isValidSlug(meta.slug)) {
            skipped.push({ slug: meta.slug, reason: 'slug không hợp lệ' });
            continue;
          }
          try {
            await createNote(notesDir, meta.slug, assembleNote(meta, date));
            saved.push(meta.slug);
          } catch (e) {
            skipped.push({ slug: meta.slug, reason: e.code === 'EEXIST' ? 'đã tồn tại' : String(e.message || e) });
          }
        }
        return send(res, 200, { saved, skipped });
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
          try {
            raw = await readNote(notesDir, slug);
          } catch {
            return send(res, 404, { error: 'not found' });
          }
          const re = /(\*\*Trạng thái:\*\*\s*)(⬜|🟡|✅|🔁)?/;
          const next = re.test(raw)
            ? raw.replace(re, `$1${status}`)
            : raw.replace(/(# .*\n)/, `$1**Trạng thái:** ${status} \n`);
          await writeNote(notesDir, slug, next);
          return send(res, 200, { ok: true, status });
        }

        if (req.method === 'GET') {
          try {
            return send(res, 200, { slug, content: await readNote(notesDir, slug) });
          } catch {
            return send(res, 404, { error: 'not found' });
          }
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
      send(res, 500, { error: String((e && e.message) || e) });
    }
  });
}

// chạy trực tiếp
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // notes nằm ở ../note (có thể đổi qua biến môi trường NOTES_DIR)
  const notesDir = process.env.NOTES_DIR
    ? resolve(process.env.NOTES_DIR)
    : resolve(__dirname, '..', 'note');
  const port = Number(process.env.PORT) || 5173;
  createServer(notesDir).listen(port, () => {
    console.log(`Second Brain App → http://localhost:${port}  (notes: ${notesDir})`);
  });
}
