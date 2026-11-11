/* ==========================================================================
   Build de la web (npm run build)  →  carpeta dist/
   1. Noticias: content/blog/*.md  →  data/blog.js
   2. Dossier: lee el tamaño del PDF  →  data/dossier.js
   3. Garaje: fotos de assets/img/garaje/<departamento>/  →  data/garaje-fotos.js
   4. Copia css, js, data y assets a dist/
   5. Pre-genera cada página en español (/) e inglés (/en/) y cada noticia (/blog/<id>.html)
   6. sitemap.xml
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DIST, PAGES, COPY_DIRS, COPY_FILES, pagePath, postPath } from './config.mjs';
import { loadPosts, writeBlogData } from './blog.mjs';
import { writeGarajeData } from './garaje.mjs';
import { prepareSource, render, finish, cleanRuntime, decorateHead, decoratePost, auditImages } from './prerender.mjs';
import { writeSitemap } from './sitemap.mjs';

const t0 = Date.now();
const errors = [];
const audit = [];

function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
const filePath = (urlPath) => (urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath).replace(/^\//, '');

/* 1-3. Datos generados */
const posts = loadPosts();
writeBlogData(posts);
console.log(`Noticias: ${posts.length}`);

const pdf = path.join(ROOT, 'assets', 'docs', 'dossier-patrocinio-upct-racing-team.pdf');
if (fs.existsSync(pdf)) {
  const file = path.join(ROOT, 'data', 'dossier.js');
  const old = fs.readFileSync(file, 'utf8');
  const next = old.replace(/bytes:\s*\d+/, 'bytes: ' + fs.statSync(pdf).size);
  if (next !== old) fs.writeFileSync(file, next, 'utf8');
}
const garaje = writeGarajeData();
console.log(`Garaje: fotos en ${garaje.length} departamento(s)`);

/* 4. dist/ */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const d of COPY_DIRS) fs.cpSync(path.join(ROOT, d), path.join(DIST, d), { recursive: true });
for (const f of COPY_FILES) if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));

/* 5. Páginas */
const read = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8').replace(/^﻿/, '');
const sitemap = [];

for (const lang of ['es', 'en']) {
  for (const name of PAGES) {
    const urlPath = pagePath(name, lang);
    const nested = lang === 'en';
    const dom = await render(prepareSource(read(name + '.html'), nested), urlPath, errors);
    const doc = dom.window.document;
    cleanRuntime(doc);
    decorateHead(doc, { canonical: urlPath, altEs: pagePath(name, 'es'), altEn: pagePath(name, 'en') });
    audit.push({ page: urlPath, ...auditImages(doc) });
    write(filePath(urlPath), dom.serialize());
    finish(dom);
    if (lang === 'es') sitemap.push({ es: pagePath(name, 'es'), en: pagePath(name, 'en') });
    console.log('  ' + urlPath);
  }
}

for (const p of posts) {
  for (const lang of ['es', 'en']) {
    const urlPath = postPath(p.id, lang);
    const dom = await render(prepareSource(read('noticia.html'), true), urlPath, errors);
    const doc = dom.window.document;
    cleanRuntime(doc);
    decorateHead(doc, { canonical: urlPath, altEs: postPath(p.id, 'es'), altEn: postPath(p.id, 'en') });
    decoratePost(dom, p, urlPath);
    audit.push({ page: urlPath, ...auditImages(doc) });
    write(filePath(urlPath), dom.serialize());
    finish(dom);
    console.log('  ' + urlPath);
  }
  sitemap.push({ es: postPath(p.id, 'es'), en: postPath(p.id, 'en'), lastmod: p.fecha });
}

/* 404 (solo español; ya lleva su <base href="/">) */
{
  const dom = await render(prepareSource(read('404.html'), false), '/404.html', errors);
  cleanRuntime(dom.window.document);
  write('404.html', dom.serialize());
  finish(dom);
}

/* 6. sitemap.xml */
writeSitemap(sitemap);

/* Informe */
console.log('\nImágenes por página (sin alt / vacías decorativas / vacías sin marcar como decorativas):');
for (const a of audit) {
  console.log(`  ${a.page.padEnd(42)} total ${String(a.total).padStart(3)}  sin alt ${a.missing.length}  alt="" ${a.empty}  sospechosas ${a.emptyMeaningful.length}`);
}
if (errors.length) {
  console.log('\nERRORES al ejecutar los scripts:');
  [...new Set(errors)].forEach((e) => console.log('  - ' + e));
}
console.log(`\nListo en ${((Date.now() - t0) / 1000).toFixed(1)} s → dist/`);
if (errors.length && process.env.STRICT) process.exit(1);
