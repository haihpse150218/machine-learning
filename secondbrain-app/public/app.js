const BRANCH_NAMES = {
  A: 'Nhánh A · Giải tích → Tối ưu',
  B: 'Nhánh B · Đại số TT → PCA',
  C: 'Nhánh C · Xác suất → Thống kê',
  D: 'Nhánh D · Xử lý dữ liệu',
  E: 'Nhánh E · Thuật toán & Mô hình',
  F: 'Nhánh F · Nhập môn ML/DL/GenAI',
};
const DONE = new Set(['✅']);
const STATUS_COLOR = { '⬜': '#565f89', '🟡': '#e0af68', '✅': '#9ece6a', '🔁': '#7dcfff' };
// màu nhận diện từng nhánh (chỉ dùng cho khung làn + nhãn, không phải status)
const BRANCH_COLOR = { A: '#7aa2f7', B: '#bb9af7', C: '#f7768e', D: '#9ece6a', E: '#e0af68', F: '#7dcfff' };

const state = { notes: [], bySlug: new Map(), current: null, raw: '', graphMode: 'path',
  filter: 'all', query: '', sequence: [] };
let cy = null;

const $ = (sel) => document.querySelector(sel);

// ---------- toast ----------
function toast(msg, type = '') {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('fade'); setTimeout(() => t.remove(), 300); }, 2600);
}

// chuẩn hoá để tìm kiếm không phân biệt dấu / hoa thường
function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
}

// ---------- marked + KaTeX ----------
// Cho KaTeX "chiếm" token $...$ / $$...$$ TRƯỚC khi marked xử lý (nếu để marked
// chạy trước, nó sẽ phá \\, &, backslash trong công thức).
if (typeof marked !== 'undefined' && typeof katex !== 'undefined') {
  const renderTex = (tex, display) => {
    try { return katex.renderToString(tex, { displayMode: display, throwOnError: false }); }
    catch { return display ? `$$${tex}$$` : `$${tex}$`; }
  };
  marked.use({
    extensions: [
      {
        name: 'mathBlock', level: 'block',
        start(src) { return src.indexOf('$$'); },
        tokenizer(src) {
          const m = /^\$\$([\s\S]+?)\$\$/.exec(src);
          if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim() };
        },
        renderer(t) { return renderTex(t.text, true); },
      },
      {
        name: 'mathInline', level: 'inline',
        start(src) { return src.indexOf('$'); },
        tokenizer(src) {
          const m = /^\$([^$\n]+?)\$/.exec(src);
          if (m) return { type: 'mathInline', raw: m[0], text: m[1] };
        },
        renderer(t) { return renderTex(t.text, false); },
      },
    ],
  });
}

// ---------- data ----------
async function loadNotes() {
  const res = await fetch('/api/notes');
  const { notes } = await res.json();
  state.notes = notes;
  state.bySlug = new Map(notes.map((n) => [n.slug, n]));
  state.sequence = computeSequence();
  renderSidebar();
  renderOverall();
  renderGraph();
}

// thứ tự đọc phẳng toàn cục: nhánh A→F (theo order), rồi note không nhánh
function computeSequence() {
  const seq = [];
  const groups = {};
  const noBranch = [];
  for (const n of state.notes) {
    if (n.branch) (groups[n.branch] ||= []).push(n);
    else noBranch.push(n);
  }
  for (const b of Object.keys(BRANCH_NAMES).filter((x) => groups[x])) {
    groups[b].sort((x, y) => (x.order ?? 99) - (y.order ?? 99)).forEach((n) => seq.push(n.slug));
  }
  noBranch.sort((a, b) => a.title.localeCompare(b.title)).forEach((n) => seq.push(n.slug));
  return seq;
}

// thanh tiến độ tổng trên topbar
function renderOverall() {
  const total = state.notes.length;
  const done = state.notes.filter((n) => DONE.has(n.status)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $('#ov-fill').style.width = pct + '%';
  $('#ov-label').textContent = `${done}/${total} · ${pct}%`;
}

// ---------- sidebar (lộ trình đọc) ----------
function passesFilter(n) {
  if (state.filter !== 'all' && n.status !== state.filter) return false;
  if (state.query && !norm(n.title).includes(state.query) && !norm(n.slug).includes(state.query)) return false;
  return true;
}

function renderSidebar() {
  const el = $('#sidebar-list');
  el.innerHTML = '';
  const groups = {};
  const noBranch = [];
  for (const n of state.notes) {
    if (n.branch) (groups[n.branch] ||= []).push(n);
    else noBranch.push(n);
  }
  const order = Object.keys(BRANCH_NAMES).filter((b) => groups[b]);
  let shown = 0;
  for (const b of order) {
    const all = groups[b].sort((x, y) => (x.order ?? 99) - (y.order ?? 99));
    const items = all.filter(passesFilter);
    if (!items.length) continue;
    shown += items.length;
    const done = all.filter((n) => DONE.has(n.status)).length; // tiến độ tính trên toàn nhánh
    const pct = Math.round((done / all.length) * 100);
    const g = document.createElement('div');
    g.className = 'branch-group';
    g.innerHTML = `<h3>${BRANCH_NAMES[b]} — ${done}/${all.length}</h3>
      <div class="branch-bar"><i style="width:${pct}%"></i></div>`;
    for (const n of items) g.appendChild(noteItem(n));
    el.appendChild(g);
  }
  const others = noBranch.filter(passesFilter).sort((a, b) => a.title.localeCompare(b.title));
  if (others.length) {
    shown += others.length;
    const g = document.createElement('div');
    g.className = 'branch-group';
    g.innerHTML = `<h3>Khác</h3>`;
    for (const n of others) g.appendChild(noteItem(n));
    el.appendChild(g);
  }
  if (!shown) el.innerHTML = '<div class="no-match">Không có note nào khớp.</div>';
}

function noteItem(n) {
  const d = document.createElement('div');
  d.className = 'note-item' + (n.slug === state.current ? ' active' : '');
  d.dataset.slug = n.slug;
  d.innerHTML = `<span class="ord">${n.order ?? ''}</span><span>${n.status}</span><span>${n.title}</span>`;
  d.onclick = () => openNote(n.slug);
  return d;
}

// ---------- graph (cytoscape) ----------
const COL_W = 250; // bề rộng mỗi làn nhánh
const ROW_H = 76;  // khoảng cách dọc giữa các note

const GRAPH_STYLE = [
  // note (card bo góc): viền = trạng thái, vạch trái = nhánh
  { selector: 'node.note', style: {
    shape: 'round-rectangle', 'background-color': '#252a40', 'background-opacity': 0.97,
    'border-width': 2, 'border-color': 'data(color)',
    label: 'data(label)', color: '#c0caf5', 'font-size': 10,
    'text-wrap': 'wrap', 'text-max-width': 132, 'text-valign': 'center', 'text-halign': 'center',
    width: 158, height: 46, 'transition-property': 'border-width, opacity', 'transition-duration': '120ms' } },
  { selector: 'node.note.sel', style: { 'border-color': '#7aa2f7', 'border-width': 4, 'background-color': '#2c3350' } },
  { selector: 'node.note.hover', style: { 'border-width': 3 } },
  // cạnh: thứ tự đọc (đậm, có mũi tên) vs liên kết chéo (mờ, đứt)
  { selector: 'edge[dep = 1]', style: {
    width: 2.5, 'line-color': '#7aa2f7', 'line-opacity': 0.8, 'target-arrow-color': '#7aa2f7',
    'target-arrow-shape': 'triangle', 'arrow-scale': 1, 'curve-style': 'bezier' } },
  { selector: 'edge[dep = 0]', style: {
    width: 1, 'line-color': '#565f89', 'line-style': 'dashed', 'line-opacity': 0.35,
    'target-arrow-shape': 'none', 'curve-style': 'bezier' } },
  // làm mờ phần ngoài vùng đang hover (focus + context)
  { selector: '.faded', style: { opacity: 0.1 } },
];

// Độ sâu phụ thuộc của mỗi note: entry (không tiền đề) = 0, càng cần nhiều tiền đề càng sang phải.
function computeDepths() {
  const memo = new Map();
  const visiting = new Set();
  function depth(slug) {
    if (memo.has(slug)) return memo.get(slug);
    if (visiting.has(slug)) return 0; // chặn vòng lặp
    visiting.add(slug);
    const n = state.bySlug.get(slug);
    const prereqs = (n?.prev || []).filter((p) => state.bySlug.has(p));
    let d = 0;
    for (const p of prereqs) d = Math.max(d, depth(p) + 1);
    visiting.delete(slug);
    memo.set(slug, d);
    return d;
  }
  for (const n of state.notes) depth(n.slug);
  return memo;
}

function buildGraphElements() {
  const elements = [];
  const seen = new Set(state.notes.map((n) => n.slug));

  // xếp theo cột = độ sâu phụ thuộc (trái → phải)
  const depths = computeDepths();
  const byDepth = {};
  for (const n of state.notes) (byDepth[depths.get(n.slug)] ||= []).push(n);
  const levels = Object.keys(byDepth).map(Number).sort((a, b) => a - b);

  const positions = {};
  for (const d of levels) {
    const items = byDepth[d].sort(
      (x, y) =>
        (x.branch || 'Z').localeCompare(y.branch || 'Z') ||
        (x.order ?? 99) - (y.order ?? 99) ||
        x.title.localeCompare(y.title),
    );
    const offset = ((items.length - 1) * ROW_H) / 2; // căn giữa cột theo chiều dọc
    items.forEach((n, row) => {
      positions[n.slug] = { x: d * COL_W, y: row * ROW_H - offset };
      elements.push({
        data: {
          id: n.slug,
          label: n.title,
          color: STATUS_COLOR[n.status] || '#565f89',
          branch: BRANCH_COLOR[n.branch] || '#565f89',
        },
        classes: 'note',
      });
    });
  }

  // cạnh: thứ tự đọc (prev → note, đi sang phải) + liên kết chéo (mờ)
  for (const n of state.notes) {
    for (const p of n.prev || []) {
      if (seen.has(p)) elements.push({ data: { id: `dep-${p}-${n.slug}`, source: p, target: n.slug, dep: 1 } });
    }
    const skip = new Set([...(n.prev || []), ...(n.next || [])]);
    for (const l of n.links || []) {
      if (seen.has(l) && l !== n.slug && !skip.has(l)) {
        elements.push({ data: { id: `lnk-${n.slug}-${l}`, source: n.slug, target: l, dep: 0 } });
      }
    }
  }
  return { elements, positions };
}

function renderGraph() {
  if (cy) { cy.destroy(); cy = null; } // huỷ instance cũ, tránh leak khi render lại
  const mount = document.getElementById('cy');
  if (!mount) return;
  const { elements, positions } = buildGraphElements();

  const layout = state.graphMode === 'web'
    ? { name: 'cose', animate: false, nodeRepulsion: 9000, idealEdgeLength: 70, padding: 30 }
    : { name: 'preset', positions: (n) => positions[n.id()], fit: true, padding: 36 };

  cy = cytoscape({
    container: mount,
    elements,
    style: GRAPH_STYLE,
    layout,
    wheelSensitivity: 0.2,
    minZoom: 0.2,
    maxZoom: 2.5,
  });

  // mở note khi bấm (chỉ node note, không phải làn)
  cy.on('tap', 'node.note', (e) => openNote(e.target.id()));

  // hover: sáng vùng liên quan, mờ phần còn lại
  const dimmable = cy.nodes('.note').add(cy.edges());
  cy.on('mouseover', 'node.note', (e) => {
    const hood = e.target.closedNeighborhood();
    dimmable.difference(hood).addClass('faded');
    e.target.addClass('hover');
  });
  cy.on('mouseout', 'node.note', () => cy.elements().removeClass('faded hover'));

  if (state.current) highlightGraph(state.current);
}

function setGraphMode(mode) {
  state.graphMode = mode;
  document.querySelectorAll('#graph-toolbar [data-mode]').forEach((b) =>
    b.classList.toggle('active', b.dataset.mode === mode));
  renderGraph();
}

function fitGraph() {
  if (cy) cy.animate({ fit: { padding: 36 } }, { duration: 250 });
}

function highlightGraph(slug) {
  if (!cy) return;
  cy.nodes('.note').removeClass('sel');
  const node = cy.getElementById(slug);
  if (node && node.length) {
    node.addClass('sel');
    cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 0.8) }, { duration: 220 });
  }
}

// ---------- viewer / open note ----------
async function openNote(slug) {
  const res = await fetch(`/api/note/${slug}`);
  if (!res.ok) return;
  const { content } = await res.json();
  state.current = slug;
  state.raw = content;

  const meta = state.bySlug.get(slug);
  $('#note-title').textContent = meta ? `${meta.status} ${meta.title}` : slug;
  if (meta) $('#status-select').value = meta.status;

  let html = marked.parse(content);
  html = html.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, s, alias) =>
    `<a class="wikilink" data-slug="${s.trim()}">${(alias || s).trim()}</a>`);
  const viewer = $('#viewer');
  viewer.innerHTML = html;
  viewer.querySelectorAll('a.wikilink').forEach((a) => {
    a.onclick = () => {
      const t = a.dataset.slug;
      if (state.bySlug.has(t)) openNote(t);
      else toast('Chưa có note: ' + t, 'err');
    };
  });

  $('#editor').hidden = true;
  $('#viewer').hidden = false;
  $('#btn-edit').hidden = false;
  $('#btn-save').hidden = true;
  updateNav(slug);

  document.querySelectorAll('.note-item').forEach((e) =>
    e.classList.toggle('active', e.dataset.slug === slug));
  highlightGraph(slug);
}

// ---------- điều hướng Trước / Sau theo lộ trình ----------
function updateNav(slug) {
  const nav = $('#note-nav');
  const seq = state.sequence;
  const i = seq.indexOf(slug);
  if (i === -1) { nav.hidden = true; return; }
  nav.hidden = false;
  const prev = i > 0 ? seq[i - 1] : null;
  const next = i < seq.length - 1 ? seq[i + 1] : null;
  const bp = $('#nav-prev'), bn = $('#nav-next');
  bp.disabled = !prev; bn.disabled = !next;
  bp.title = prev ? '‹ ' + (state.bySlug.get(prev)?.title || prev) : '';
  bn.title = next ? (state.bySlug.get(next)?.title || next) + ' ›' : '';
  bp.dataset.slug = prev || ''; bn.dataset.slug = next || '';
  $('#nav-pos').textContent = `${i + 1} / ${seq.length}`;
}

// ---------- editor ----------
$('#btn-edit').onclick = () => {
  if (!state.current) return;
  $('#editor').value = state.raw || '';
  $('#viewer').hidden = true;
  $('#editor').hidden = false;
  $('#btn-edit').hidden = true;
  $('#btn-save').hidden = false;
  $('#note-nav').hidden = true;
  $('#editor').focus();
};

$('#btn-save').onclick = async () => {
  if (!state.current) return;
  const content = $('#editor').value;
  const res = await fetch(`/api/note/${state.current}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    toast('Lưu thất bại', 'err');
    return;
  }
  const slug = state.current;
  await loadNotes();
  await openNote(slug);
  toast('Đã lưu', 'ok');
};

$('#status-select').onchange = async (e) => {
  if (!state.current) return;
  const status = e.target.value;
  const res = await fetch(`/api/note/${state.current}/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    toast('Đổi trạng thái thất bại', 'err');
    return;
  }
  const slug = state.current;
  await loadNotes();
  await openNote(slug);
  toast('Đã đổi trạng thái ' + status, 'ok');
};

// ---------- new note ----------
function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// modal tạo note mới
function openPrompt() {
  $('#prompt-modal').hidden = false;
  const inp = $('#prompt-input');
  inp.value = '';
  $('#prompt-slug').textContent = '';
  inp.focus();
}
function closePrompt() { $('#prompt-modal').hidden = true; }

$('#btn-new').onclick = openPrompt;
$('#prompt-close').onclick = closePrompt;
$('#prompt-cancel').onclick = closePrompt;
$('#prompt-modal').onclick = (e) => { if (e.target.id === 'prompt-modal') closePrompt(); };
$('#prompt-input').oninput = (e) => {
  const slug = slugify(e.target.value);
  $('#prompt-slug').textContent = slug ? 'file: ' + slug + '.md' : '';
};
$('#prompt-input').onkeydown = (e) => {
  if (e.key === 'Enter') { e.preventDefault(); $('#prompt-ok').click(); }
};

$('#prompt-ok').onclick = async () => {
  const title = $('#prompt-input').value.trim();
  if (!title) return;
  const slug = slugify(title);
  if (!slug) { toast('Tên không hợp lệ', 'err'); return; }
  const res = await fetch('/api/note', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug, title }),
  });
  if (res.status === 409) { toast('Note đã tồn tại: ' + slug, 'err'); return; }
  if (!res.ok) { toast('Tạo thất bại', 'err'); return; }
  closePrompt();
  await loadNotes();
  await openNote(slug);
  toast('Đã tạo note', 'ok');
  $('#btn-edit').click();
};

// ---------- graph toolbar ----------
document.querySelectorAll('#graph-toolbar [data-mode]').forEach((b) => {
  b.onclick = () => setGraphMode(b.dataset.mode);
});
const btnFit = document.getElementById('btn-fit');
if (btnFit) btnFit.onclick = fitGraph;

// ---------- tìm kiếm + lọc sidebar ----------
$('#search').oninput = (e) => { state.query = norm(e.target.value); renderSidebar(); };
document.querySelectorAll('#filters .chip').forEach((c) => {
  c.onclick = () => {
    state.filter = c.dataset.status;
    document.querySelectorAll('#filters .chip').forEach((x) => x.classList.toggle('active', x === c));
    renderSidebar();
  };
});

// ---------- điều hướng Trước / Sau ----------
function goRelative(dir) {
  const seq = state.sequence;
  const i = state.current ? seq.indexOf(state.current) : -1;
  const j = i === -1 ? (dir > 0 ? 0 : seq.length - 1) : i + dir;
  if (j >= 0 && j < seq.length) openNote(seq[j]);
}
$('#nav-prev').onclick = () => goRelative(-1);
$('#nav-next').onclick = () => goRelative(1);

// ---------- phím tắt ----------
function inEditing() {
  const a = document.activeElement;
  return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT');
}
function anyModalOpen() {
  return !$('#import-modal').hidden || !$('#prompt-modal').hidden;
}
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd+S: lưu khi đang sửa
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    if (!$('#btn-save').hidden) { e.preventDefault(); $('#btn-save').click(); }
    return;
  }
  if (e.key === 'Escape') {
    if (!$('#prompt-modal').hidden) return closePrompt();
    if (!$('#import-modal').hidden) return closeImport();
    if (!$('#btn-save').hidden && state.current) return openNote(state.current); // huỷ sửa
    return;
  }
  if (anyModalOpen()) return;
  // các phím sau chỉ chạy khi không gõ trong ô nhập
  if (inEditing()) return;
  if (e.key === '/') { e.preventDefault(); $('#search').focus(); return; }
  if (e.key === 'e' || e.key === 'E') {
    if (state.current && !$('#btn-edit').hidden) { e.preventDefault(); $('#btn-edit').click(); }
    return;
  }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goRelative(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); goRelative(1); }
});

// ---------- thanh kéo-thả chỉnh rộng cột ----------
function initResizers() {
  const main = document.querySelector('main');
  const readVar = (name, fallback) => {
    const v = main.style.getPropertyValue(name).trim();
    return v ? parseFloat(v) : fallback;
  };
  document.querySelectorAll('.resizer').forEach((rz) => {
    rz.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const side = rz.dataset.resize;
      const startX = e.clientX;
      const startC1 = readVar('--c1', 300);
      const startC3 = readVar('--c3', 460);
      rz.classList.add('dragging');
      document.body.classList.add('col-resizing');
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        if (side === 'left') {
          main.style.setProperty('--c1', Math.min(600, Math.max(180, startC1 + dx)) + 'px');
        } else {
          main.style.setProperty('--c3', Math.min(900, Math.max(260, startC3 - dx)) + 'px');
        }
        if (cy) cy.resize();
      };
      const onUp = () => {
        rz.classList.remove('dragging');
        document.body.classList.remove('col-resizing');
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        if (cy) cy.resize();
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  });
}
initResizers();
window.addEventListener('resize', () => { if (cy) cy.resize(); });

// ---------- nhập slide → AI tách node ----------
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error('Không đọc được file'));
    r.onload = () => resolve(String(r.result).split(',')[1] || ''); // bỏ tiền tố data:...;base64,
    r.readAsDataURL(file);
  });
}

function openImport() { $('#import-modal').hidden = false; }
function closeImport() {
  $('#import-modal').hidden = true;
  $('#import-body').innerHTML = '';
  $('#import-status').textContent = '';
  $('#import-save').hidden = true;
  $('#import-file').value = '';
}

$('#btn-import').onclick = () => $('#import-file').click();
$('#import-close').onclick = closeImport;
$('#import-modal').onclick = (e) => { if (e.target.id === 'import-modal') closeImport(); };

$('#import-file').onchange = async () => {
  const file = $('#import-file').files[0];
  if (!file) return;
  openImport();
  $('#import-title').textContent = `📄 ${file.name}`;
  $('#import-save').hidden = true;
  $('#import-status').textContent = '';
  $('#import-body').innerHTML = '<div class="import-spin">⏳ Claude đang đọc slide và tách node… (có thể mất 20–60 giây)</div>';
  try {
    const dataBase64 = await readFileAsBase64(file);
    const res = await fetch('/api/import-slide', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ dataBase64 }),
    });
    const data = await res.json();
    if (!res.ok) {
      $('#import-body').innerHTML = `<div class="import-hint">❌ ${data.error || 'Lỗi không rõ'}</div>`;
      return;
    }
    renderImportCards(data.notes || []);
  } catch (e) {
    $('#import-body').innerHTML = `<div class="import-hint">❌ ${e.message}</div>`;
  }
};

function importCard(n) {
  const card = document.createElement('div');
  card.className = 'note-card';
  const joins = (a) => (a || []).join(', ');
  card.innerHTML = `
    <div class="nc-head">
      <input type="checkbox" class="nc-check" checked />
      <input class="nc-slug" value="${escAttr(n.slug)}" placeholder="slug" />
      <input class="nc-branch" value="${escAttr(n.branch)}" placeholder="A–F" />
      <input class="nc-order" type="number" value="${n.order ?? ''}" placeholder="#" />
    </div>
    <div class="nc-grid">
      <div class="nc-full"><label>Tiêu đề</label><input class="nc-title" value="${escAttr(n.title)}" /></div>
      <div class="nc-full"><label>Tóm tắt 1 câu</label><input class="nc-summary" value="${escAttr(n.summary)}" /></div>
      <div><label>Tiền đề (prev) — cách nhau dấu phẩy</label><input class="nc-prev" value="${escAttr(joins(n.prev))}" /></div>
      <div><label>Học tiếp (next)</label><input class="nc-next" value="${escAttr(joins(n.next))}" /></div>
      <div class="nc-full"><label>Tags</label><input class="nc-tags" value="${escAttr(joins(n.tags))}" /></div>
      <div class="nc-full"><label>Nội dung (markdown)</label><textarea class="nc-body">${escHtml(n.body || '')}</textarea></div>
    </div>`;
  const check = card.querySelector('.nc-check');
  check.onchange = () => card.classList.toggle('off', !check.checked);
  return card;
}

function escAttr(s) { return String(s ?? '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function escHtml(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function splitList(s) { return String(s || '').split(/[,\s]+/).map((x) => x.trim()).filter(Boolean); }

function renderImportCards(notes) {
  const body = $('#import-body');
  body.innerHTML = '';
  if (!notes.length) {
    body.innerHTML = '<div class="import-hint">Không tách được note nào từ slide này.</div>';
    return;
  }
  for (const n of notes) body.appendChild(importCard(n));
  $('#import-status').textContent = `${notes.length} note đề xuất — sửa/bỏ chọn nếu cần.`;
  $('#import-save').hidden = false;
}

$('#import-save').onclick = async () => {
  const cards = [...document.querySelectorAll('#import-body .note-card')].filter(
    (c) => c.querySelector('.nc-check').checked);
  if (!cards.length) { toast('Chưa chọn note nào', 'err'); return; }
  const notes = cards.map((c) => {
    const v = (sel) => c.querySelector(sel).value.trim();
    const orderRaw = v('.nc-order');
    return {
      slug: v('.nc-slug'),
      title: v('.nc-title'),
      summary: v('.nc-summary'),
      branch: v('.nc-branch'),
      order: orderRaw ? Number(orderRaw) : 0,
      prev: splitList(v('.nc-prev')),
      next: splitList(v('.nc-next')),
      tags: splitList(v('.nc-tags')),
      body: c.querySelector('.nc-body').value,
    };
  });
  $('#import-save').disabled = true;
  $('#import-status').textContent = 'Đang lưu…';
  try {
    const res = await fetch('/api/import-save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    const { saved = [], skipped = [] } = await res.json();
    await loadNotes();
    toast(`✅ Đã lưu ${saved.length} note`, 'ok');
    if (skipped.length) toast(`Bỏ qua ${skipped.length}: ${skipped.map((s) => `${s.slug} (${s.reason})`).join(', ')}`, 'err');
    closeImport();
  } catch (e) {
    toast('Lưu thất bại: ' + e.message, 'err');
  } finally {
    $('#import-save').disabled = false;
  }
};

loadNotes();
