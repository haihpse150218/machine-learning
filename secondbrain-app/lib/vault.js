import { readdir, readFile, writeFile, rename, access } from 'node:fs/promises';
import { join } from 'node:path';
import { parseNote } from './parse.js';

// Tên thiết bị dành riêng trên Windows — cấm để tránh I/O treo/lỗi.
const RESERVED = new Set([
  'con', 'prn', 'aux', 'nul',
  'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
  'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
]);

export function isValidSlug(slug) {
  return (
    typeof slug === 'string' &&
    /^[a-z0-9-]+$/.test(slug) &&
    !RESERVED.has(slug)
  );
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
