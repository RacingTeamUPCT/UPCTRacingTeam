/* Noticias del blog: lee content/blog/*.md y genera data/blog.js (que usan el listado, la portada y las páginas de cada noticia). */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { imageSize } from 'image-size';
import { ROOT } from './config.mjs';

const DIR = path.join(ROOT, 'content', 'blog');
const DEFAULT_CATEGORIES = ['Taller', 'Competición', 'Patrocinadores', 'Equipo', 'Eventos'];

function fail(file, msg) { throw new Error(`content/blog/${file}: ${msg}`); }

/* Párrafos: bloques separados por una línea en blanco; los saltos de línea dentro de un bloque se unen con un espacio */
function paragraphs(text) {
  return String(text || '').split(/\r?\n\s*\r?\n/).map((p) => p.replace(/\s*\r?\n\s*/g, ' ').trim()).filter(Boolean);
}

function size(src) {
  try { const d = imageSize(fs.readFileSync(path.join(ROOT, src))); return { ancho: d.width, alto: d.height }; }
  catch { return {}; }
}

function parseFile(file) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8').replace(/^﻿/, '');
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(raw);
  if (!m) fail(file, 'falta la cabecera entre líneas «---» (título, fecha, categoría…)');
  const fm = YAML.parse(m[1], { schema: 'core' }) || {};
  const parts = String(m[2] || '').split(/^---EN---[ \t]*$/m);
  const id = file.replace(/\.md$/i, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(file, 'el nombre del archivo solo puede llevar minúsculas, números y guiones (sin tildes ni espacios)');
  if (!fm.titulo) fail(file, 'falta «titulo»');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.fecha || ''))) fail(file, '«fecha» debe ser AAAA-MM-DD (por ejemplo 2026-10-25)');
  if (!fm.categoria) fail(file, 'falta «categoria»');

  const post = { id, titulo: String(fm.titulo), fecha: String(fm.fecha), categoria: String(fm.categoria) };
  if (fm.autor) post.autor = String(fm.autor);
  if (fm.resumen) post.resumen = String(fm.resumen);
  if (fm.video) {
    post.video = String(fm.video);
    if (fm.poster) post.poster = String(fm.poster);
    if (fm.videoAlt) post.videoAlt = String(fm.videoAlt);
  }
  if (fm.imagen) {
    if (!fm.imagenAlt) fail(file, '«imagen» necesita su descripción en «imagenAlt»');
    post.foto = String(fm.imagen);
    post.fotoAlt = String(fm.imagenAlt);
  }
  if (Array.isArray(fm.fotos) && fm.fotos.length) {
    post.fotos = fm.fotos.map((f, i) => {
      if (!f || !f.src) fail(file, `la foto ${i + 1} de «fotos» no tiene «src»`);
      if (!f.alt) fail(file, `la foto ${i + 1} (${f.src}) necesita su descripción en «alt»`);
      const o = { src: String(f.src), ...(f.ancho && f.alto ? { ancho: f.ancho, alto: f.alto } : size(String(f.src))), alt: String(f.alt) };
      if (f.en) o.en = String(f.en);
      return o;
    });
  }
  post.cuerpo = paragraphs(parts[0]);
  if (!post.cuerpo.length) fail(file, 'la noticia no tiene texto');

  const en = fm.en || {};
  const enBody = paragraphs(parts[1]);
  if (en.titulo || en.resumen || en.imagenAlt || en.videoAlt || enBody.length) {
    post.en = {};
    if (en.titulo) post.en.titulo = String(en.titulo);
    if (en.resumen) post.en.resumen = String(en.resumen);
    if (en.imagenAlt) post.en.fotoAlt = String(en.imagenAlt);
    if (en.videoAlt) post.en.videoAlt = String(en.videoAlt);
    if (enBody.length) post.en.cuerpo = enBody;
  }
  return post;
}

export function loadPosts() {
  if (!fs.existsSync(DIR)) return [];
  const files = fs.readdirSync(DIR).filter((f) => /\.md$/i.test(f) && !/^(readme|_)/i.test(f));
  const seen = new Set();
  const posts = files.map((f) => {
    const p = parseFile(f);
    if (seen.has(p.id)) fail(f, 'identificador repetido');
    seen.add(p.id);
    return p;
  });
  return posts.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

export function writeBlogData(posts) {
  const cats = [...DEFAULT_CATEGORIES];
  posts.forEach((p) => { if (!cats.includes(p.categoria)) cats.push(p.categoria); });
  const out =
`/* ==========================================================================
   UPCT Racing Team — Blog   (ARCHIVO GENERADO: no se edita a mano)
   Lo crea "npm run build" a partir de las noticias de content/blog/*.md.
   Para publicar una noticia, mira el README (apartado «Publicar una noticia»).
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.blog = ${JSON.stringify({ categorias: cats, posts }, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'blog.js'), out, 'utf8');
}
