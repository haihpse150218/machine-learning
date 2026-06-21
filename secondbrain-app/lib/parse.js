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
  const summary = sumLine
    ? sumLine.replace(/^>\s+/, '').replace(/^Tóm tắt[^:]*:\s*/i, '').trim()
    : null;

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
