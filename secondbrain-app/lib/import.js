import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-opus-4-8';

// JSON schema ép Claude trả về đúng cấu trúc atomic-note.
export const NOTES_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          slug: { type: 'string', description: 'kebab-case, chỉ a-z 0-9 và dấu -' },
          title: { type: 'string' },
          summary: { type: 'string', description: 'tóm tắt 1 câu, dễ hiểu' },
          branch: { type: 'string', description: 'một chữ cái A–F của nhánh phù hợp, hoặc "" nếu chưa rõ' },
          order: { type: 'integer', description: 'thứ tự đọc trong nhánh; 0 nếu chưa rõ' },
          prev: { type: 'array', items: { type: 'string' }, description: 'slug các note tiền đề (ưu tiên note đã có)' },
          next: { type: 'array', items: { type: 'string' }, description: 'slug các note học tiếp' },
          tags: { type: 'array', items: { type: 'string' } },
          body: { type: 'string', description: 'phần thân note bằng markdown, theo các mục: Ý chính, Trực giác/Ví dụ, Công thức, Khi nào dùng, Lỗi thường gặp' },
        },
        required: ['slug', 'title', 'summary', 'branch', 'order', 'prev', 'next', 'tags', 'body'],
      },
    },
  },
  required: ['notes'],
};

const BRANCHES = `A: Giải tích → Tối ưu hóa
B: Đại số tuyến tính → Giảm chiều (PCA)
C: Xác suất → Thống kê
D: Xử lý dữ liệu (lớp thực hành, 90% công việc)
E: Thuật toán & Mô hình
F: Nhập môn ML / DL / GenAI`;

export function buildSystemPrompt(existingNotes) {
  const list = existingNotes
    .map((n) => `- ${n.slug} — ${n.title}${n.branch ? ` (Nhánh ${n.branch} #${n.order ?? '?'})` : ''}`)
    .join('\n');
  return `Bạn là trợ lý xây dựng "Second Brain" học Machine Learning bằng tiếng Việt, theo phong cách Obsidian atomic note.

Nhiệm vụ: đọc slide PDF được cung cấp và tách thành các ATOMIC NOTE — mỗi note chỉ 1 khái niệm duy nhất, viết bằng tiếng Việt dễ hiểu cho người mới.

Các nhánh học (branch) hiện có:
${BRANCHES}

Các note ĐÃ CÓ trong brain (đừng tạo trùng; hãy LINK tới chúng qua prev/next/body khi liên quan):
${list || '(chưa có note nào)'}

Quy tắc:
- slug: kebab-case không dấu (vd "linear-regression"), chỉ gồm a-z, 0-9, dấu "-". KHÔNG trùng slug đã có.
- Mỗi note gắn đúng "branch" (A–F) và "order" theo thứ tự phụ thuộc. Nếu là phần tiếp nối kiến thức đã có, đặt "prev" trỏ tới slug note đã có đó.
- "prev"/"next" chỉ chứa slug (ưu tiên slug đã có trong danh sách trên; có thể trỏ tới slug của note mới khác trong cùng lần này).
- "body": markdown, viết bằng LỜI MÌNH (không chép nguyên xi slide), gồm các mục "## 💡 Ý chính", "## 🧩 Trực giác / Ví dụ", "## 🔢 Công thức / Định nghĩa" (nếu có), "## ⚙️ Khi nào dùng", "## ⚠️ Lỗi thường gặp". Dùng [[slug]] để link tới note liên quan.
- Tách vừa phải: gộp các ý quá nhỏ, nhưng đừng nhồi nhiều khái niệm vào 1 note.`;
}

// Tạo tham số gọi messages.create (tách riêng để test được mà không cần gọi mạng).
export function buildRequest({ dataBase64, existingNotes }) {
  return {
    model: MODEL,
    max_tokens: 16000,
    system: buildSystemPrompt(existingNotes),
    output_config: { format: { type: 'json_schema', schema: NOTES_SCHEMA } },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: dataBase64 } },
          { type: 'text', text: 'Đọc slide này và tách thành các atomic note theo schema. Trả về danh sách "notes".' },
        ],
      },
    ],
  };
}

// Lấy mảng note từ response (output_config.format trả JSON trong 1 text block).
export function parseNotesFromResponse(res) {
  const block = (res.content || []).find((b) => b.type === 'text');
  if (!block) throw new Error('Phản hồi không có nội dung text');
  let text = String(block.text).trim();
  // gỡ rào ```json ... ``` nếu model trả kèm (phòng khi structured-output bị bỏ qua)
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const obj = JSON.parse(text);
  if (!Array.isArray(obj.notes)) throw new Error('Phản hồi thiếu mảng "notes"');
  return obj.notes;
}

export async function importSlide({ dataBase64, existingNotes, apiKey }) {
  const client = new Anthropic({ apiKey });
  const res = await client.messages.create(buildRequest({ dataBase64, existingNotes }));
  return parseNotesFromResponse(res);
}

// Ráp 1 meta-note thành markdown đúng format template + breadcrumb.
export function assembleNote(meta, date) {
  const tags = (meta.tags || []).map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ') || '#ml';
  const linkList = (arr) => (arr || []).filter(Boolean).map((s) => `[[${s}]]`).join(' + ');
  const prev = linkList(meta.prev);
  const next = linkList(meta.next);
  const prevPart = prev ? ` ← cần ${prev}` : '';
  const nextPart = next ? ` · → kế tiếp ${next}` : '';
  const branch = meta.branch || '_';
  const order = meta.order ? meta.order : '_';
  const breadcrumb = `**📖 Lộ trình:** Nhánh ${branch} · #${order}${prevPart}${nextPart}`;
  return `# ${meta.title}

> Tóm tắt 1 câu: ${meta.summary || '...'}

**Ngày tạo:** ${date}
**Trạng thái:** ⬜ Chưa học
${breadcrumb}
**Chủ đề cha:** [[SECOND_BRAIN]] · [[note]]
**Tags:** ${tags}

---

${(meta.body || '').trim()}
`;
}
