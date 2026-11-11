/* sitemap.xml: todas las páginas (español e inglés, con hreflang) y las noticias */
import fs from 'node:fs';
import path from 'node:path';
import { DIST, SITE_URL } from './config.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* entries: [{ es: '/equipo.html', en: '/en/equipo.html', lastmod?: '2026-10-25' }] */
export function writeSitemap(entries) {
  const urls = [];
  for (const e of entries) {
    for (const lang of ['es', 'en']) {
      urls.push(
        '  <url>\n' +
        `    <loc>${esc(SITE_URL + e[lang])}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '') +
        `    <xhtml:link rel="alternate" hreflang="es" href="${esc(SITE_URL + e.es)}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="en" href="${esc(SITE_URL + e.en)}"/>\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(SITE_URL + e.es)}"/>\n` +
        '  </url>'
      );
    }
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8');
}
